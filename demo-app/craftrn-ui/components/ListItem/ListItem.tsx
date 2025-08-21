import React from 'react';
import {
  AccessibilityProps,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text';

/**
 * Props for the ListItem component.
 */
export type Props = Pick<ViewProps, 'style'> & {
  /**
   * Left accessory element. Will be placed before the content.
   */
  itemLeft?: React.ReactElement;
  /**
   * Main text to display.
   */
  text: string;
  /**
   * Text to display below the main text.
   */
  textBelow?: string;
  /**
   * Right accessory element. Will be placed after the text.
   */
  itemRight?: React.ReactElement;
  /**
   * Callback function triggered when the item is pressed.
   */
  onPress?: () => void;
  /**
   * Whether to display a divider below the item.
   */
  divider?: boolean;
  /**
   * The visual style variant of the text
   */
  variant?: 'primary' | 'danger';
};

type ListItemProps = Props & AccessibilityProps;

export const ListItem = ({
  itemLeft,
  text,
  textBelow,
  itemRight,
  onPress,
  divider = false,
  style,
  variant = 'primary',
  ...accessibilityProps
}: ListItemProps) => {
  const { styles } = useStyles(stylesheet, { variant });
  return (
    <>
      <Pressable
        onPress={onPress}
        role={!!onPress ? 'button' : 'listitem'}
        {...accessibilityProps}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.itemContainer,
              !!onPress && pressed && styles.itemContainerPressed,
              StyleSheet.flatten(style),
            ]}
          >
            {itemLeft}
            <View style={styles.itemContent}>
              <Text variant="body2" style={styles.itemText}>
                {text}
              </Text>
              {textBelow && (
                <Text variant="body3" color="contentSecondary">
                  {textBelow}
                </Text>
              )}
            </View>
            {itemRight}
          </View>
        )}
      </Pressable>
      {divider && <View style={styles.itemDivider} />}
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, spacing }) => ({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.small,
  },
  itemContainerPressed: {
    backgroundColor: colors.surfaceTertiary,
  },
  itemContent: {
    flex: 1,
    flexShrink: 1,
    gap: spacing.xxsmall,
  },
  itemText: {
    fontWeight: 'bold',
    variants: {
      variant: {
        primary: {
          color: colors.contentPrimary,
        },
        danger: {
          color: colors.negativeSecondary,
        },
      },
    },
  },
  itemDivider: {
    borderBottomColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
  },
}));
