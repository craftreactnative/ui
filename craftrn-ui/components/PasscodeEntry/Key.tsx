import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { type Theme } from '../../themes/config';

const createKeyTokens = (theme: Theme) => {
  return {
    size: 70,
    colors: {
      background: {
        normal: theme.colors.interactiveNeutral,
        pressed: theme.colors.interactiveNeutralPress,
      },
    },
  };
};

/**
 * Props for the Key component.
 */
export type Props = {
  /**
   * Callback function triggered when the key is pressed.
   */
  onPress: () => void;
  /**
   * The content to display inside the key.
   */
  children: React.ReactNode;
  /**
   * Aria label for accessibility.
   */
  ariaLabel?: string;
};

export const Key = ({ onPress, children, ariaLabel }: Props) => {
  const { theme } = useUnistyles();
  const keyTokens = useMemo(() => createKeyTokens(theme), [theme]);
  const pressProgress = useSharedValue(0);

  const backgroundStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        pressProgress.value,
        [0, 1],
        [
          keyTokens.colors.background.normal,
          keyTokens.colors.background.pressed,
        ],
      ),
    }),
    [keyTokens.colors.background.normal, keyTokens.colors.background.pressed],
  );

  const handlePressIn = () => {
    pressProgress.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    pressProgress.value = withTiming(0, { duration: 150 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      aria-label={ariaLabel}
    >
      <Animated.View style={[styles.key, backgroundStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create(theme => {
  const keyTokens = createKeyTokens(theme);

  return {
    key: {
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      width: keyTokens.size,
      height: keyTokens.size,
    },
  };
});
