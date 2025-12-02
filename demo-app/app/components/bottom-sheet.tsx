import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function BottomSheetScreen() {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [enableSwipeToClose, setEnableSwipeToClose] = useState(false);
  const [enableOverlayTapToClose, setEnableOverlayTapToClose] = useState(false);
  const [showHandleBar, setShowHandleBar] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'BottomSheet',
          }}
        />

        {/* Demo Section */}
        <View style={styles.demoSection}>
          <Card style={styles.demoContainer}>
            <Button size="large" onPress={() => setBottomSheetVisible(true)}>
              Open Bottom Sheet
            </Button>
          </Card>
        </View>

        {/* Controls */}
        <Card style={styles.controlsCard}>
          {/* Toggle Controls */}
          <View style={styles.listSection}>
            <ListItem
              text="Swipe to Close"
              textBelow="Enable swipe down gesture to close"
              itemRight={
                <Switch
                  value={enableSwipeToClose}
                  onValueChange={setEnableSwipeToClose}
                />
              }
              divider
            />
            <ListItem
              text="Overlay Tap to Close"
              textBelow="Tap overlay background to close"
              itemRight={
                <Switch
                  value={enableOverlayTapToClose}
                  onValueChange={setEnableOverlayTapToClose}
                />
              }
              divider
            />
            <ListItem
              text="Show Handle Bar"
              textBelow="Display drag handle at the top"
              itemRight={
                <Switch
                  value={showHandleBar}
                  onValueChange={setShowHandleBar}
                />
              }
            />
          </View>
        </Card>
      </View>

      <BottomSheet
        visible={bottomSheetVisible}
        onRequestClose={() => setBottomSheetVisible(false)}
        enableSwipeToClose={enableSwipeToClose}
        enableOverlayTapToClose={enableOverlayTapToClose}
        showHandleBar={showHandleBar}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeading}>
            <Text variant="heading3">Bottom Sheet Demo</Text>
            <Text variant="body2">
              Configure the options above to see how they affect this bottom
              sheet
            </Text>
          </View>

          <Text variant="body2">Current configuration:</Text>

          <View style={styles.configList}>
            <Text variant="body3">
              • Swipe to close: {enableSwipeToClose ? 'true' : 'false'}
            </Text>
            <Text variant="body3">
              • Overlay tap to close:{' '}
              {enableOverlayTapToClose ? 'true' : 'false'}
            </Text>
            <Text variant="body3">
              • Handle bar: {showHandleBar ? 'true' : 'false'}
            </Text>
          </View>

          <Text variant="body2">
            This bottom sheet component provides a smooth way to display
            additional content that slides up from the bottom of the screen. You
            can experiment with different configurations using the controls
            above.
          </Text>

          <Button onPress={() => setBottomSheetVisible(false)}>Close</Button>
        </View>
      </BottomSheet>
    </>
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
    marginBottom: theme.spacing.large,
  },
  demoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.small,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
  listSection: {
    gap: theme.spacing.medium,
    overflow: 'hidden',
  },
  bottomSheetContent: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.small,
    gap: theme.spacing.large,
    paddingBottom: UnistylesRuntime.insets.bottom,
  },
  bottomSheetHeading: {
    paddingBottom: theme.spacing.large,
  },
  configList: {
    gap: theme.spacing.small,
    paddingLeft: theme.spacing.medium,
  },
}));
