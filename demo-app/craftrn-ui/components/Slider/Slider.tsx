import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const config = {
  knobSize: 20,
  sliderHeight: 4,
  sliderWidth: 300,
  activeKnobScale: 1.2,
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

/**
 * Props for the Slider component.
 */
export type Props = {
  /**
   * Minimum value of the slider.
   * @default 0
   */
  min: number;
  /**
   * Maximum value of the slider.
   * @default 100
   */
  max: number;
  /**
   * Initial value of the slider.
   * @default min
   */
  initialValue?: number;
  /**
   * Width of the slider.
   * @default 300
   */
  width?: number;
  /**
   * Callback function triggered when the slider's value changes.
   */
  onValueChange: (value: number) => void;
};

export const Slider = ({
  min,
  max,
  width = config.sliderWidth,
  initialValue = min,
  onValueChange,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  const sliderWidth = width - config.knobSize;

  const getPositionFromValue = (value: number) => {
    'worklet';
    return ((value - min) / (max - min)) * sliderWidth;
  };

  const position = useSharedValue(
    initialValue !== undefined ? getPositionFromValue(initialValue) : 0,
  );

  const prevPosition = useSharedValue(0);
  const knobScale = useSharedValue(1);

  const getSliderValue = useCallback(
    (pos: number) => {
      'worklet';
      return Math.round((pos / sliderWidth) * (max - min) + min);
    },
    [max, min, sliderWidth],
  );

  const notifyValueChange = useCallback(() => {
    'worklet';
    const value = getSliderValue(position.value);
    runOnJS(onValueChange)(value);
  }, [getSliderValue, onValueChange, position]);

  const gesture = Gesture.Pan()
    .minDistance(1)
    .onBegin(() => {
      'worklet';
      prevPosition.value = position.value;
      knobScale.value = withSpring(config.activeKnobScale, scaleSpringConfig);
    })
    .onUpdate(e => {
      'worklet';
      const newPosition = prevPosition.value + e.translationX;
      position.value = withSpring(
        Math.max(0, Math.min(newPosition, sliderWidth)),
        {
          ...positionSpringConfig,
          velocity: e.velocityX,
        },
      );
      notifyValueChange();
    })
    .onFinalize(() => {
      'worklet';
      knobScale.value = withSpring(1, scaleSpringConfig);
      notifyValueChange();
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value - config.knobSize / 2 },
      { scale: knobScale.value },
    ],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    left: 0,
    width: position.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.slider(sliderWidth)}>
        <Animated.View style={[styles.fill, fillStyle]} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.knob, knobStyle]} />
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
