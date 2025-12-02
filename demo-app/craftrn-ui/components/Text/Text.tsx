import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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
    | 'interactivePrimaryContent'
    | 'interactiveSecondaryContent'
    | 'contentPrimary'
    | 'contentSecondary'
    | 'contentTertiary'
    | 'contentAccent'
    | 'sentimentPositive'
    | 'sentimentSecondaryPositive'
    | 'sentimentNegative'
    | 'sentimentSecondaryNegative';
};

export const Text = ({
  color = 'contentPrimary',
  variant = 'body1',
  style,
  ...props
}: Props & TextProps) => {
  return (
    <RNText
      style={[styles.text({ color, variant }), StyleSheet.flatten(style)]}
      {...props}
    />
  );
};

const styles = StyleSheet.create(theme => ({
  text: ({
    color,
    variant,
  }: {
    color: NonNullable<Props['color']>;
    variant: NonNullable<Props['variant']>;
  }) => {
    const variantStyle = theme.textVariants[variant];
    return {
      color: theme.colors[color],
      fontSize: variantStyle.fontSize,
      lineHeight: variantStyle.lineHeight,
      fontWeight: variantStyle.fontWeight,
      ...('letterSpacing' in variantStyle && {
        letterSpacing: variantStyle.letterSpacing,
      }),
    };
  },
}));
