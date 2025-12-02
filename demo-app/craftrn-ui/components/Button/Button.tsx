import React, { useMemo } from 'react';
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

type Size = 'large' | 'regular' | 'small';
type Variant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'neutral-secondary'
  | 'negative';

const hitSlop = {
  small: { top: 2, bottom: 2, left: 4, right: 4 },
  regular: { top: 2, bottom: 2, left: 2, right: 2 },
  large: { top: 0, bottom: 0, left: 0, right: 0 },
} as const;

type BaseProps = {
  /**
   * The text content of the button.
   */
  children: string | string[];
  /**
   * Callback function triggered when the button is pressed.
   */
  onPress: () => void;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The size of the button.
   * @default 'regular'
   */
  size?: Size;
  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: Variant;
  /**
   * Animation configuration for press interactions
   */
  animationConfig?: AnimationConfig;
};

/**
 * Props for the Button component.
 * @see AccessibilityProps
 */
export type Props = BaseProps & AccessibilityProps;

export const Button = ({
  children,
  onPress,
  size = 'regular',
  disabled = false,
  variant = 'primary',
  animationConfig,
  ...accessibilityProps
}: Props) => {
  const { theme } = useUnistyles();
  const pressProgress = useSharedValue(0);

  // Compute colors in useMemo - theme object changes on theme switch
  const colorConfig = useMemo(() => {
    let backgroundUnpressed: string;
    let backgroundPressed: string;
    let textUnpressed: string;
    let textPressed: string;

    switch (variant) {
      case 'primary':
        backgroundUnpressed = theme.colors.interactivePrimary;
        backgroundPressed = theme.colors.interactivePrimaryPress;
        textUnpressed = theme.colors.interactivePrimaryContent;
        textPressed = theme.colors.interactivePrimaryContentPress;
        break;
      case 'secondary':
        backgroundUnpressed = theme.colors.interactiveSecondary;
        backgroundPressed = theme.colors.interactiveSecondaryPress;
        textUnpressed = theme.colors.interactiveSecondaryContent;
        textPressed = theme.colors.interactiveSecondaryContentPress;
        break;
      case 'tertiary':
        backgroundUnpressed = `${theme.colors.interactiveSecondary}00`;
        backgroundPressed = theme.colors.interactiveSecondary;
        textUnpressed = theme.colors.interactiveSecondaryContent;
        textPressed = theme.colors.interactiveSecondaryContentPress;
        break;
      case 'neutral':
        backgroundUnpressed = theme.colors.interactiveNeutral;
        backgroundPressed = theme.colors.interactiveNeutralPress;
        textUnpressed = theme.colors.interactiveNeutralContent;
        textPressed = theme.colors.interactiveNeutralContentPress;
        break;
      case 'neutral-secondary':
        backgroundUnpressed = theme.colors.interactiveNeutralSecondary;
        backgroundPressed = theme.colors.interactiveNeutralSecondaryPress;
        textUnpressed = theme.colors.interactiveNeutralContent;
        textPressed = theme.colors.interactiveNeutralContentPress;
        break;
      case 'negative':
        backgroundUnpressed = theme.colors.sentimentNegative;
        backgroundPressed = theme.colors.sentimentNegativePress;
        textUnpressed = theme.colors.sentimentSecondaryNegative;
        textPressed = theme.colors.sentimentSecondaryNegativePress;
        break;
    }

    if (disabled) {
      backgroundUnpressed = hexToGrayscale(backgroundUnpressed);
      textUnpressed = hexToGrayscale(textUnpressed);
    }

    return {
      backgroundUnpressed,
      backgroundPressed,
      textUnpressed,
      textPressed,
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

  const textStyle = useAnimatedStyle(
    () => ({
      color: interpolateColor(
        pressProgress.value,
        [0, 1],
        [colorConfig.textUnpressed, colorConfig.textPressed],
      ),
    }),
    [colorConfig.textUnpressed, colorConfig.textPressed],
  );

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop[size]}
      role="button"
      animationConfig={animationConfig}
      pressProgress={pressProgress}
      {...accessibilityProps}
    >
      <Animated.View
        key={`button-bg-${UnistylesRuntime.themeName}`}
        style={[styles.button({ size, disabled }), backgroundStyle]}
      >
        <Animated.Text
          key={`button-text-${UnistylesRuntime.themeName}`}
          style={[styles.text({ size }), textStyle]}
        >
          {children}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
};

const styles = StyleSheet.create(theme => ({
  button: ({ size, disabled }: { size: Size; disabled: boolean }) => {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      opacity: disabled ? 0.5 : 1,
      borderRadius: theme.borderRadius.full,
      ...(size === 'small' && {
        minHeight: 30,
        minWidth: 44,
        paddingHorizontal: theme.spacing.small,
        paddingVertical: theme.spacing.xsmall,
      }),
      ...(size === 'regular' && {
        minHeight: 40,
        minWidth: 44,
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.small,
      }),
      ...(size === 'large' && {
        minHeight: 48,
        minWidth: 44,
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.medium,
      }),
    };
  },
  text: ({ size }: { size: Size }) => ({
    textAlign: 'center',
    ...(size === 'small' && {
      ...theme.textVariants.body3,
    }),
    ...(size === 'regular' && {
      ...theme.textVariants.body2,
    }),
    ...(size === 'large' && {
      ...theme.textVariants.body1,
    }),
    fontWeight: '700',
  }),
}));
