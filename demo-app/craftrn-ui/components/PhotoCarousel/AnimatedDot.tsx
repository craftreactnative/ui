import React from 'react';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

const config = {
  dotSize: 4,
};

/**
 * Props for the AnimatedDot component.
 */
export type Props = {
  /**
   * Index of the dot.
   */
  index: number;
  /**
   * Scroll position of the carousel.
   */
  scrollX: SharedValue<number>;
  /**
   * Width of the carousel.
   */
  carouselWidth: number;
};

export const AnimatedDot = ({ index, scrollX, carouselWidth }: Props) => {
  const { theme } = useUnistyles();

  const dotAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * carouselWidth,
      index * carouselWidth,
      (index + 1) * carouselWidth,
    ];
    const scale = interpolate(scrollX.value, inputRange, [1, 1.5, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const opacity = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: config.dotSize,
          height: config.dotSize,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.white,
        },
        dotAnimatedStyle,
      ]}
    />
  );
};
