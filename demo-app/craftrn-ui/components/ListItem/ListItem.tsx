import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text/Text';

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
};

export const ListItem = ({
  itemLeft,
  text,
  textBelow,
  itemRight,
  onPress,
  divider = false,
  style,
}: Props) => {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View
            style={[
              styles.itemContainer(!!onPress && pressed),
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
  itemContainer: (pressed: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: pressed
      ? colors.backgroundTertiary
      : colors.backgroundPrimary,
  }),
  itemContent: {
    flex: 1,
    flexShrink: 1,
    gap: spacing.xxsmall,
  },
  itemText: {
    fontWeight: 'bold',
  },
  itemDivider: {
    borderBottomColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
  },
}));
