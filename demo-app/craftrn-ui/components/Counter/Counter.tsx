import React, { useCallback, useEffect, useState } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityInfo,
  AccessibilityProps,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { ButtonRound } from '../ButtonRound';
import { Text } from '../Text';
import { Minus } from './Minus';
import { Plus } from './Plus';

const AnimatedText = Animated.createAnimatedComponent(Text);

const animationConfig = {
  duration: 100,
  easing: Easing.ease,
};

/**
 * Props for the Counter component.
 */
export type Props = {
  /**
   * Callback function triggered when the counter value changes.
   */
  onValueChange: (value: number) => void;
  /**
   * The minimum value of the counter.
   * @default 0
   */
  minValue?: number;
  /**
   * The maximum value of the counter.
   * @default 10
   */
  maxValue?: number;
  /**
   * The controlled value of the counter.
   * When provided, the component can be controlled.
   * Must be between minValue and maxValue
   */
  value?: number;
  /**
   * The increment value of the counter.
   * @default 1
   */
  increment?: number;
  /**
   * The label to display when the counter is empty.
   * @default '0'
   */
  emptyLabel?: string;
};

type CounterProps = Props & AccessibilityProps;

export const Counter = ({
  onValueChange,
  value,
  minValue = 0,
  maxValue = 10,
  increment = 1,
  emptyLabel = '0',
  ...accessibilityProps
}: CounterProps) => {
  const [internalCount, setInternalCount] = useState(
    value !== undefined
      ? Math.min(Math.max(value, minValue), maxValue)
      : minValue,
  );

  // Shared values for animation
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (value !== undefined) {
      setInternalCount(Math.min(Math.max(value, minValue), maxValue));
    }
  }, [value, minValue, maxValue]);

  const count = Math.min(Math.max(internalCount, minValue), maxValue);
  const canIncrease = count < maxValue;
  const canDecrease = count > minValue;

  const updateCount = useCallback(
    (action: 'increment' | 'decrement') => {
      const newValue =
        count + (action === 'increment' ? increment : -increment);

      // Determine animation direction: -1 = down, 1 = up
      const direction = action === 'increment' ? -1 : 1;
      const distance = 10; // Large enough to move text out of view with overflow: hidden

      // Animate out
      translateY.value = withTiming(direction * distance, animationConfig);
      opacity.value = withTiming(0, animationConfig);

      // Update value and animate in after exit animation completes
      setTimeout(() => {
        setInternalCount(newValue);
        translateY.value = direction * -distance; // Start from opposite direction
        opacity.value = 0;

        translateY.value = withTiming(0, animationConfig);
        opacity.value = withTiming(1, animationConfig);
      }, animationConfig.duration / 2);

      onValueChange(newValue);
      AccessibilityInfo.announceForAccessibility(`${newValue}`);
    },
    [count, onValueChange, increment, translateY, opacity],
  );

  const increase = useCallback(() => {
    if (canIncrease) {
      updateCount('increment');
    }
  }, [canIncrease, updateCount]);

  const decrease = useCallback(() => {
    if (canDecrease) {
      updateCount('decrement');
    }
  }, [canDecrease, updateCount]);

  const handleAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      switch (event.nativeEvent.actionName) {
        case 'increment':
          increase();
          break;
        case 'decrement':
          decrease();
          break;
      }
    },
    [increase, decrease],
  );

  const displayValue = count ? count : emptyLabel;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={styles.container}
      accessible
      role="slider"
      accessibilityValue={{
        min: minValue,
        max: maxValue,
        now: count,
        text: `${count}`,
      }}
      accessibilityActions={[
        {
          name: 'increment',
          label: `Increase value by ${increment}`,
        },
        {
          name: 'decrement',
          label: `Decrease value by ${increment}`,
        },
      ]}
      onAccessibilityAction={handleAccessibilityAction}
      {...accessibilityProps}
    >
      <ButtonRound
        onPress={decrease}
        size="small"
        variant="neutral"
        renderContent={({ iconSize }) => (
          <Minus color={styles.icon.color} size={iconSize} />
        )}
        disabled={!canDecrease}
      />
      <View style={styles.countContainer}>
        <AnimatedText variant="body2" style={[styles.countText, animatedStyle]}>
          {displayValue}
        </AnimatedText>
      </View>
      <ButtonRound
        onPress={increase}
        size="small"
        variant="neutral"
        renderContent={({ iconSize }) => (
          <Plus color={styles.icon.color} size={iconSize} />
        )}
        disabled={!canIncrease}
      />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    minWidth: 56,
    paddingHorizontal: theme.spacing.medium,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  countText: {
    fontWeight: 'bold',
  },
  icon: {
    color: theme.colors.contentPrimary,
  },
}));
