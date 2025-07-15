import { default as React, useEffect } from 'react';
import { AccessibilityProps, Pressable } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const config = {
  size: 24,
  dotSize: 8,
};

/**
 * Props for the Radio component.
 */
export type Props = {
  /**
   * Whether the radio button is checked.
   */
  checked: boolean;
  /**
   * Whether the radio button is disabled.
   */
  disabled?: boolean;
  /**
   * Callback when the radio is pressed.
   */
  onPress?: (isChecked: boolean) => void;
};

type RadioProps = Props & AccessibilityProps;

export const Radio = ({
  checked = false,
  disabled = false,
  onPress,
  ...accessibilityProps
}: RadioProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const scale = useSharedValue(1);
  const appearance = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100, easing: Easing.bounce }),
      withTiming(1, { duration: 100 }),
    );

    appearance.value = withDelay(
      30,
      withTiming(checked ? 1 : 0, { duration: 200 }),
    );
  }, [checked, scale, appearance]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      appearance.value,
      [0, 1],
      [theme.colors.backgroundSecondary, theme.colors.accentPrimary],
    ),
    borderColor: interpolateColor(
      appearance.value,
      [0, 1],
      [theme.colors.borderPrimary, theme.colors.accentPrimary],
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appearance.value,
  }));

  return (
    <Pressable
      onPress={() => onPress?.(!checked)}
      accessible
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      {...accessibilityProps}
    >
      <Animated.View
        style={[
          styles.container,
          containerAnimatedStyle,
          disabled && styles.containerDisabled,
        ]}
      >
        <Animated.View style={[styles.icon, iconAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ borderRadius, colors }) => ({
  container: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: config.size,
    height: config.size,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  icon: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    width: config.dotSize,
    height: config.dotSize,
  },
}));
