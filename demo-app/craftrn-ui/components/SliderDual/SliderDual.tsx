import React, { useCallback, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
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
  /**
   * Step value for accessibility adjustments.
   * @default 1
   */
  accessibilityStep?: number;
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
  accessibilityStep = 1,
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

  const [leftAccessibilityValue, setLeftAccessibilityValue] =
    useState(minInitialValue);
  const [rightAccessibilityValue, setRightAccessibilityValue] =
    useState(maxInitialValue);

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
    const leftValue = getSliderValue(leftPosition.value);
    const rightValue = getSliderValue(rightPosition.value);
    const values = {
      min: leftValue,
      max: rightValue,
    };
    runOnJS(onValuesChange)(values);
    runOnJS(setLeftAccessibilityValue)(leftValue);
    runOnJS(setRightAccessibilityValue)(rightValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSliderValue, onValuesChange]);

  const adjustValue = useCallback(
    (knob: 'left' | 'right', action: 'increment' | 'decrement') => {
      'worklet';
      const isLeft = knob === 'left';
      const position = isLeft ? leftPosition : rightPosition;
      const currentValue = getSliderValue(position.value);

      const getConstrainedValue = () => {
        const step =
          action === 'increment' ? accessibilityStep : -accessibilityStep;
        const newValue = currentValue + step;

        if (isLeft) {
          return Math.max(
            min,
            Math.min(getSliderValue(rightPosition.value) - 1, newValue),
          );
        } else {
          return Math.max(
            getSliderValue(leftPosition.value) + 1,
            Math.min(max, newValue),
          );
        }
      };

      const constrainedValue = getConstrainedValue();
      const newPosition = getPositionFromValue(constrainedValue);
      position.value = withSpring(newPosition, positionSpringConfig);

      const label = isLeft ? 'Minimum' : 'Maximum';
      runOnJS(AccessibilityInfo.announceForAccessibility)(
        `${label} value: ${constrainedValue}`,
      );

      const leftValue = isLeft
        ? constrainedValue
        : getSliderValue(leftPosition.value);
      const rightValue = isLeft
        ? getSliderValue(rightPosition.value)
        : constrainedValue;
      const values = { min: leftValue, max: rightValue };

      runOnJS(onValuesChange)(values);
      if (isLeft) {
        runOnJS(setLeftAccessibilityValue)(constrainedValue);
      } else {
        runOnJS(setRightAccessibilityValue)(constrainedValue);
      }
    },
    [
      leftPosition,
      rightPosition,
      getSliderValue,
      getPositionFromValue,
      onValuesChange,
      accessibilityStep,
      min,
      max,
    ],
  );

  const createAccessibilityActionHandler = useCallback(
    (knob: 'left' | 'right') => (event: any) => {
      switch (event.nativeEvent.actionName) {
        case 'increment':
          adjustValue(knob, 'increment');
          break;
        case 'decrement':
          adjustValue(knob, 'decrement');
          break;
      }
    },
    [adjustValue],
  );

  const handleLeftAccessibilityAction =
    createAccessibilityActionHandler('left');
  const handleRightAccessibilityAction =
    createAccessibilityActionHandler('right');

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

  const getLeftConstrainedPosition = useCallback((newPos: number) => {
    'worklet';
    return Math.max(
      0,
      Math.min(newPos, rightPosition.value - config.knobSize / 2),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRightConstrainedPosition = useCallback(
    (newPos: number) => {
      'worklet';
      return Math.max(
        leftPosition.value + config.knobSize / 2,
        Math.min(newPos, sliderWidth),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sliderWidth],
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
          <Animated.View
            style={[styles.knob, leftKnobStyle]}
            accessible={true}
            role="slider"
            accessibilityLabel="Minimum value slider"
            accessibilityHint="Adjust the minimum value of the range"
            aria-valuemin={min}
            aria-valuemax={rightAccessibilityValue}
            aria-valuenow={leftAccessibilityValue}
            aria-valuetext={`Minimum: ${leftAccessibilityValue}`}
            accessibilityActions={[
              {
                name: 'increment',
                label: `Increase minimum value by ${accessibilityStep}`,
              },
              {
                name: 'decrement',
                label: `Decrease minimum value by ${accessibilityStep}`,
              },
            ]}
            onAccessibilityAction={handleLeftAccessibilityAction}
            importantForAccessibility="yes"
          />
        </GestureDetector>
        <GestureDetector gesture={rightGesture}>
          <Animated.View
            style={[styles.knob, rightKnobStyle]}
            accessible={true}
            role="slider"
            accessibilityLabel="Maximum value slider"
            accessibilityHint="Adjust the maximum value of the range"
            aria-valuemin={leftAccessibilityValue}
            aria-valuemax={max}
            aria-valuenow={rightAccessibilityValue}
            aria-valuetext={`Maximum: ${rightAccessibilityValue}`}
            accessibilityActions={[
              {
                name: 'increment',
                label: `Increase maximum value by ${accessibilityStep}`,
              },
              {
                name: 'decrement',
                label: `Decrease maximum value by ${accessibilityStep}`,
              },
            ]}
            onAccessibilityAction={handleRightAccessibilityAction}
            importantForAccessibility="yes"
          />
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
