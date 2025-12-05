import { Card } from '@/craftrn-ui/components/Card';
import {
  ContextMenu,
  ContextMenuElement,
} from '@/craftrn-ui/components/ContextMenu';
import { Block } from '@/tetrisly-icons/Block';
import { Copy } from '@/tetrisly-icons/Copy';
import { Share } from '@/tetrisly-icons/Share';
import { UserEdit } from '@/tetrisly-icons/UserEdit';
import { Stack } from 'expo-router';
import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

export default function ContextMenuScreen() {
  const { theme } = useUnistyles();

  const contextMenuItems: ContextMenuElement[] = [
    {
      id: '1',
      label: 'Edit',
      subtitle: 'Modify this item',
      onPress: () => Alert.alert('Edit', 'Edit action pressed'),
      itemLeft: <UserEdit color={theme.colors.contentSecondary} />,
    },
    {
      id: '2',
      label: 'Share',
      onPress: () => Alert.alert('Share', 'Share action pressed'),
      itemLeft: <Share color={theme.colors.contentSecondary} />,
    },
    {
      id: '3',
      label: 'Copy Link',
      subtitle: 'Copy to clipboard',
      onPress: () => Alert.alert('Copy Link', 'Link copied to clipboard'),
      itemLeft: <Copy color={theme.colors.contentSecondary} />,
    },
    {
      type: 'divider',
      id: 'divider-1',
    },
    {
      id: '4',
      label: 'Delete',
      onPress: () => Alert.alert('Delete', 'Delete action pressed'),
      itemLeft: <Block color={theme.colors.contentSecondary} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Context Menu',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <ContextMenu
                items={contextMenuItems}
                menuAnchorPosition="top-left"
                trigger={onPress => (
                  <Pressable style={styles.square} onPress={onPress}>
                    <View style={[styles.dot, styles.topLeft]} />
                  </Pressable>
                )}
              />

              <ContextMenu
                items={contextMenuItems}
                menuAnchorPosition="top-center"
                trigger={onPress => (
                  <Pressable style={styles.square} onPress={onPress}>
                    <View style={[styles.dot, styles.topCenter]} />
                  </Pressable>
                )}
              />

              <ContextMenu
                items={contextMenuItems}
                menuAnchorPosition="top-right"
                trigger={onPress => (
                  <Pressable style={styles.square} onPress={onPress}>
                    <View style={[styles.dot, styles.topRight]} />
                  </Pressable>
                )}
              />
            </View>

            <View style={styles.gridRow}>
              <ContextMenu
                items={contextMenuItems}
                menuAnchorPosition="bottom-left"
                trigger={onPress => (
                  <Pressable style={styles.square} onPress={onPress}>
                    <View style={[styles.dot, styles.bottomLeft]} />
                  </Pressable>
                )}
              />

              <ContextMenu
                items={contextMenuItems}
                menuAnchorPosition="bottom-center"
                trigger={onPress => (
                  <Pressable style={styles.square} onPress={onPress}>
                    <View style={[styles.dot, styles.bottomCenter]} />
                  </Pressable>
                )}
              />

              <ContextMenu
                items={contextMenuItems}
                menuAnchorPosition="bottom-right"
                trigger={onPress => (
                  <Pressable style={styles.square} onPress={onPress}>
                    <View style={[styles.dot, styles.bottomRight]} />
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing.medium,
  },
  demoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  demoContainer: {
    flex: 1,
    padding: theme.spacing.large,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  heading: {
    fontWeight: 'bold',
  },
  gridContainer: {
    gap: theme.spacing.medium,
  },
  gridRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    justifyContent: 'center',
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.backgroundNeutral,
    borderRadius: theme.borderRadius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderNeutralSecondary,
    position: 'relative',
  },
  dot: {
    width: theme.spacing.small,
    height: theme.spacing.small,
    borderRadius: theme.spacing.small / 2,
    backgroundColor: theme.colors.contentAccentSecondary,
    position: 'absolute',
  },
  topLeft: {
    top: theme.spacing.small,
    left: theme.spacing.small,
  },
  topCenter: {
    top: theme.spacing.small,
    left: '50%',
    marginLeft: -theme.spacing.small / 2,
  },
  topRight: {
    top: theme.spacing.small,
    right: theme.spacing.small,
  },
  bottomLeft: {
    bottom: theme.spacing.small,
    left: theme.spacing.small,
  },
  bottomCenter: {
    bottom: theme.spacing.small,
    left: '50%',
    marginLeft: -theme.spacing.small / 2,
  },
  bottomRight: {
    bottom: theme.spacing.small,
    right: theme.spacing.small,
  },
}));
