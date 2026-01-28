import React, { useEffect } from 'react';
import { StyleSheet, ViewProps, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

/**
 * Props for the Skeleton component.
 */
export type Props = Pick<ViewProps, 'style'> & {
  /**
   * Width of the skeleton. Can be a number or a percentage string.
   * @default '100%'
   */
  width?: ViewStyle['width'];
  /**
   * Height of the skeleton. Can be a number or a percentage string.
   * @default 20
   */
  height?: ViewStyle['height'];
  /**
   * Border radius of the skeleton.
   * @default 4
   */
  borderRadius?: number;
  /**
   * Background color of the skeleton.
   * @default theme.colors.backgroundNeutral
   */
  color?: string;
};

export const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  color,
  style,
  ...viewProps
}: Props) => {
  const { theme } = useUnistyles();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: color ?? theme.colors.backgroundNeutral,
        },
        animatedStyle,
        style && StyleSheet.flatten(style),
      ]}
      {...viewProps}
    />
  );
};
