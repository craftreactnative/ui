import React, { useCallback, useState } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityInfo,
  AccessibilityProps,
  View,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ButtonRound } from '../ButtonRound';
import { Text } from '../Text';
import { Minus } from './Minus';
import { Plus } from './Plus';

/**
 * Props for the Counter component.
 */
export type Props = {
  /**
   * Callback function triggered when the counter value changes.
   */
  onValueChange: (value: number) => void;
  /**
   * The maximum value of the counter.
   * @default 0
   */
  minValue?: number;
  /**
   * The maximum value of the counter.
   * @default 10
   */
  maxValue?: number;
  /**
   * The initial value of the counter.
   * Must be between minValue and maxValue
   * @default 0
   */
  initialValue?: number;
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
  initialValue = 0,
  minValue = 0,
  maxValue = 10,
  increment = 1,
  emptyLabel = '0',
  ...accessibilityProps
}: CounterProps) => {
  const [count, setCount] = useState(
    Math.min(Math.max(initialValue, minValue), maxValue),
  );
  const { styles, theme } = useStyles(stylesheet);
  const canIncrease = count < maxValue;
  const canDecrease = count > minValue;

  const updateCount = useCallback(
    (action: 'increment' | 'decrement') => {
      const newValue =
        count + (action === 'increment' ? increment : -increment);
      setCount(newValue);
      onValueChange(newValue);
      AccessibilityInfo.announceForAccessibility(`${newValue}`);
    },
    [count, onValueChange, increment],
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
        renderContent={({ iconSize }) => (
          <Minus color={theme.colors.contentPrimary} size={iconSize} />
        )}
        disabled={!canDecrease}
      />
      <View style={styles.countContainer}>
        <Text variant="body2" style={styles.countText}>
          {count ? count : emptyLabel}
        </Text>
      </View>
      <ButtonRound
        onPress={increase}
        size="small"
        renderContent={({ iconSize }) => (
          <Plus color={theme.colors.contentPrimary} size={iconSize} />
        )}
        disabled={!canIncrease}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ spacing }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    minWidth: 50,
    paddingHorizontal: spacing.small,
    alignItems: 'center',
  },
  countText: {
    fontWeight: 'bold',
  },
}));
