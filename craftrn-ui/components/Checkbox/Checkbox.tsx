import React, { useEffect } from 'react';
import { AccessibilityProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { PressableScale, type AnimationConfig } from '../PressableScale';
import { CheckLarge } from './CheckLarge';

const animConfig = {
  duration: 200,
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
  /**
   * Callback when the checkbox is pressed.
   */
  onPress?: (isChecked: boolean) => void;
  /**
   * Animation configuration for press interactions
   * @default { scaleIn: 1.1, durationIn: 150, durationOut: 150 }
   */
  animationConfig?: AnimationConfig;
};

type CheckboxProps = Props & AccessibilityProps;

export const Checkbox = ({
  checked = false,
  disabled = false,
  onPress,
  animationConfig = {
    scaleIn: 1.1,
  },
  ...accessibilityProps
}: CheckboxProps) => {
  const { theme } = useUnistyles();

  const appearance = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    appearance.value = withTiming(checked ? 1 : 0, {
      duration: animConfig.duration,
    });
  }, [checked, appearance]);

  const checkedStyle = useAnimatedStyle(() => ({
    opacity: appearance.value,
  }));

  return (
    <PressableScale
      onPress={() => onPress?.(!checked)}
      accessible
      role="checkbox"
      aria-checked={checked}
      disabled={disabled || !onPress}
      animationConfig={animationConfig}
      {...accessibilityProps}
    >
      <View style={[styles.container, disabled && styles.containerDisabled]}>
        <Animated.View style={[styles.checked, checkedStyle]}>
          <CheckLarge color={theme.colors.baseLight} />
        </Animated.View>
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.interactiveNeutral,
    width: 24,
    height: 24,
    overflow: 'hidden',
  },
  checked: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.contentAccentSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDisabled: {
    opacity: 0.5,
  },
}));
