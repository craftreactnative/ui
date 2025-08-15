import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text';

const config = {
  length: 6,
};

/**
 * Props for the InputOTP component.
 */
export type Props = {
  /**
   * Callback function triggered when the OTP value is filled.
   */
  onChange: (value: string) => void;
};

export const InputOTP = ({ onChange }: Props) => {
  const { styles } = useStyles(stylesheet);
  const hiddenInputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleTextChange = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '').slice(0, config.length);
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
    setFocusedIndex(
      code.length < config.length ? code.length : config.length - 1,
    );
  }, [code.length]);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handlePress = useCallback(() => {
    hiddenInputRef.current?.focus();
  }, []);

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
              style={[styles.codeInputItem, isFocused && styles.focusedInput]}
            >
              <Text
                variant="heading3"
                accessibilityLabel={`${index + 1} of ${config.length}`}
              >
                {char}
              </Text>
            </Pressable>
          );
        }),
    [
      code,
      focusedIndex,
      handlePress,
      styles.codeInputItem,
      styles.focusedInput,
    ],
  );

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const stylesheet = createStyleSheet(({ spacing, colors, borderRadius }) => ({
  container: {
    flexDirection: 'row',
    gap: spacing.xsmall,
    position: 'relative',
  },
  codeInputItem: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfacePrimary,
  },
  focusedInput: {
    borderColor: colors.accentPrimary,
    borderWidth: 1,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    fontSize: 1,
  },
}));
