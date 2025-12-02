import React from 'react';
import { StyleSheet as RNStyleSheet, View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Props for the Card component.
 */
export type Props = Pick<ViewProps, 'children' | 'style'>;

export const Card = ({ children, style, ...viewProps }: Props) => {
  return (
    <View style={[styles.card, RNStyleSheet.flatten(style)]} {...viewProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  card: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
  },
}));
