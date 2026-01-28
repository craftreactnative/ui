import React from 'react';
import { Platform, Switch as RNSwitch, SwitchProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

/**
 * Props for the Switch component.
 * @see SwitchProps
 */
export type Props = Omit<SwitchProps, 'trackColor' | 'thumbColor' | 'style'>;

export const Switch = ({ ...props }: Props) => {
  const { theme } = useUnistyles();
  return (
    <RNSwitch
      trackColor={{
        false: theme.colors.interactiveNeutral,
        true: theme.colors.contentAccentSecondary,
      }}
      thumbColor={theme.colors.baseLight}
      style={styles.switch}
      {...props}
    />
  );
};

const styles = StyleSheet.create(() => ({
  switch: {
    transform: [{ scale: Platform.OS === 'android' ? 1 : 0.8 }],
  },
}));
