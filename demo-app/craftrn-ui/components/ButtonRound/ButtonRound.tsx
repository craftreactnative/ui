import React, { ReactElement, useMemo } from 'react';
import { AccessibilityProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';
import { PressableScale, type AnimationConfig } from '../PressableScale';

/**
 * Convert a hex color to grayscale using luminance formula (0.299*R + 0.587*G + 0.114*B)
 */
const hexToGrayscale = (hex: string): string =>
  `#${Math.round(
    0.299 * parseInt(hex.slice(1, 3), 16) +
      0.587 * parseInt(hex.slice(3, 5), 16) +
      0.114 * parseInt(hex.slice(5, 7), 16),
  )
    .toString(16)
    .padStart(2, '0')
    .repeat(3)}${hex.length === 9 ? hex.slice(7) : ''}`;

type Size = 'large' | 'medium' | 'small';
type Variant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'neutral-secondary'
  | 'reversed';

const hitSlop = {
  small: 4,
  medium: 2,
  large: 2,
} as const;

const iconSize = {
  small: 14,
  medium: 18,
  large: 24,
} as const;

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
  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: Variant;
  /**
   * Animation configuration for press interactions
   * @default { scaleIn: 1, durationIn: 150, durationOut: 150, easing: Easing.out(Easing.cubic) }
   */
  animationConfig?: AnimationConfig;
};

/**
 * Props for the ButtonRound component.
 * @see AccessibilityProps
 */
export type Props = BaseProps & AccessibilityProps;

export const ButtonRound = ({
  onPress,
  size = 'medium',
  disabled = false,
  renderContent,
  variant = 'primary',
  animationConfig,
  ...accessibilityProps
}: Props) => {
  const { theme } = useUnistyles();
  const pressProgress = useSharedValue(0);

  const colorConfig = useMemo(() => {
    let backgroundUnpressed: string;
    let backgroundPressed: string;
    let iconColor: string;

    switch (variant) {
      case 'primary':
        backgroundUnpressed = theme.colors.interactivePrimary;
        backgroundPressed = theme.colors.interactivePrimaryPress;
        iconColor = theme.colors.interactivePrimaryContent;
        break;
      case 'secondary':
        backgroundUnpressed = theme.colors.interactiveSecondary;
        backgroundPressed = theme.colors.interactiveSecondaryPress;
        iconColor = theme.colors.interactiveSecondaryContent;
        break;
      case 'neutral':
        backgroundUnpressed = theme.colors.interactiveNeutral;
        backgroundPressed = theme.colors.interactiveNeutralPress;
        iconColor = theme.colors.interactiveNeutralContent;
        break;
      case 'neutral-secondary':
        backgroundUnpressed = theme.colors.interactiveNeutralSecondary;
        backgroundPressed = theme.colors.interactiveNeutralSecondaryPress;
        iconColor = theme.colors.interactiveNeutralContent;
        break;
      case 'reversed':
        backgroundUnpressed = theme.colors.interactiveNeutralReversed;
        backgroundPressed = theme.colors.interactiveNeutralReversedPress;
        iconColor = theme.colors.interactiveNeutralReversedContent;
        break;
    }

    if (disabled) {
      backgroundUnpressed = hexToGrayscale(backgroundUnpressed);
      iconColor = hexToGrayscale(iconColor);
    }

    return {
      backgroundUnpressed,
      backgroundPressed,
      iconColor,
    };
  }, [variant, disabled, theme]);

  const backgroundStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        pressProgress.value,
        [0, 1],
        [colorConfig.backgroundUnpressed, colorConfig.backgroundPressed],
      ),
    }),
    [colorConfig.backgroundUnpressed, colorConfig.backgroundPressed],
  );

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop[size]}
      role="button"
      style={styles.pressable}
      animationConfig={animationConfig}
      pressProgress={pressProgress}
      {...accessibilityProps}
    >
      <Animated.View
        key={`button-round-${UnistylesRuntime.themeName}`}
        style={[styles.button({ disabled, size }), backgroundStyle]}
      >
        {renderContent({
          iconSize: iconSize[size],
          iconColor: colorConfig.iconColor,
        })}
      </Animated.View>
    </PressableScale>
  );
};

const styles = StyleSheet.create(theme => ({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: ({ disabled, size }: { disabled: boolean; size: Size }) => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.full,
      opacity: disabled ? 0.5 : 1,
      ...(size === 'small' && {
        width: 24,
        height: 24,
      }),
      ...(size === 'medium' && {
        width: 32,
        height: 32,
      }),
      ...(size === 'large' && {
        width: 40,
        height: 40,
      }),
    };
  },
}));
