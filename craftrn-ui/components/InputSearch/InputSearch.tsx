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
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

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
   * Left element. Will be placed before the input.
   */
  itemLeft?: React.ReactNode;
  /**
   * Right element. Will be placed after the input.
   */
  itemRight?: React.ReactNode;
};

export const InputSearch = forwardRef<TextInput, Props & TextInputProps>(
  function InputSearch(
    { onPress, onFocus, onBlur, value, itemLeft, itemRight, ...props },
    ref,
  ) {
    const { theme } = useUnistyles();
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
          {itemLeft}
          <TextInput
            style={styles.textInput({ readOnly: isReadOnly })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            ref={ref}
            placeholderTextColor={theme.colors.contentTertiary}
            selectionColor={theme.colors.contentAccentSecondary}
            textAlignVertical="center"
            role="searchbox"
            {...props}
          />
          {itemRight}
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create(theme => {
  return {
    container: {
      width: '100%',
    },
    inputContainer: ({ active }: { active: boolean }) => ({
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: active
        ? theme.colors.contentAccentSecondary
        : theme.colors.borderNeutralSecondary,
      paddingHorizontal: theme.spacing.small,
      paddingVertical: theme.spacing.xsmall,
      height: 48,
      backgroundColor: theme.colors.backgroundElevated,
    }),
    textInput: ({ readOnly }: { readOnly: boolean }) => ({
      flexGrow: 1,
      padding: 0,
      marginHorizontal: theme.spacing.small,
      height: 48 - 2,
      pointerEvents: readOnly ? 'none' : 'auto',
      color: theme.colors.contentPrimary,
      lineHeight: Platform.OS === 'ios' ? 0 : undefined,
    }),
  };
});
