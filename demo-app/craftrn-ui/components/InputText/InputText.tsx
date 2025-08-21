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
import { createStyleSheet, useStyles } from 'react-native-unistyles';
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
    const { styles, theme } = useStyles(stylesheet, { size });
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
                  <Animated.Text style={[styles.label, labelAnimatedStyle]}>
                    {label}
                  </Animated.Text>
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

const stylesheet = createStyleSheet(
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
      variants: {
        size: {
          small: {
            minHeight: config.small.height,
            borderRadius: borderRadius.small,
          },
          medium: {
            minHeight: config.medium.height,
            borderRadius: borderRadius.medium,
          },
          large: {
            minHeight: config.large.height,
            borderRadius: borderRadius.large,
          },
        },
      },
    }),
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
      variants: {
        size: {
          medium: {
            ...textVariants.body2,
            lineHeight: config.medium.height - spacing.xsmall * 2,
          },
          large: {
            ...textVariants.body1,
            lineHeight: config.large.height - spacing.xsmall * 2,
          },
        },
      },
    },
    textInput: {
      flexGrow: 1,
      lineHeight: Platform.OS === 'ios' ? 0 : undefined,
      paddingVertical: 0,
      paddingLeft: 0,
      minWidth: 0,
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
