import React, { forwardRef, useCallback, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from '../Text';

export const config = {
  small: {
    height: 40,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
  },
} as const;

/**
 * Props for the InputText component.
 */
export type Props = {
  /**
   * The label to display above the input.
   */
  label?: string;
  /**
   * The size of the input.
   * @default 'medium'
   */
  size?: keyof typeof config;
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

export const InputText = forwardRef<TextInput, Props & TextInputProps>(
  function InputText(
    {
      size = 'medium',
      label,
      onPress,
      value,
      leftAccessory,
      rightAccessory,
      onFocus,
      error,
      style,
      editable = true,
      readOnly = false,
      ...restProps
    },
    ref,
  ) {
    const { theme } = useUnistyles();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const reduceMotion = useReducedMotion();
    const isActive = isFocused || !!value;
    const isActiveShared = useSharedValue(false);

    // Fix Fabric timing issue - always use requestAnimationFrame for consistency
    React.useEffect(() => {
      requestAnimationFrame(() => {
        isActiveShared.value = isActive;
      });
    }, [isActive, isActiveShared]);

    const labelAnimatedStyle = useAnimatedStyle(() => {
      const animationConfig = {
        easing: Easing.inOut(Easing.cubic),
        duration: reduceMotion ? 0 : 200,
      };

      return {
        transform: [
          {
            translateY: withTiming(
              isActiveShared.value ? -12 : 0,
              animationConfig,
            ),
          },
          {
            scale: withTiming(isActiveShared.value ? 0.85 : 1, animationConfig),
          },
        ],
      };
    }, [reduceMotion]);

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
              style={[
                styles.container({
                  active: pressed || isFocused,
                  error: !!error,
                }),
                size === 'small' && styles.containerSmall,
                size === 'medium' && styles.containerMedium,
                size === 'large' && styles.containerLarge,
              ]}
            >
              {leftAccessory && (
                <View style={styles.accessory}>{leftAccessory}</View>
              )}
              <View style={styles.textInputContainer}>
                {label && (
                  <Animated.Text
                    style={[
                      styles.label,
                      size === 'medium' && styles.labelMedium,
                      size === 'large' && styles.labelLarge,
                      labelAnimatedStyle,
                    ]}
                  >
                    {label}
                  </Animated.Text>
                )}
                <TextInput
                  {...restProps}
                  ref={ref ?? inputRef}
                  style={[
                    styles.textInput,
                    size === 'small' && styles.textInputSmall,
                    size === 'medium' && styles.textInputMedium,
                    size === 'large' && styles.textInputLarge,
                    !!label && styles.textInputWithLabel,
                    !!label &&
                      size === 'medium' &&
                      styles.textInputWithLabelMedium,
                    !!label &&
                      size === 'large' &&
                      styles.textInputWithLabelLarge,
                    style,
                  ]}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={() => setIsFocused(false)}
                  placeholderTextColor={theme.colors.contentTertiary}
                  selectionColor={theme.colors.accentPrimary}
                  pointerEvents={!editable || readOnly ? 'none' : undefined}
                  editable={editable}
                  readOnly={readOnly}
                  accessibilityLabel={`${value ?? ''} ${error ?? ''}`}
                />
              </View>
              {rightAccessory && (
                <View style={styles.accessory}>{rightAccessory}</View>
              )}
            </View>
          )}
        </Pressable>
        {error && (
          <Text variant="body2" color="negativeSecondary" style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create(
  ({ colors, borderRadius, spacing, textVariants }) => ({
    container: ({ active, error }: { active: boolean; error: boolean }) => ({
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      borderColor: active
        ? colors.accentPrimary
        : error
          ? colors.negativeSecondary
          : colors.borderPrimary,
      backgroundColor: colors.surfacePrimary,
      paddingVertical: spacing.xsmall,
      paddingHorizontal: spacing.small,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    }),
    containerSmall: {
      minHeight: config.small.height,
      borderRadius: borderRadius.small,
    },
    containerMedium: {
      minHeight: config.medium.height,
      borderRadius: borderRadius.medium,
    },
    containerLarge: {
      minHeight: config.large.height,
      borderRadius: borderRadius.large,
    },
    textInputContainer: {
      flexGrow: 1,
      position: 'relative',
    },
    label: {
      zIndex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      color: colors.contentSecondary,
      textAlign: 'left',
      transformOrigin: '0 50%',
    },
    labelMedium: {
      ...textVariants.body2,
      lineHeight: config.medium.height - spacing.xsmall * 2,
    },
    labelLarge: {
      ...textVariants.body1,
      lineHeight: config.large.height - spacing.xsmall * 2,
    },
    textInput: {
      flexGrow: 1,
      lineHeight: Platform.OS === 'ios' ? 0 : undefined,
      paddingVertical: 0,
      paddingLeft: 0,
      minWidth: 0,
      color: colors.contentPrimary,
    },
    textInputSmall: textVariants.body3,
    textInputMedium: textVariants.body2,
    textInputLarge: textVariants.body1,
    textInputWithLabel: {
      marginTop: 0,
    },
    textInputWithLabelMedium: {
      marginTop: spacing.medium,
    },
    textInputWithLabelLarge: {
      marginTop: spacing.large,
    },
    accessory: {
      marginHorizontal: spacing.xsmall,
    },
    error: {
      marginTop: spacing.xsmall,
    },
  }),
);
