import React from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Props for the Divider component.
 */
export type Props = Pick<ViewProps, 'style'> & {
  /**
   * Orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
};

export const Divider = ({ orientation = 'horizontal', style }: Props) => {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        StyleSheet.flatten(style),
      ]}
    />
  );
};

const styles = StyleSheet.create(theme => ({
  horizontal: {
    borderBottomColor: theme.colors.borderNeutral,
    borderBottomWidth: 1,
  },
  vertical: {
    borderRightColor: theme.colors.borderNeutral,
    borderRightWidth: 1,
    height: '100%',
  },
}));
