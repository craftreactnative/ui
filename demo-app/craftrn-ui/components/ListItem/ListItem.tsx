import React from 'react';
import { AccessibilityProps, Pressable, View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Divider } from '../Divider';
import { Text } from '../Text';

/**
 * Props for the ListItem component.
 */
export type Props = Pick<ViewProps, 'style'> & {
  /**
   * Left element. Will be placed before the content.
   */
  itemLeft?: React.ReactElement;
  /**
   * Text to display above the main text.
   */
  textAbove?: string;
  /**
   * Main text to display.
   */
  text: string;
  /**
   * Text to display below the main text.
   */
  textBelow?: string;
  /**
   * Right element. Will be placed after the text.
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
  textAbove,
  text,
  textBelow,
  itemRight,
  onPress,
  divider = false,
  style,
  variant = 'primary',
  ...accessibilityProps
}: ListItemProps) => {
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
              {textAbove && (
                <Text variant="body3" color="contentTertiary">
                  {textAbove}
                </Text>
              )}
              <Text
                variant="body2"
                color={
                  variant === 'danger' ? 'sentimentNegative' : 'contentPrimary'
                }
                style={styles.text}
              >
                {text}
              </Text>
              {textBelow && (
                <Text variant="body3" color="contentTertiary">
                  {textBelow}
                </Text>
              )}
            </View>
            {itemRight}
          </View>
        )}
      </Pressable>
      {divider && <Divider />}
    </>
  );
};

const styles = StyleSheet.create(theme => ({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  itemContainerPressed: {
    backgroundColor: theme.colors.interactiveNeutralPress,
  },
  itemContent: {
    flex: 1,
    flexShrink: 1,
    minWidth: 100,
    gap: theme.spacing.xxsmall,
    paddingVertical: theme.spacing.xxsmall,
  },
  text: {
    fontWeight: '500',
  },
}));
