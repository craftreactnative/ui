import React, {
  ComponentProps,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text/Text';

const heightConfig = {
  small: 40,
  medium: 48,
  large: 56,
} as const;

const animationConfig = {
  easing: Easing.inOut(Easing.cubic),
  duration: 200,
} as const;

/**
 * Props for the InputText component.
 */
export type Props = ComponentProps<typeof TextInput> & {
  /**
   * The label to display above the input.
   */
  label?: string;
  /**
   * The size of the input.
   * @default 'medium'
   */
  size?: keyof typeof heightConfig;
  /**
   * Callback function triggered when the input is pressed.
   */
  onPress?: () => void;
  /**
   * Left accessory element. Will be placed before the input.
   */
  leftAccessory?: React.ReactElement;
  /**
   * Right accessory element. Will be placed after the input.
   */
  rightAccessory?: React.ReactElement;
  /**
   * Error message to display below the input.
   */
  error?: string;
};

export const InputText = forwardRef<TextInput, Props>(function InputText(
  {
    size = 'medium',
    label,
    onPress,
    onChangeText,
    value,
    leftAccessory,
    rightAccessory,
    onFocus,
    error,
    style,
    ...restProps
  },
  ref,
) {
  const { styles, theme } = useStyles(stylesheet, { size });
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? '');
  const inputRef = useRef<TextInput>(null);
  const isActive = isFocused || !!internalValue;

  const handleChangeText = useCallback(
    (text: string) => {
      setInternalValue(text);
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const labelAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: withTiming(isActive ? -10 : 0, animationConfig) },
        { scale: withTiming(isActive ? 0.85 : 1, animationConfig) },
      ],
    }),
    [isActive],
  );

  const handlePress = useCallback(() => {
    inputRef.current?.focus();
    onPress?.();
  }, [inputRef, onPress]);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  return (
    <View>
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <View
            style={styles.container({
              active: pressed || isFocused,
              error: !!error,
            })}
          >
            {leftAccessory && (
              <View style={styles.accessory}>{leftAccessory}</View>
            )}
            <View style={styles.textInputContainer}>
              {label && (
                <View style={styles.labelContainer}>
                  <Animated.Text style={[styles.label, labelAnimatedStyle]}>
                    {label}
                  </Animated.Text>
                </View>
              )}
              <TextInput
                {...restProps}
                ref={ref ?? inputRef}
                style={[
                  styles.textInput,
                  !!label && styles.textInputWithLabel,
                  style,
                ]}
                value={value}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor={theme.colors.contentTertiary}
                selectionColor={theme.colors.accentPrimary}
                pointerEvents="none"
              />
            </View>
            {rightAccessory && (
              <View style={styles.accessory}>{rightAccessory}</View>
            )}
          </View>
        )}
      </Pressable>
      {error && (
        <Text variant="body3" color="contentError" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
});

const stylesheet = createStyleSheet(
  ({ colors, borderRadius, spacing, textVariants }) => ({
    container: ({ active, error }: { active: boolean; error: boolean }) => ({
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      borderColor: active
        ? colors.accentPrimary
        : error
          ? colors.contentError
          : colors.borderPrimary,
      backgroundColor: colors.backgroundPrimary,
      paddingVertical: spacing.xsmall,
      paddingHorizontal: spacing.small,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      variants: {
        size: {
          small: { minHeight: heightConfig.small },
          medium: { minHeight: heightConfig.medium },
          large: { minHeight: heightConfig.large },
        },
      },
    }),
    textInputContainer: {
      flexGrow: 1,
      position: 'relative',
    },
    labelContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      zIndex: 1,
      justifyContent: 'center',
    },
    label: {
      color: colors.contentSecondary,
      textAlign: 'left',
      transformOrigin: 'left',
      variants: {
        size: {
          small: textVariants.body3,
          medium: textVariants.body2,
          large: textVariants.body1,
        },
      },
    },
    textInput: {
      flexGrow: 1,
      padding: 0,
      lineHeight: 0,
      color: colors.contentPrimary,
      variants: {
        size: {
          small: textVariants.body3,
          medium: textVariants.body2,
          large: textVariants.body1,
        },
      },
    },
    textInputWithLabel: {
      variants: {
        size: {
          small: {
            marginTop: spacing.small,
          },
          medium: {
            marginTop: spacing.medium,
          },
          large: {
            marginTop: spacing.large,
          },
        },
      },
    },
    accessory: {
      marginHorizontal: spacing.xsmall,
    },
    error: {
      marginTop: spacing.xsmall,
    },
  }),
);
