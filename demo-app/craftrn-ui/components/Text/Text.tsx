import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

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
    | 'contentAccent'
    | 'contentError';
};

export const Text = ({
  color = 'contentPrimary',
  variant = 'body1',
  style,
  ...props
}: Props & TextProps) => {
  const { styles } = useStyles(stylesheet, { color, variant });
  return <RNText style={[styles.text, StyleSheet.flatten(style)]} {...props} />;
};

const stylesheet = createStyleSheet(({ textVariants, colors }) => ({
  text: {
    ...textVariants.body1,
    color: colors.contentPrimary,
    variants: {
      color: {
        contentPrimary: {
          color: colors.contentPrimary,
        },
        contentSecondary: {
          color: colors.contentSecondary,
        },
        contentTertiary: {
          color: colors.contentTertiary,
        },
        contentAccent: {
          color: colors.contentAccent,
        },
        contentError: {
          color: colors.contentError,
        },
      },
      variant: {
        heading1: {
          ...textVariants.heading1,
        },
        heading2: {
          ...textVariants.heading2,
        },
        heading3: {
          ...textVariants.heading3,
        },
        body1: {
          ...textVariants.body1,
        },
        body2: {
          ...textVariants.body2,
        },
        body3: {
          ...textVariants.body3,
        },
      },
    },
  },
}));
