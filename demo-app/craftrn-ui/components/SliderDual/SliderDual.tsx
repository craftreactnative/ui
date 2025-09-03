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
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const config = {
  sliderHeight: 4,
  sliderWidth: 300,
  knobSize: 20,
  activeKnobScale: 1.2,
};

const springConfigs = {
  scale: {
    mass: 0.3,
    damping: 12,
    stiffness: 250,
  },
  position: {
    mass: 0.1,
    damping: 20,
    stiffness: 400,
  },
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
   * Step value for adjustments.
   * @default 1
   */
  step?: number;
  /**
   * Step value for accessibility adjustments.
   * @default step
   */
  accessibilityStep?: number;
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
  step = 1,
  accessibilityStep = step,
}: Props) => {
  const { theme } = useUnistyles();
  const sliderWidth = width - config.knobSize;

  const getPositionFromValue = useCallback(
    (value: number) => {
      'worklet';
      return ((value - min) / (max - min)) * sliderWidth;
    },
    [min, max, sliderWidth],
  );

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
  const lastCallbackTime = useSharedValue(0);

  const [leftAccessibilityValue, setLeftAccessibilityValue] =
    useState(minInitialValue);
  const [rightAccessibilityValue, setRightAccessibilityValue] =
    useState(maxInitialValue);

  const snapToStep = useCallback(
    (value: number) => {
      'worklet';
      const steppedValue = Math.round((value - min) / step) * step + min;
      return Math.min(Math.max(min, steppedValue), max);
    },
    [min, max, step],
  );

  const getSliderValue = useCallback(
    (pos: number) => {
      'worklet';
      const rawValue = (pos / sliderWidth) * (max - min) + min;
      return snapToStep(rawValue);
    },
    [max, min, sliderWidth, snapToStep],
  );

  const notifyValueChange = useCallback(
    (throttle = false) => {
      'worklet';
      if (throttle) {
        const now = Date.now();
        if (now - lastCallbackTime.value <= 32) return;
        lastCallbackTime.value = now;
      }

      const leftValue = getSliderValue(leftPosition.value);
      const rightValue = getSliderValue(rightPosition.value);
      const values = {
        min: leftValue,
        max: rightValue,
      };
      runOnJS(onValuesChange)(values);
      runOnJS(setLeftAccessibilityValue)(leftValue);
      runOnJS(setRightAccessibilityValue)(rightValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getSliderValue, onValuesChange],
  );

  const adjustValue = useCallback(
    (knob: 'left' | 'right', action: 'increment' | 'decrement') => {
      'worklet';
      const isLeft = knob === 'left';
      const position = isLeft ? leftPosition : rightPosition;
      const currentValue = getSliderValue(position.value);

      const getConstrainedValue = () => {
        const stepToUse = accessibilityStep;
        const stepDirection = action === 'increment' ? stepToUse : -stepToUse;
        const newValue = currentValue + stepDirection;

        if (isLeft) {
          return Math.max(
            min,
            Math.min(getSliderValue(rightPosition.value) - step, newValue),
          );
        } else {
          return Math.max(
            getSliderValue(leftPosition.value) + step,
            Math.min(max, newValue),
          );
        }
      };

      const constrainedValue = getConstrainedValue();
      const newPosition = getPositionFromValue(constrainedValue);
      position.value = withSpring(newPosition, springConfigs.position);

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
      step,
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
      isLeft,
    }: {
      position: SharedValue<number>;
      prevPosition: SharedValue<number>;
      scale: SharedValue<number>;
      isLeft: boolean;
    }) =>
      Gesture.Pan()
        .minDistance(1)
        .onBegin(() => {
          'worklet';
          prevPosition.value = position.value;
          scale.value = withSpring(config.activeKnobScale, springConfigs.scale);
        })
        .onUpdate(e => {
          'worklet';
          const newPosition = prevPosition.value + e.translationX;
          const clampedPosition = Math.max(
            0,
            Math.min(newPosition, sliderWidth),
          );

          if (isLeft) {
            const maxAllowed =
              rightPosition.value - (step / (max - min)) * sliderWidth;
            position.value = Math.min(clampedPosition, Math.max(0, maxAllowed));
          } else {
            const minAllowed =
              leftPosition.value + (step / (max - min)) * sliderWidth;
            position.value = Math.max(
              clampedPosition,
              Math.min(sliderWidth, minAllowed),
            );
          }

          notifyValueChange(true);
        })
        .onFinalize(() => {
          'worklet';
          const rawValue = (position.value / sliderWidth) * (max - min) + min;
          const snappedValue = snapToStep(rawValue);

          let finalValue = snappedValue;
          if (isLeft) {
            const rightValue = getSliderValue(rightPosition.value);
            finalValue = Math.min(snappedValue, rightValue - step);
            finalValue = Math.max(min, finalValue);
          } else {
            const leftValue = getSliderValue(leftPosition.value);
            finalValue = Math.max(snappedValue, leftValue + step);
            finalValue = Math.min(max, finalValue);
          }

          const finalPosition = getPositionFromValue(finalValue);
          position.value = withSpring(finalPosition, springConfigs.position);
          scale.value = withSpring(1, springConfigs.scale);
          notifyValueChange();
        }),
    [
      notifyValueChange,
      sliderWidth,
      max,
      min,
      snapToStep,
      getPositionFromValue,
      getSliderValue,
      step,
      leftPosition,
      rightPosition,
    ],
  );

  const leftGesture = createKnobGesture({
    position: leftPosition,
    prevPosition: leftPrevPosition,
    scale: leftKnobScale,
    isLeft: true,
  });

  const rightGesture = createKnobGesture({
    position: rightPosition,
    prevPosition: rightPrevPosition,
    scale: rightKnobScale,
    isLeft: false,
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
