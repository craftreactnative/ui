import React, { ReactElement } from 'react';
import { AccessibilityProps, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const config = {
  small: {
    buttonSize: 24,
    iconSize: 14,
    hitSlop: 10,
  },
  medium: {
    buttonSize: 32,
    iconSize: 18,
    hitSlop: 6,
  },
  large: {
    buttonSize: 40,
    iconSize: 24,
    hitSlop: 2,
  },
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

type ButtonRoundProps = Props & AccessibilityProps;

export const ButtonRound = ({
  onPress,
  size = 'medium',
  disabled = false,
  renderContent,
  variant = 'primary',
  ...accessibilityProps
}: ButtonRoundProps) => {
  const { styles } = useStyles(stylesheet, { variant, size });
  const { iconSize, hitSlop } = config[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      role="button"
      {...accessibilityProps}
    >
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
