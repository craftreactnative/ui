import { default as React, useEffect } from 'react';
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
import { CheckLarge } from './CheckLarge';

export const config = {
  size: 24,
};

/**
 * Props for the Checkbox component.
 */
export type Props = {
  /**
   * Whether the checkbox is checked.
   * @default false
   */
  checked?: boolean;
  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
};

export const Checkbox = ({ checked = false, disabled = false }: Props) => {
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

  const containerStyle = useAnimatedStyle(() => ({
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

  const iconStyle = useAnimatedStyle(() => ({
    opacity: appearance.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        disabled && styles.containerDisabled,
      ]}
    >
      <Animated.View style={iconStyle}>
        <CheckLarge color={theme.colors.white} />
      </Animated.View>
    </Animated.View>
  );
};

const stylesheet = createStyleSheet(({ borderRadius }) => ({
  container: {
    borderRadius: borderRadius.small,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: config.size,
    height: config.size,
  },
  containerDisabled: {
    opacity: 0.5,
  },
}));
