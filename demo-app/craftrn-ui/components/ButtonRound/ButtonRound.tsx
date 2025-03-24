import React, { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const config = {
  buttonSizeSmall: 24,
  buttonSizeRegular: 32,
  iconSizeSmall: 14,
  iconSizeRegular: 18,
};

/**
 * Props for the ButtonRound component.
 */
export type Props = {
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
   * Function that renders the icon inside the button.
   * @param size - The size of the icon in pixels.
   */
  renderIcon: (size: number) => ReactElement;
  /**
   * The size of the button.
   * @default 'regular'
   */
  size?: 'regular' | 'small';
  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
};

export const ButtonRound = ({
  onPress,
  size = 'regular',
  disabled = false,
  renderIcon,
  variant = 'primary',
}: Props) => {
  const { styles } = useStyles(stylesheet, { variant, size });
  const iconSize =
    size === 'small' ? config.iconSizeSmall : config.iconSizeRegular;

  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={4}>
      {({ pressed }) => (
        <View style={styles.button({ pressed, disabled })}>
          {renderIcon(iconSize)}
        </View>
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ borderRadius, colors }) => ({
  button: ({ pressed, disabled }: { pressed: boolean; disabled: boolean }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    opacity: disabled ? 0.5 : 1,
    variants: {
      variant: disabled
        ? {
            primary: {
              backgroundColor: colors.backgroundSecondary,
            },
            secondary: {
              backgroundColor: colors.backgroundSecondary,
            },
          }
        : {
            primary: {
              backgroundColor: pressed
                ? colors.backgroundTertiary
                : colors.backgroundSecondary,
            },
            secondary: {
              backgroundColor: pressed
                ? colors.backgroundTertiary
                : colors.backgroundPrimary,
            },
          },

      size: {
        small: {
          width: config.buttonSizeSmall,
          height: config.buttonSizeSmall,
        },
        regular: {
          width: config.buttonSizeRegular,
          height: config.buttonSizeRegular,
        },
      },
    },
  }),
}));
