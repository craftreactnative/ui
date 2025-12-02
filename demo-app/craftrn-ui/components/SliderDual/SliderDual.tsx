import React, { useCallback, useId, useState } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityInfo,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

const sizeConfig = {
  knob: 20,
  hitSlop: 4,
  sliderHeight: 4,
};

const animationConfig = {
  scale: {
    activeKnobScale: 1.2,
    spring: {
      mass: 0.2,
      damping: 15,
      stiffness: 300,
    },
    timing: {
      duration: 100,
      easing: Easing.out(Easing.cubic),
    },
  },
  position: {
    spring: {
      mass: 0.05,
      damping: 15,
      stiffness: 500,
    },
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
) => {
  const { theme } = useUnistyles();
  return useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value - sizeConfig.knob / 2 },
      { scale: scale.value },
    ],
    backgroundColor: theme.colors.contentAccentSecondary,
  }));
};

export const SliderDual = ({
  min,
  max,
  width = 300,
  minInitialValue = min,
  maxInitialValue = max,
  onValuesChange,
  step = 1,
  accessibilityStep = step,
}: Props) => {
  const id = useId();
  const { theme } = useUnistyles();

  const sliderWidth = width - sizeConfig.knob;

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
  const isDragging = useSharedValue(false);

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
    (shouldUpdate = true) => {
      'worklet';
      if (!shouldUpdate) return;

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
    [getSliderValue, onValuesChange, leftPosition, rightPosition],
  );

  useAnimatedReaction(
    () => {
      return {
        leftPos: leftPosition.value,
        rightPos: rightPosition.value,
        dragging: isDragging.value,
      };
    },
    (current, previous) => {
      if (
        current.dragging &&
        (current.leftPos !== previous?.leftPos ||
          current.rightPos !== previous?.rightPos)
      ) {
        const leftValue = getSliderValue(current.leftPos);
        const rightValue = getSliderValue(current.rightPos);
        runOnJS(onValuesChange)({ min: leftValue, max: rightValue });
      }
    },
    [isDragging, leftPosition, rightPosition, getSliderValue, onValuesChange],
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
      position.value = withSpring(newPosition, animationConfig.position.spring);

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
      animationConfig.position.spring,
    ],
  );

  const createAccessibilityActionHandler = useCallback(
    (knob: 'left' | 'right') => (event: AccessibilityActionEvent) => {
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
          isDragging.value = true;
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
        })
        .onFinalize(() => {
          'worklet';
          isDragging.value = false;
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
          position.value = withSpring(
            finalPosition,
            animationConfig.position.spring,
          );
          notifyValueChange();
        })
        .onTouchesDown(() => {
          'worklet';
          scale.value = withTiming(
            animationConfig.scale.activeKnobScale,
            animationConfig.scale.timing,
          );
        })
        .onTouchesUp(() => {
          'worklet';
          scale.value = withTiming(1, animationConfig.scale.timing);
        }),
    [
      isDragging,
      animationConfig.scale.activeKnobScale,
      animationConfig.scale.timing,
      animationConfig.position.spring,
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
    backgroundColor: theme.colors.contentAccentSecondary,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.slider(sliderWidth)}>
        <Animated.View
          key={`slider-dual-fill-${id}-${UnistylesRuntime.themeName}`}
          style={[styles.fill, fillStyle]}
        />
        <GestureDetector gesture={leftGesture}>
          <Animated.View
            key={`slider-dual-left-knob-${id}-${UnistylesRuntime.themeName}`}
            style={[styles.knob, leftKnobStyle]}
            hitSlop={sizeConfig.hitSlop}
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
            key={`slider-dual-right-knob-${id}-${UnistylesRuntime.themeName}`}
            style={[styles.knob, rightKnobStyle]}
            hitSlop={sizeConfig.hitSlop}
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

const styles = StyleSheet.create(theme => ({
  container: {
    minHeight: sizeConfig.sliderHeight + sizeConfig.knob,
    paddingTop: sizeConfig.knob / 2,
  },
  slider: (width: number) => ({
    width,
    height: sizeConfig.sliderHeight,
    backgroundColor: theme.colors.borderNeutralSecondary,
    borderRadius: theme.borderRadius.full,
  }),
  fill: {
    height: sizeConfig.sliderHeight,
    borderRadius: theme.borderRadius.full,
    position: 'absolute',
  },
  knob: {
    width: sizeConfig.knob,
    height: sizeConfig.knob,
    borderRadius: theme.borderRadius.full,
    position: 'absolute',
    top: -(sizeConfig.knob / 2 - sizeConfig.sliderHeight / 2),
  },
}));
