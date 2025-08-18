import React, { useCallback, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
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
  mass: 0.3,
  damping: 12,
  stiffness: 250,
};

const positionSpringConfig = {
  mass: 0.1,
  damping: 20,
  stiffness: 400,
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
  /**
   * Accessibility label for the slider.
   */
  ariaLabel?: string;
  /**
   * Accessibility hint for the slider.
   */
  accessibilityHint?: string;
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

export const Slider = ({
  min,
  max,
  width = config.sliderWidth,
  initialValue = min,
  onValueChange,
  ariaLabel,
  accessibilityHint = 'Increase or decrease the value',
  step = 1,
  accessibilityStep = step,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  const sliderWidth = width - config.knobSize;
  const [accessibilityValue, setAccessibilityValue] = useState(initialValue);

  const prevPosition = useSharedValue(0);
  const knobScale = useSharedValue(1);
  const lastCallbackTime = useSharedValue(0);

  const getPositionFromValue = (value: number) => {
    'worklet';
    return ((value - min) / (max - min)) * sliderWidth;
  };

  const position = useSharedValue(
    initialValue !== undefined ? getPositionFromValue(initialValue) : 0,
  );

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

      const value = getSliderValue(position.value);
      runOnJS(onValueChange)(value);
      runOnJS(setAccessibilityValue)(value);
    },
    [getSliderValue, onValueChange],
  );

  const adjustValue = useCallback(
    (action: 'increment' | 'decrement') => {
      'worklet';
      const currentValue = getSliderValue(position.value);
      const newValue =
        action === 'increment'
          ? Math.min(max, currentValue + accessibilityStep)
          : Math.max(min, currentValue - accessibilityStep);
      const newPosition = getPositionFromValue(newValue);
      position.value = withSpring(newPosition, positionSpringConfig);

      runOnJS(AccessibilityInfo.announceForAccessibility)(`${newValue}`);
      runOnJS(onValueChange)(newValue);
      runOnJS(setAccessibilityValue)(newValue);
    },
    [
      getSliderValue,
      max,
      accessibilityStep,
      min,
      getPositionFromValue,
      onValueChange,
    ],
  );

  const handleAccessibilityAction = useCallback(
    (event: any) => {
      switch (event.nativeEvent.actionName) {
        case 'increment':
          adjustValue('increment');
          break;
        case 'decrement':
          adjustValue('decrement');
          break;
      }
    },
    [adjustValue],
  );

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
      position.value = Math.max(0, Math.min(newPosition, sliderWidth));
      notifyValueChange(true);
    })
    .onFinalize(() => {
      'worklet';
      const rawValue = (position.value / sliderWidth) * (max - min) + min;
      const snappedValue = snapToStep(rawValue);
      const finalPosition = getPositionFromValue(snappedValue);

      position.value = withSpring(finalPosition, positionSpringConfig);
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
          <Animated.View
            style={[styles.knob, knobStyle]}
            accessible={true}
            role="slider"
            aria-label={ariaLabel}
            accessibilityHint={accessibilityHint}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={accessibilityValue}
            aria-valuetext={`${accessibilityValue}`}
            accessibilityActions={[
              {
                name: 'increment',
                label: `Increase value by ${accessibilityStep}`,
              },
              {
                name: 'decrement',
                label: `Decrease value by ${accessibilityStep}`,
              },
            ]}
            onAccessibilityAction={handleAccessibilityAction}
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
