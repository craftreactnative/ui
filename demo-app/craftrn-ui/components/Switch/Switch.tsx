import React from 'react';
import { Platform, Switch as RNSwitch, SwitchProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

/**
 * Props for the Switch component.
 * @see SwitchProps
 */
export type Props = Omit<SwitchProps, 'trackColor' | 'thumbColor' | 'style'>;

export const Switch = ({ ...props }: Props) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <RNSwitch
      trackColor={{
        false: theme.colors.backgroundTertiary,
        true:
          Platform.OS === 'android'
            ? theme.colors.accentTertiary
            : theme.colors.accentPrimary,
      }}
      thumbColor={
        Platform.OS === 'android'
          ? props.value
            ? theme.colors.accentPrimary
            : theme.colors.backgroundPrimary
          : undefined
      }
      style={styles.switch}
      {...props}
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  switch: {
    transform: [{ scale: Platform.OS === 'android' ? 1 : 0.8 }],
  },
}));
