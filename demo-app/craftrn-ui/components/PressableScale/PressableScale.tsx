import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type EasingFunction,
  type SharedValue,
} from 'react-native-reanimated';

export type AnimationConfig = {
  /**
   * Scale percentage when pressed
   * @default 1
   */
  scaleIn?: number;
  /**
   * Duration in milliseconds for press-in animation
   * @default 150
   */
  durationIn?: number;
  /**
   * Duration in milliseconds for press-out animation
   * @default 150
   */
  durationOut?: number;
  /**
   * Easing function for animations
   * @default Easing.out(Easing.cubic)
   */
  easing?: EasingFunction;
};

const defaultAnimationConfig: Required<AnimationConfig> = {
  scaleIn: 1,
  durationIn: 150,
  durationOut: 150,
  easing: Easing.out(Easing.cubic),
};

type Props = Omit<PressableProps, 'children'> & {
  /**
   * Content to render inside the pressable scale wrapper
   */
  children: ReactNode;
  /**
   * Animation configuration for press interactions
   */
  animationConfig?: AnimationConfig;
  /**
   * External press progress shared value to sync animations with parent component
   */
  pressProgress?: SharedValue<number>;
};

export const PressableScale = ({
  children,
  disabled = false,
  animationConfig,
  onPressIn,
  onPressOut,
  pressProgress: externalPressProgress,
  ...pressableProps
}: Props) => {
  const config = { ...defaultAnimationConfig, ...animationConfig };
  const internalPressProgress = useSharedValue(0);

  const pressProgress = externalPressProgress || internalPressProgress;

  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      if (disabled) return;
      pressProgress.value = withTiming(1, {
        duration: config.durationIn,
        easing: config.easing,
      });
      onPressIn?.(event);
    },
    [disabled, config.durationIn, config.easing, pressProgress, onPressIn],
  );

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      if (disabled) return;
      pressProgress.value = withTiming(0, {
        duration: config.durationOut,
        easing: config.easing,
      });
      onPressOut?.(event);
    },
    [disabled, config.durationOut, config.easing, pressProgress, onPressOut],
  );

  const scaleStyle = useAnimatedStyle(() => {
    'worklet';
    const scale = 1 + (config.scaleIn - 1) * pressProgress.value;
    return {
      transform: [{ scale }],
    };
  }, [config.scaleIn]);

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...pressableProps}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
