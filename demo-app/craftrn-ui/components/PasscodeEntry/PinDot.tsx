import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const config = {
  dotSize: 16,
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
  const { styles, theme } = useStyles(stylesheet);
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
          1.5,
          { duration: 100, easing: Easing.out(Easing.cubic) },
          () => {
            scale.value = withTiming(1, {
              duration: 400,
              easing: Easing.out(Easing.cubic),
            });
          },
        );
      }
    },
  );

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: filledStatus.value
      ? theme.colors.contentAccent
      : theme.colors.contentTertiary,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.pinDot, dotAnimatedStyle]} />;
};

const stylesheet = createStyleSheet(({ colors, borderRadius }) => ({
  pinDot: {
    width: config.dotSize,
    height: config.dotSize,
    borderRadius: borderRadius.full,
    backgroundColor: colors.contentPrimary,
  },
}));
