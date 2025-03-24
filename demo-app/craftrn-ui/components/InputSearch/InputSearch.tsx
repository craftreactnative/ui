import React, { forwardRef, useCallback, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const SIZE = 48;

/**
 * Props for the InputSearch component.
 * @see TextInputProps
 */
export type Props = TextInputProps & {
  /**
   * Callback function triggered when the input is pressed.
   */
  onPress?: () => void;
  /**
   * Left accessory element. Will be placed before the input.
   */
  leftAccessory?: React.ReactNode;
  /**
   * Right accessory element. Will be placed after the input.
   */
  rightAccessory?: React.ReactNode;
};

export const InputSearch = forwardRef<TextInput, Props>(function InputSearch(
  { onPress, onFocus, onBlur, value, leftAccessory, rightAccessory, ...props },
  ref,
) {
  const { styles } = useStyles(stylesheet);
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || !!value;
  const inputRef = useRef<TextInput>(null);

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

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.inputContainer({ active: isActive })}>
        {leftAccessory}
        <TextInput
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          ref={ref}
          {...props}
        />
        {rightAccessory}
      </View>
    </Pressable>
  );
});

const stylesheet = createStyleSheet(({ colors, borderRadius, spacing }) => ({
  container: {
    flex: 1,
    shadowColor: colors.contentTertiary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: 0.05,
  },
  inputContainer: ({ active }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundPrimary,
    borderWidth: 1,
    borderColor: active ? colors.accentPrimary : colors.borderPrimary,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xsmall,
    height: SIZE,
  }),
  input: {
    flex: 1,
    marginHorizontal: spacing.small,
  },
}));
