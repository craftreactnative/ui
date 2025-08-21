import React, { ReactElement } from 'react';
import { AccessibilityProps, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import type { darkTheme, lightTheme } from '../../themes/config';

type Size = 'large' | 'medium' | 'small';
type Intent = 'primary' | 'secondary';
type Variant = 'default' | 'reversed' | 'accent';

export const config = {
  small: {
    buttonSize: 24,
    iconSize: 14,
    hitSlop: 2,
  },
  medium: {
    buttonSize: 32,
    iconSize: 18,
    hitSlop: 2,
  },
  large: {
    buttonSize: 40,
    iconSize: 24,
    hitSlop: 2,
  },
};

type BaseProps = {
  /**
   * Callback function triggered when the button is pressed.
   */
  onPress?: () => void;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Function that renders an icon or other content inside the button.
   * @param props.iconSize - The suggested size of the icon in pixels, depending on the button size.
   * @param props.iconColor - The appropriate color for the icon based on the button variant.
   */
  renderContent: (props: {
    iconSize: number;
    iconColor: string;
  }) => ReactElement;
  /**
   * The size of the button.
   * @default 'medium'
   */
  size?: Size;
};

type DefaultVariantProps = BaseProps & {
  /**
   * The visual style variant of the button.
   * @default 'default'
   */
  variant?: 'default';
  /**
   * The intent/purpose of the button.
   * @default 'primary'
   */
  intent?: Intent;
};

type AccentVariantProps = BaseProps & {
  /**
   * The visual style variant of the button.
   */
  variant: 'accent';
  /**
   * Intent is not available for accent variant.
   */
  intent?: never;
};

type ReversedVariantProps = BaseProps & {
  /**
   * The visual style variant of the button.
   */
  variant: 'reversed';
  /**
   * Intent is not available for reversed variant.
   */
  intent?: never;
};

/**
 * Props for the ButtonRound component.
 */
export type Props =
  | DefaultVariantProps
  | AccentVariantProps
  | ReversedVariantProps;

type ButtonRoundProps = Props & AccessibilityProps;

const getButtonStyles = (
  intent: Intent | undefined,
  variant: Variant,
  pressed: boolean,
  disabled: boolean,
  colors: Record<string, string>,
) => {
  if (disabled) {
    return {
      backgroundColor: colors.surfaceSecondary,
    };
  }

  switch (variant) {
    case 'accent':
      return {
        backgroundColor: pressed
          ? colors.accentSecondary
          : colors.accentPrimary,
      };
    case 'reversed':
      return {
        backgroundColor: pressed
          ? colors.surfaceReversedSecondary
          : colors.surfaceReversedPrimary,
      };
    case 'default':
      switch (intent ?? 'primary') {
        case 'primary':
          return {
            backgroundColor: pressed
              ? colors.surfaceTertiary
              : colors.surfacePrimary,
          };
        case 'secondary':
          return {
            backgroundColor: pressed
              ? colors.surfaceTertiary
              : colors.surfaceSecondary,
          };
      }
  }
};

export const ButtonRound = ({
  onPress,
  size = 'medium',
  disabled = false,
  renderContent,
  intent = 'primary',
  variant = 'default',
  ...accessibilityProps
}: ButtonRoundProps) => {
  const { styles, theme } = useStyles(stylesheet, { size });
  const { iconSize, hitSlop } = config[size];

  const iconVariantColor = {
    accent: theme.colors.white,
    reversed: theme.colors.contentReversed,
    default: theme.colors.contentPrimary,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      role="button"
      {...accessibilityProps}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.button({ disabled }),
            getButtonStyles(intent, variant, pressed, disabled, theme.colors),
          ]}
        >
          {renderContent({
            iconSize,
            iconColor: iconVariantColor[variant],
          })}
        </View>
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ borderRadius }) => ({
  button: ({ disabled }: { disabled: boolean }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    opacity: disabled ? 0.5 : 1,
    variants: {
      size: {
        small: {
          width: config.small.buttonSize,
          height: config.small.buttonSize,
        },
        medium: {
          width: config.medium.buttonSize,
          height: config.medium.buttonSize,
        },
        large: {
          width: config.large.buttonSize,
          height: config.large.buttonSize,
        },
      },
    },
  }),
}));
