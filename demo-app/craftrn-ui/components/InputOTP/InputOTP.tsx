import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, TextInput } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '../Text';

const config = {
  length: 6,
};

const animationConfig = {
  fadeIn: {
    duration: 200,
    easing: Easing.out(Easing.quad),
  },
  shake: {
    duration: 80,
    offset: 4,
  },
};

/**
 * Props for the InputOTP component.
 */
export type Props = {
  /**
   * Callback function triggered when the OTP value is filled.
   */
  onChange: (value: string) => void;
  /**
   * Whether the input is in an error state.
   */
  error?: boolean;
};

export const InputOTP = ({ onChange, error = false }: Props) => {
  const hiddenInputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const previousCodeLengthRef = useRef(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (error) {
      const { duration, offset } = animationConfig.shake;
      translateX.value = withSequence(
        withTiming(-offset, { duration }),
        withTiming(offset, { duration }),
        withTiming(-offset, { duration }),
        withTiming(offset, { duration }),
        withTiming(0, { duration }),
      );
    }
  }, [error, translateX]);

  const handleTextChange = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '').slice(0, config.length);

      const isPasted =
        previousCodeLengthRef.current === 0 &&
        numericText.length === config.length;
      setShouldAnimate(!isPasted);

      previousCodeLengthRef.current = numericText.length;
      setCode(numericText);

      setFocusedIndex(
        numericText.length < config.length
          ? numericText.length
          : config.length - 1,
      );

      if (numericText.length === config.length) {
        onChange(numericText);
        hiddenInputRef.current?.blur();
      } else {
        onChange('');
      }
    },
    [onChange],
  );

  const handleFocus = useCallback(() => {
    if (code.length === config.length) {
      setCode('');
      previousCodeLengthRef.current = 0;
      setFocusedIndex(0);
      onChange('');
    } else {
      setFocusedIndex(
        code.length < config.length ? code.length : config.length - 1,
      );
    }
  }, [code.length, onChange]);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handlePress = useCallback(() => {
    hiddenInputRef.current?.focus();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const inputs = useMemo(
    () =>
      Array(config.length)
        .fill(null)
        .map((_, index) => {
          const char = code[index] || '';
          const isFocused = index === focusedIndex;

          return (
            <Pressable
              key={index}
              onPress={handlePress}
              style={[
                styles.codeInputItem,
                isFocused && styles.focusedInput,
                error && styles.errorInput,
              ]}
            >
              {char && shouldAnimate ? (
                <Animated.View
                  entering={FadeInDown.duration(
                    animationConfig.fadeIn.duration,
                  ).easing(animationConfig.fadeIn.easing)}
                >
                  <Text
                    variant="heading3"
                    accessibilityLabel={`${index + 1} of ${config.length}`}
                  >
                    {char}
                  </Text>
                </Animated.View>
              ) : (
                <Text
                  variant="heading3"
                  accessibilityLabel={`${index + 1} of ${config.length}`}
                >
                  {char}
                </Text>
              )}
            </Pressable>
          );
        }),
    [
      code,
      focusedIndex,
      handlePress,
      shouldAnimate,
      error,
      styles.codeInputItem,
      styles.focusedInput,
      styles.errorInput,
    ],
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {inputs}
      <TextInput
        ref={hiddenInputRef}
        value={code}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={config.length}
        keyboardType="numeric"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        inputMode="numeric"
        caretHidden
        style={styles.hiddenInput}
        autoFocus
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    position: 'relative',
  },
  codeInputItem: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralSecondary,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundElevated,
  },
  focusedInput: {
    borderColor: theme.colors.contentAccentSecondary,
  },
  errorInput: {
    borderColor: theme.colors.sentimentNegative,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.05,
    fontSize: 1,
  },
}));
