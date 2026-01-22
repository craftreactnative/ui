import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { InputText } from '@/craftrn-ui/components/InputText';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function BottomSheetScreen() {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [enableSwipeToClose, setEnableSwipeToClose] = useState(false);
  const [enableOverlayTapToClose, setEnableOverlayTapToClose] = useState(false);
  const [showHandleBar, setShowHandleBar] = useState(false);
  const [showInputText, setShowInputText] = useState(true);
  const [textFieldValue, setTextFieldValue] = useState('');

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
              divider
            />
            <ListItem
              text="Show Input Text"
              textBelow="Display input field in the modal"
              itemRight={
                <Switch
                  value={showInputText}
                  onValueChange={setShowInputText}
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
        <ScrollView
          style={styles.bottomSheetScrollView}
          contentContainerStyle={styles.bottomSheetContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <Text variant="heading3" style={styles.bottomSheetHeading}>
            Bottom Sheet Demo
          </Text>
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

          {showInputText && (
            <>
              <Text variant="body2" style={styles.description}>
                Test the keyboard behavior by focusing the input field below. The
                bottom sheet should float above the keyboard.
              </Text>

              <View style={styles.textFieldSection}>
                <InputText
                  label="Enter text here"
                  value={textFieldValue}
                  autoFocus
                  onChangeText={setTextFieldValue}
                />
              </View>
            </>
          )}

          <Button onPress={() => setBottomSheetVisible(false)}>Close</Button>
        </ScrollView>
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
  bottomSheetScrollView: {
    flex: 1,
  },
  bottomSheetContent: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.small,
    gap: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing.large,
  },
  bottomSheetHeading: {
    marginBottom: theme.spacing.xsmall,
  },
  description: {
    marginBottom: theme.spacing.small,
    color: theme.colors.contentSecondary,
  },
  textFieldSection: {
    gap: theme.spacing.small,
  },
}));
