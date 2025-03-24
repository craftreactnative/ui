import React, { useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ButtonRound } from '../ButtonRound/ButtonRound';
import { Text } from '../Text/Text';
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
   * The initial value of the counter.
   * @default 0
   */
  initialValue?: number;
  /**
   * The maximum value of the counter.
   * @default 10
   */
  maxValue?: number;
  /**
   * The label to display when the counter is empty.
   * @default '0'
   */
  emptyLabel?: string;
};

export const Counter = ({
  onValueChange,
  initialValue = 0,
  maxValue = 10,
  emptyLabel = '0',
}: Props) => {
  const [count, setCount] = useState(initialValue);
  const { styles, theme } = useStyles(stylesheet);
  const canIncrease = count < maxValue;
  const canDecrease = count > 0;

  const increase = () => {
    const newValue = count + 1;
    setCount(newValue);
    onValueChange(newValue);
  };

  const decrease = () => {
    const newValue = count - 1;
    setCount(newValue);
    onValueChange(newValue);
  };

  return (
    <View style={styles.container}>
      <ButtonRound
        onPress={decrease}
        size="small"
        renderIcon={size => (
          <Minus color={theme.colors.contentPrimary} size={size} />
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
        renderIcon={size => (
          <Plus color={theme.colors.contentPrimary} size={size} />
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
