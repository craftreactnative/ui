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

export const config = {
  medium: 48,
} as const;

/**
 * Props for the InputSearch component.
 * @see TextInputProps
 */
export type Props = {
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

export const InputSearch = forwardRef<TextInput, Props & TextInputProps>(
  function InputSearch(
    {
      onPress,
      onFocus,
      onBlur,
      value,
      leftAccessory,
      rightAccessory,
      ...props
    },
    ref,
  ) {
    const { styles, theme } = useStyles(stylesheet);
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || !!value;
    const isReadOnly = !props.editable && !!props.readOnly;
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
      <Pressable
        onPress={handlePress}
        style={styles.container}
        accessible={!!onPress}
        role={!!onPress ? 'button' : undefined}
      >
        <View
          style={styles.inputContainer({
            active: isActive,
          })}
        >
          {leftAccessory}
          <TextInput
            style={styles.textInput({ readOnly: isReadOnly })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            ref={ref}
            placeholderTextColor={theme.colors.contentTertiary}
            textAlignVertical="center"
            role="searchbox"
            {...props}
          />
          {rightAccessory}
        </View>
      </Pressable>
    );
  },
);

const stylesheet = createStyleSheet(({ colors, borderRadius, spacing }) => ({
  container: {
    shadowColor: colors.contentTertiary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
    shadowOpacity: 0.05,
    width: '100%',
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
    height: config.medium,
  }),
  textInput: ({ readOnly }) => ({
    flexGrow: 1,
    padding: 0,
    marginHorizontal: spacing.small,
    height: config.medium - 2,
    pointerEvents: readOnly ? 'none' : 'auto',
    color: colors.contentPrimary,
  }),
}));
