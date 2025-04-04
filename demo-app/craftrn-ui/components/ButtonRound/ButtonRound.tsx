import React, { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const config = {
  buttonSizeSmall: 24,
  buttonSizeMedium: 32,
  buttonSizeLarge: 40,
  iconSizeSmall: 14,
  iconSizeMedium: 18,
  iconSizeLarge: 24,
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
   * Function that renders an icon or other content inside the button.
   * @param props.iconSize - The suggested size of the icon in pixels, depending on the button size.
   */
  renderContent: (props: { iconSize: number }) => ReactElement;
  /**
   * The size of the button.
   * @default 'medium'
   */
  size?: 'large' | 'medium' | 'small';
  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
};

export const ButtonRound = ({
  onPress,
  size = 'medium',
  disabled = false,
  renderContent,
  variant = 'primary',
}: Props) => {
  const { styles } = useStyles(stylesheet, { variant, size });
  const iconSize =
    size === 'small'
      ? config.iconSizeSmall
      : size === 'large'
        ? config.iconSizeLarge
        : config.iconSizeMedium;

  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={4}>
      {({ pressed }) => (
        <View style={styles.button({ pressed, disabled })}>
          {renderContent({ iconSize })}
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
        medium: {
          width: config.buttonSizeMedium,
          height: config.buttonSizeMedium,
        },
        large: {
          width: config.buttonSizeLarge,
          height: config.buttonSizeLarge,
        },
      },
    },
  }),
}));
