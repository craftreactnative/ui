import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from '../Text';

type Size = 'small' | 'medium' | 'large';

const animationConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.cubic),
};

/**
 * Base props for the InputText component.
 */
type BaseProps = {
  /**
   * The size of the input.
   * @default 'medium'
   */
  size?: Size;
  /**
   * Callback function triggered when the input is pressed.
   */
  onPress?: () => void;
  /**
   * Left element. Will be placed before the input.
   */
  itemLeft?: React.ReactElement;
  /**
   * Right element. Will be placed after the input.
   */
  itemRight?: React.ReactElement;
  /**
   * Error message to display below the input.
   */
  error?: string;
};

/**
 * Props for InputText with label (placeholder will be ignored).
 */
type PropsWithLabel = BaseProps & {
  /**
   * The label to display above the input.
   */
  label?: string;
  placeholder?: never;
};

/**
 * Props for InputText with placeholder (no label).
 */
type PropsWithPlaceholder = BaseProps & {
  label?: never;
  /**
   * Placeholder text to display when input is empty.
   */
  placeholder?: string;
};

/**
 * Props for the InputText component.
 * Either use label OR placeholder, but not both.
 */
export type Props = PropsWithLabel | PropsWithPlaceholder;

export const InputText = forwardRef<TextInput, Props & TextInputProps>(
  function InputText(
    {
      size = 'medium',
      label,
      onPress,
      value,
      itemLeft,
      itemRight,
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
    const isActive = isFocused || !!value;
    const isActiveShared = useSharedValue(isActive);
    const hasAnimatedOnce = useSharedValue(false);

    // Update active state
    useEffect(() => {
      isActiveShared.value = isActive;
    }, [isActive, isActiveShared]);

    const labelAnimatedStyle = useAnimatedStyle(() => {
      const isScaledDown = isActiveShared.value;
      const translateY = isScaledDown ? (size === 'medium' ? -8 : -10) : 0;
      const scale = isScaledDown ? 0.85 : 1;

      if (!hasAnimatedOnce.value) {
        hasAnimatedOnce.value = true;
        return {
          transform: [{ translateY }, { scale }],
        };
      }

      return {
        transform: [
          { translateY: withTiming(translateY, animationConfig) },
          { scale: withTiming(scale, animationConfig) },
        ],
      };
    }, [size]);

    const handlePress = useCallback(() => {
      inputRef.current?.focus();
      onPress?.();
    }, [onPress]);

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
                  size,
                }),
              ]}
            >
              {itemLeft && <View style={styles.item}>{itemLeft}</View>}
              <View style={styles.textInputContainer}>
                {label && (
                  <Animated.View
                    style={[styles.labelContainer, labelAnimatedStyle]}
                  >
                    <Animated.Text style={styles.label({ size })}>
                      {label}
                    </Animated.Text>
                  </Animated.View>
                )}
                <TextInput
                  {...restProps}
                  ref={ref ?? inputRef}
                  style={[styles.textInput({ size, hasLabel: !!label }), style]}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={() => setIsFocused(false)}
                  placeholderTextColor={theme.colors.contentTertiary}
                  selectionColor={theme.colors.contentAccentSecondary}
                  pointerEvents={!editable || readOnly ? 'none' : undefined}
                  editable={editable}
                  readOnly={readOnly}
                  accessibilityLabel={`${value ?? ''} ${error ?? ''}`}
                />
              </View>
              {itemRight && <View style={styles.item}>{itemRight}</View>}
            </View>
          )}
        </Pressable>
        {error && (
          <Text variant="body3" color="sentimentNegative" style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create(theme => {
  const containerPaddingVertical = theme.spacing.xsmall;
  const getTypography = (size: Size) =>
    size === 'small'
      ? theme.textVariants.body3
      : size === 'medium'
        ? theme.textVariants.body2
        : theme.textVariants.body1;
  const getHeight = (size: Size) =>
    size === 'small' ? 40 : size === 'medium' ? 48 : 56;

  return {
    container: ({
      active,
      error,
      size,
    }: {
      active: boolean;
      error: boolean;
      size: Size;
    }) => ({
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: active
        ? theme.colors.contentAccentSecondary
        : error
          ? theme.colors.sentimentNegative
          : theme.colors.borderNeutralSecondary,
      backgroundColor: theme.colors.backgroundElevated,
      paddingVertical: containerPaddingVertical,
      paddingHorizontal: theme.spacing.small,
      minHeight: getHeight(size),
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    }),
    textInputContainer: {
      flex: 1,
      position: 'relative',
    },
    labelContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      justifyContent: 'center',
      transformOrigin: 'left top',
    },
    label: ({ size }: { size: Size }) => {
      return {
        color: theme.colors.contentTertiary,
        textAlign: 'left',
        ...getTypography(size),
        lineHeight: getHeight(size) - containerPaddingVertical * 2 - 2,
      };
    },
    textInput: ({ size, hasLabel }: { size: Size; hasLabel: boolean }) => {
      const typography = getTypography(size);
      return {
        flex: 1,
        paddingVertical: 0,
        paddingLeft: 0,
        minWidth: 0,
        color: theme.colors.contentPrimary,
        ...typography,
        lineHeight: Platform.OS === 'ios' ? 0 : typography.lineHeight,
        marginTop: hasLabel ? (size === 'small' ? 0 : theme.spacing.large) : 0,
      };
    },
    item: {
      marginHorizontal: theme.spacing.xsmall,
    },
    error: {
      marginTop: theme.spacing.xsmall,
    },
  };
});
