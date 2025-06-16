import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from 'react-native-unistyles';

export default function BottomSheetScreen() {
  const { styles } = useStyles(stylesheet);
  const [bottomSheetVisible1, setBottomSheetVisible1] = useState(false);
  const [bottomSheetVisible2, setBottomSheetVisible2] = useState(false);
  const [bottomSheetVisible3, setBottomSheetVisible3] = useState(false);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Stack.Screen
          options={{
            title: 'BottomSheet',
          }}
        />
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            Default
          </Text>
          <Card style={styles.componentContainer}>
            <Button
              onPress={() => setBottomSheetVisible1(!bottomSheetVisible1)}
            >
              Open bottom sheet
            </Button>
          </Card>
        </View>
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            Swipe down to close
          </Text>
          <Card style={styles.componentContainer}>
            <Button
              onPress={() => setBottomSheetVisible2(!bottomSheetVisible2)}
            >
              Open bottom sheet
            </Button>
          </Card>
        </View>
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            Tap overlay to dismiss
          </Text>
          <Card style={styles.componentContainer}>
            <Button
              onPress={() => setBottomSheetVisible3(!bottomSheetVisible1)}
            >
              Open bottom sheet
            </Button>
          </Card>
        </View>
      </ScrollView>
      <BottomSheet
        visible={bottomSheetVisible1}
        onRequestClose={() => setBottomSheetVisible1(false)}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeading}>
            <Text variant="heading3">Now close me</Text>
            <Text variant="body2">
              Tap the button to close the bottom sheet
            </Text>
          </View>
          <Button onPress={() => setBottomSheetVisible1(false)}>Close</Button>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={bottomSheetVisible2}
        onRequestClose={() => setBottomSheetVisible2(false)}
        enableSwipeToClose
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeading}>
            <Text variant="heading3">Now close me</Text>
            <Text variant="body2">Swipe down to close the bottom sheet</Text>
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={bottomSheetVisible3}
        onRequestClose={() => setBottomSheetVisible3(false)}
        enableOverlayTapToClose
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeading}>
            <Text variant="heading3">Now close me</Text>
            <Text variant="body2">
              Tap the overlay to close the bottom sheet
            </Text>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  content: {
    gap: theme.spacing.small,
    marginTop: theme.spacing.large,
  },
  heading: {
    fontWeight: 'bold',
  },
  componentContainer: {
    gap: theme.spacing.xxsmall,
    padding: theme.spacing.medium,
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
}));
