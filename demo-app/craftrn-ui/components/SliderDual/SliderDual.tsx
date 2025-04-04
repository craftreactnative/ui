import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const config = {
  sliderHeight: 4,
  sliderWidth: 300,
  knobSize: 20,
  activeKnobScale: 1.2,
};

/**
 * Props for the SliderDual component.
 */
export type Props = {
  /**
   * Lowest value the left knob can reach.
   * @default 0
   */
  min: number;
  /**
   * Highest value the right knob can reach.
   * @default 100
   */
  max: number;
  /**
   * Initial value of the left knob.
   * @default min
   */
  minInitialValue?: number;
  /**
   * Initial value of the right knob.
   * @default max
   */
  maxInitialValue?: number;
  /**
   * Width of the slider.
   * @default 300
   */
  width?: number;
  /**
   * Callback function triggered when the slider's values change.
   */
  onValuesChange: ({ min, max }: { min: number; max: number }) => void;
};

const scaleSpringConfig = {
  mass: 0.5,
  damping: 15,
  stiffness: 200,
};

const positionSpringConfig = {
  mass: 0.2,
  damping: 50,
  stiffness: 300,
};

const useKnobAnimatedStyle = (
  position: SharedValue<number>,
  scale: SharedValue<number>,
) =>
  useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value - config.knobSize / 2 },
      { scale: scale.value },
    ],
  }));

export const SliderDual = ({
  min,
  max,
  width = config.sliderWidth,
  minInitialValue = min,
  maxInitialValue = max,
  onValuesChange,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  const sliderWidth = width - config.knobSize;

  const getPositionFromValue = (value: number) => {
    'worklet';
    return ((value - min) / (max - min)) * sliderWidth;
  };

  const leftPosition = useSharedValue(
    minInitialValue !== undefined ? getPositionFromValue(minInitialValue) : 0,
  );
  const rightPosition = useSharedValue(
    maxInitialValue !== undefined
      ? getPositionFromValue(maxInitialValue)
      : sliderWidth,
  );

  const leftPrevPosition = useSharedValue(0);
  const rightPrevPosition = useSharedValue(sliderWidth);

  const leftKnobScale = useSharedValue(1);
  const rightKnobScale = useSharedValue(1);
  const getSliderValue = useCallback(
    (pos: number) => {
      'worklet';
      return Math.min(
        Math.max(min, Math.round((pos / sliderWidth) * (max - min) + min)),
        max,
      );
    },
    [max, min, sliderWidth],
  );

  const notifyValueChange = useCallback(() => {
    'worklet';
    const values = {
      min: getSliderValue(leftPosition.value),
      max: getSliderValue(rightPosition.value),
    };
    runOnJS(onValuesChange)(values);
  }, [getSliderValue, leftPosition.value, onValuesChange, rightPosition.value]);

  const createKnobGesture = useCallback(
    ({
      position,
      prevPosition,
      scale,
      getConstrainedPosition,
    }: {
      position: SharedValue<number>;
      prevPosition: SharedValue<number>;
      scale: SharedValue<number>;
      getConstrainedPosition: (newPos: number) => number;
    }) =>
      Gesture.Pan()
        .minDistance(1)
        .onBegin(() => {
          'worklet';
          prevPosition.value = position.value;
          scale.value = withSpring(config.activeKnobScale, scaleSpringConfig);
        })
        .onUpdate(e => {
          'worklet';
          const newPosition = prevPosition.value + e.translationX;
          position.value = withSpring(getConstrainedPosition(newPosition), {
            ...positionSpringConfig,
            velocity: e.velocityX,
          });
          notifyValueChange();
        })
        .onFinalize(() => {
          'worklet';
          scale.value = withSpring(1, scaleSpringConfig);
          notifyValueChange();
        }),
    [notifyValueChange],
  );

  const getLeftConstrainedPosition = useCallback(
    (newPos: number) => {
      'worklet';
      return Math.max(
        0,
        Math.min(newPos, rightPosition.value - config.knobSize / 2),
      );
    },
    [rightPosition.value],
  );

  const getRightConstrainedPosition = useCallback(
    (newPos: number) => {
      'worklet';
      return Math.max(
        leftPosition.value + config.knobSize / 2,
        Math.min(newPos, sliderWidth),
      );
    },
    [leftPosition.value, sliderWidth],
  );

  const leftGesture = createKnobGesture({
    position: leftPosition,
    prevPosition: leftPrevPosition,
    scale: leftKnobScale,
    getConstrainedPosition: getLeftConstrainedPosition,
  });

  const rightGesture = createKnobGesture({
    position: rightPosition,
    prevPosition: rightPrevPosition,
    scale: rightKnobScale,
    getConstrainedPosition: getRightConstrainedPosition,
  });

  const leftKnobStyle = useKnobAnimatedStyle(leftPosition, leftKnobScale);
  const rightKnobStyle = useKnobAnimatedStyle(rightPosition, rightKnobScale);

  const fillStyle = useAnimatedStyle(() => ({
    left: leftPosition.value,
    width: rightPosition.value - leftPosition.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.slider(sliderWidth)}>
        <Animated.View style={[styles.fill, fillStyle]} />
        <GestureDetector gesture={leftGesture}>
          <Animated.View style={[styles.knob, leftKnobStyle]} />
        </GestureDetector>
        <GestureDetector gesture={rightGesture}>
          <Animated.View style={[styles.knob, rightKnobStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ borderRadius, colors }) => ({
  container: {
    minHeight: config.sliderHeight + config.knobSize,
    paddingTop: config.knobSize / 2,
  },
  slider: (width: number) => ({
    width,
    height: config.sliderHeight,
    backgroundColor: colors.borderPrimary,
    borderRadius: borderRadius.full,
  }),
  fill: {
    height: config.sliderHeight,
    backgroundColor: colors.accentPrimary,
    borderRadius: borderRadius.full,
    position: 'absolute',
  },
  knob: {
    width: config.knobSize,
    height: config.knobSize,
    borderRadius: borderRadius.full,
    position: 'absolute',
    backgroundColor: colors.accentPrimary,
    top: -(config.knobSize / 2 - config.sliderHeight / 2),
  },
}));
