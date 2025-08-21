import React from 'react';
import { AccessibilityProps, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { darkTheme, lightTheme } from '../../themes/config';
import { Text } from '../Text';

export const config = {
  small: {
    buttonMinWidth: 44,
    buttonMinHeight: 30,
    hitSlop: 5,
  },
  regular: {
    buttonMinWidth: 44,
    buttonMinHeight: 40,
    hitSlop: 2,
  },
  large: {
    buttonMinWidth: 44,
    buttonMinHeight: 50,
    hitSlop: 0,
  },
};

type Size = 'large' | 'regular' | 'small';
type Variant = 'solid' | 'outlined' | 'subtle' | 'text';
type Intent = 'primary' | 'secondary' | 'positive' | 'negative';

/**
 * Props for the Button component.
 * @see AccessibilityProps
 */
export type Props = {
  /**
   * The text content of the button.
   */
  children: string | string[];
  /**
   * The visual style variant of the button.
   * @default 'solid'
   */
  variant?: Variant;
  /**
   * The intent/purpose of the button.
   * @default 'primary'
   */
  intent?: Intent;
  /**
   * The size of the button.
   * @default 'regular'
   */
  size?: Size;
  /**
   * Callback function triggered when the button is pressed.
   */
  onPress: () => void;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
};

type ButtonProps = Props & AccessibilityProps;

const getButtonStyles = (
  variant: Variant,
  intent: Intent,
  pressed: boolean,
  disabled: boolean,
  colors: typeof lightTheme.colors | typeof darkTheme.colors,
) => {
  if (disabled) {
    return {
      backgroundColor:
        variant === 'text' ? 'transparent' : colors.backgroundTertiary,
      ...(variant === 'outlined' && {
        borderWidth: 1,
        borderColor: colors.backgroundTertiary,
      }),
    };
  }

  switch (variant) {
    case 'solid':
      switch (intent) {
        case 'primary':
          return {
            backgroundColor: pressed
              ? colors.accentSecondary
              : colors.accentPrimary,
          };
        case 'secondary':
          return {
            backgroundColor: pressed
              ? colors.surfaceQuaternary
              : colors.surfaceTertiary,
          };
        case 'positive':
          return {
            backgroundColor: pressed
              ? colors.positivePrimary
              : colors.positiveSecondary,
          };
        case 'negative':
          return {
            backgroundColor: pressed
              ? colors.negativePrimary
              : colors.negativeSecondary,
          };
      }
    case 'subtle':
      switch (intent) {
        case 'primary':
          return {
            backgroundColor: pressed
              ? colors.accentTertiary
              : colors.accentQuaternary,
          };
        case 'secondary':
          return {
            backgroundColor: pressed
              ? colors.surfaceTertiary
              : colors.surfaceSecondary,
          };
        case 'positive':
          return {
            backgroundColor: pressed
              ? colors.positiveTertiary
              : colors.positiveQuaternary,
          };
        case 'negative':
          return {
            backgroundColor: pressed
              ? colors.negativeTertiary
              : colors.negativeQuaternary,
          };
      }
    case 'outlined':
      switch (intent) {
        case 'primary':
          return {
            backgroundColor: pressed ? colors.accentQuaternary : 'transparent',
            borderWidth: 1,
            borderColor: colors.accentPrimary,
          };
        case 'secondary':
          return {
            backgroundColor: pressed ? colors.surfaceSecondary : 'transparent',
            borderWidth: 1,
            borderColor: colors.contentSecondary,
          };
        case 'positive':
          return {
            backgroundColor: pressed
              ? colors.positiveQuaternary
              : 'transparent',
            borderWidth: 1,
            borderColor: colors.positivePrimary,
          };
        case 'negative':
          return {
            backgroundColor: pressed
              ? colors.negativeQuaternary
              : 'transparent',
            borderWidth: 1,
            borderColor: colors.negativePrimary,
          };
      }
    case 'text':
      switch (intent) {
        case 'primary':
          return {
            backgroundColor: pressed ? colors.accentQuaternary : 'transparent',
          };
        case 'secondary':
          return {
            backgroundColor: pressed ? colors.surfaceSecondary : 'transparent',
          };
        case 'positive':
          return {
            backgroundColor: pressed
              ? colors.positiveQuaternary
              : 'transparent',
          };
        case 'negative':
          return {
            backgroundColor: pressed
              ? colors.negativeQuaternary
              : 'transparent',
          };
      }
  }
};

const getTextColor = (
  variant: Variant,
  intent: Intent,
  disabled: boolean,
  colors: typeof lightTheme.colors | typeof darkTheme.colors,
) => {
  if (disabled) return colors.contentTertiary;

  switch (variant) {
    case 'solid':
      switch (intent) {
        case 'primary':
        case 'positive':
        case 'negative':
          return colors.white;
        case 'secondary':
          return colors.contentPrimary;
      }
    case 'outlined':
    case 'subtle':
    case 'text':
      switch (intent) {
        case 'primary':
          return colors.accentPrimary;
        case 'secondary':
          return colors.contentPrimary;
        case 'positive':
          return colors.positivePrimary;
        case 'negative':
          return colors.negativePrimary;
      }
  }
};

export const Button = ({
  children,
  onPress,
  variant = 'solid',
  intent = 'primary',
  size = 'regular',
  disabled = false,
  ...accessibilityProps
}: ButtonProps) => {
  const { styles, theme } = useStyles(stylesheet, {
    size,
  });

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: config[size].hitSlop, bottom: config[size].hitSlop }}
      disabled={disabled}
      role="button"
      {...accessibilityProps}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.button({ disabled }),
            getButtonStyles(variant, intent, pressed, disabled, theme.colors),
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: getTextColor(variant, intent, disabled, theme.colors) },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet(
  ({ borderRadius, spacing, textVariants }) => ({
    button: ({ disabled }: { disabled: boolean }) => ({
      borderRadius: borderRadius.medium,
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      variants: {
        size: {
          large: {
            paddingHorizontal: spacing.large,
            paddingVertical: spacing.medium,
            minHeight: config.large.buttonMinHeight,
            minWidth: config.large.buttonMinWidth,
            borderRadius: borderRadius.large,
          },
          regular: {
            paddingHorizontal: spacing.medium,
            paddingVertical: spacing.small,
            minHeight: config.regular.buttonMinHeight,
            minWidth: config.regular.buttonMinWidth,
            borderRadius: borderRadius.medium,
          },
          small: {
            paddingHorizontal: spacing.small,
            paddingVertical: spacing.xsmall,
            minHeight: config.small.buttonMinHeight,
            minWidth: config.small.buttonMinWidth,
            borderRadius: borderRadius.small,
          },
        },
      },
    }),
    text: {
      textAlign: 'center',
      fontWeight: 'bold',
      variants: {
        size: {
          regular: {
            ...textVariants.body2,
            fontWeight: 'bold',
          },
          small: {
            ...textVariants.body3,
            fontWeight: 'bold',
          },
        },
      },
    },
  }),
);
