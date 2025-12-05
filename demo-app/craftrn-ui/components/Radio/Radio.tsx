import React, { useEffect } from 'react';
import { AccessibilityProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { PressableScale, type AnimationConfig } from '../PressableScale';

const animConfig = {
  duration: 200,
};

const sizeConfig = {
  container: 24,
  dot: 10,
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
  /**
   * Animation configuration for press interactions
   * @default { scaleIn: 1.1, durationIn: 150, durationOut: 150 }
   */
  animationConfig?: AnimationConfig;
};

type RadioProps = Props & AccessibilityProps;

export const Radio = ({
  checked = false,
  disabled = false,
  onPress,
  animationConfig = {
    scaleIn: 1.1,
  },
  ...accessibilityProps
}: RadioProps) => {
  const { theme } = useUnistyles();
  const appearance = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    appearance.value = withTiming(checked ? 1 : 0, {
      duration: animConfig.duration,
    });
  }, [checked, appearance, animConfig.duration]);

  const checkedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appearance.value,
  }));

  const dotAnimatedStyle = useAnimatedStyle(() => {
    const size =
      appearance.value * (sizeConfig.dot - sizeConfig.container) +
      sizeConfig.container;

    return {
      width: size,
      height: size,
    };
  });

  return (
    <PressableScale
      onPress={() => onPress?.(!checked)}
      accessible
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      animationConfig={animationConfig}
      {...accessibilityProps}
    >
      <Animated.View
        style={[styles.container, disabled && styles.containerDisabled]}
      >
        <Animated.View style={[styles.checked, checkedAnimatedStyle]}>
          <Animated.View style={[styles.dot, dotAnimatedStyle]} />
        </Animated.View>
      </Animated.View>
    </PressableScale>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.interactiveNeutral,
    overflow: 'hidden',
    width: sizeConfig.container,
    height: sizeConfig.container,
  },
  containerDisabled: {
    opacity: 0.5,
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
  dot: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.baseLight,
  },
}));
