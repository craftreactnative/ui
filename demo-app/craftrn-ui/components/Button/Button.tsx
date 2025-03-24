import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text/Text';

// The minimum target size for mobile devices is 44 x 44 pixels according to WCAG guidelines
const config = {
  buttonMinWidth: 44,
  buttonMinHeightSmall: 30,
  buttonMinHeightRegular: 40,
  hitslopSmall: 5,
  hitslopRegular: 2,
};

type Size = 'regular' | 'small';
type Variant = 'primary' | 'secondary' | 'negative' | 'text';

/**
 * Props for the Button component.
 */
export type Props = {
  /**
   * The text content of the button.
   */
  children: string | string[];
  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: Variant;
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

export const Button = ({
  children,
  onPress,
  variant = 'primary',
  size = 'regular',
  disabled = false,
}: Props) => {
  const { styles } = useStyles(stylesheet, {
    variant,
    size,
  });

  return (
    <Pressable
      onPress={onPress}
      hitSlop={
        size === 'small'
          ? { top: config.hitslopSmall, bottom: config.hitslopSmall }
          : { top: config.hitslopRegular, bottom: config.hitslopRegular }
      }
      disabled={disabled}
    >
      {({ pressed }) => (
        <View style={styles.button({ pressed, disabled })}>
          <Text style={styles.text({ disabled })}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet(
  ({ borderRadius, colors, spacing, textVariants }) => ({
    button: ({
      pressed,
      disabled,
    }: {
      pressed: boolean;
      disabled: boolean;
    }) => ({
      borderRadius: borderRadius.medium,
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      variants: {
        variant: disabled
          ? {
              primary: {
                backgroundColor: colors.backgroundTertiary,
              },
              secondary: {
                backgroundColor: colors.backgroundTertiary,
              },
              negative: {
                backgroundColor: colors.backgroundTertiary,
              },
              text: {
                backgroundColor: 'transparent',
              },
            }
          : {
              primary: {
                backgroundColor: pressed
                  ? colors.accentSecondary
                  : colors.accentPrimary,
              },
              secondary: {
                backgroundColor: pressed
                  ? colors.backgroundQuaternary
                  : colors.backgroundTertiary,
              },
              negative: {
                backgroundColor: pressed
                  ? colors.negativeSecondary
                  : colors.negativePrimary,
              },
              text: {
                backgroundColor: pressed
                  ? colors.backgroundTertiary
                  : 'transparent',
              },
            },
        size: {
          regular: {
            paddingHorizontal: spacing.medium,
            paddingVertical: spacing.small,
            minHeight: config.buttonMinHeightRegular,
            minWidth: config.buttonMinWidth,
          },
          small: {
            paddingHorizontal: spacing.small,
            paddingVertical: spacing.xsmall,
            minHeight: config.buttonMinHeightSmall,
            minWidth: config.buttonMinWidth,
          },
        },
      },
    }),
    text: ({ disabled }: { disabled: boolean }) => ({
      textAlign: 'center',
      fontWeight: 'bold',
      color: disabled ? colors.contentTertiary : colors.white,
      variants: {
        variant: {
          primary: {},
          secondary: {
            color: disabled ? colors.contentTertiary : colors.contentPrimary,
          },
          negative: {},
          text: {
            color: disabled ? colors.contentTertiary : colors.accentPrimary,
          },
        },
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
    }),
  }),
);
