import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

/**
 * Props for the Card component.
 */
export type Props = Pick<ViewProps, 'children' | 'style'>;

export const Card = ({ children, style, ...viewProps }: Props) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={[styles.card, StyleSheet.flatten(style)]} {...viewProps}>
      {children}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, borderRadius }) => ({
  card: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
  },
}));
