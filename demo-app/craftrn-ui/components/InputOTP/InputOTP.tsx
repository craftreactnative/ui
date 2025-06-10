import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { InputText } from '../InputText/InputText';

const config = {
  length: 6,
  codeWidth: 24,
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

const getEmptyCode = () => Array(config.length).fill('');

export const InputOTP = ({ onChange }: Props) => {
  const { styles } = useStyles(stylesheet);
  const inputRefs = useRef<TextInput[]>([]);
  const [code, setCode] = useState(getEmptyCode);

  const resetCode = useCallback(() => {
    setCode(getEmptyCode());
    onChange('');
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  }, [onChange]);

  const handleFocus = useCallback((index: number) => {
    setCode(prev => {
      const newCode = [...prev];
      newCode[index] = '';
      return newCode;
    });
  }, []);

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && index > 0) {
        setCode(prev => {
          const newCode = [...prev];
          newCode[index - 1] = '';
          return newCode;
        });
        inputRefs.current[index - 1]?.focus();
        return;
      }

      const digit = parseInt(key, 10);
      if (isNaN(digit)) return;

      setCode(prev => {
        const newCode = [...prev];
        newCode[index] = key;
        return newCode;
      });

      if (index === config.length - 1) {
        const newCode = [...code];
        newCode[index] = key;

        if (newCode.includes('')) {
          resetCode();
        } else {
          inputRefs.current[index].blur();
          onChange(newCode.join(''));
        }
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code, resetCode, onChange],
  );

  const inputs = useMemo(
    () =>
      Array(config.length)
        .fill(null)
        .map((_, index) => (
          <InputText
            key={index}
            keyboardType="numeric"
            autoFocus={index === 0}
            ref={ref => {
              if (ref) {
                inputRefs.current[index] = ref;
              }
            }}
            onKeyPress={e => handleKeyPress(e.nativeEvent.key, index)}
            onPress={resetCode}
            onFocus={() => handleFocus(index)}
            style={styles.codeInputItem}
            value={code[index]}
            caretHidden
            maxLength={1}
            accessibilityLabel={`${index + 1} of ${config.length}`}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            inputMode="numeric"
          />
        )),
    [code, handleKeyPress, handleFocus, resetCode, styles.codeInputItem],
  );

  return (
    <View style={styles.container} role="group">
      {inputs}
    </View>
  );
};

const stylesheet = createStyleSheet(({ spacing, textVariants }) => ({
  container: {
    flexDirection: 'row',
    gap: spacing.xsmall,
  },
  codeInputItem: {
    ...textVariants.heading3,
    width: config.codeWidth,
    lineHeight: Platform.OS === 'ios' ? 0 : undefined,
    textAlign: 'center',
  },
}));
