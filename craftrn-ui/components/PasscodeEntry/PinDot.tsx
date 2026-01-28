import React, { useEffect, useMemo } from 'react';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { type Theme } from '../../themes/config';

const createPinDotTokens = (theme: Theme) => {
  return {
    size: 16,
    colors: {
      filled: theme.colors.contentAccentSecondary,
      empty: theme.colors.borderNeutralSecondary,
    },
    borderRadius: theme.borderRadius.full,
    animation: {
      scaleUp: {
        duration: 100,
        easing: Easing.out(Easing.cubic),
        scale: 1.5,
      },
      scaleDown: {
        duration: 400,
        easing: Easing.out(Easing.cubic),
        scale: 1,
      },
    },
  };
};

/**
 * Props for the PinDot component.
 */
export type Props = {
  /**
   * Whether the dot is filled.
   */
  filled: boolean;
};

export const PinDot = ({ filled }: Props) => {
  const { theme } = useUnistyles();
  const pinDotTokens = useMemo(() => createPinDotTokens(theme), [theme]);
  const scale = useSharedValue(1);
  const filledStatus = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    filledStatus.value = filled ? 1 : 0;
  }, [filled, filledStatus]);

  useAnimatedReaction(
    () => filledStatus.value,
    (currentStatus, previousStatus) => {
      if (currentStatus === 1 && previousStatus === 0) {
        scale.value = withTiming(
          pinDotTokens.animation.scaleUp.scale,
          {
            duration: pinDotTokens.animation.scaleUp.duration,
            easing: pinDotTokens.animation.scaleUp.easing,
          },
          () => {
            scale.value = withTiming(pinDotTokens.animation.scaleDown.scale, {
              duration: pinDotTokens.animation.scaleDown.duration,
              easing: pinDotTokens.animation.scaleDown.easing,
            });
          },
        );
      }
    },
    [pinDotTokens.animation],
  );

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: filledStatus.value
      ? pinDotTokens.colors.filled
      : pinDotTokens.colors.empty,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.pinDot, dotAnimatedStyle]} />;
};

const styles = StyleSheet.create(theme => {
  const pinDotTokens = createPinDotTokens(theme);

  return {
    pinDot: {
      width: pinDotTokens.size,
      height: pinDotTokens.size,
      borderRadius: pinDotTokens.borderRadius,
      backgroundColor: pinDotTokens.colors.empty,
    },
  };
});
