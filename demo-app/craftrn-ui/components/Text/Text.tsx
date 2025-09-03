import React from 'react';
import { Text as RNText, TextProps, StyleSheet as RNStyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

/**
 * Props for the Text component.
 * @see TextProps
 */
export type Props = {
  /**
   * Variant of the text.
   * @default 'body1'
   */
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body1' | 'body2' | 'body3';
  /**
   * Color of the text.
   * @default 'contentPrimary'
   */
  color?:
    | 'contentPrimary'
    | 'contentSecondary'
    | 'contentTertiary'
    | 'contentQuaternary'
    | 'contentAccent'
    | 'positivePrimary'
    | 'positiveSecondary'
    | 'negativePrimary'
    | 'negativeSecondary';
};

export const Text = ({
  color = 'contentPrimary',
  variant = 'body1',
  style,
  ...props
}: Props & TextProps) => {
  const { theme } = useUnistyles();
  
  const variantStyle = theme.textVariants[variant];
  const colorStyle = { color: theme.colors[color] };
  
  return <RNText style={[variantStyle, colorStyle, RNStyleSheet.flatten(style)]} {...props} />;
};


