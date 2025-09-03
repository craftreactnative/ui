import { Card } from '@/craftrn-ui/components/Card';
import { InputText } from '@/craftrn-ui/components/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { Search } from '@/tetrisly-icons/Search';
import { Slider } from '@/tetrisly-icons/Slider';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

export default function InputTextScreen() {
  const { theme } = useUnistyles();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Stack.Screen
          options={{
            title: 'InputText',
          }}
        />
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            Sizes
          </Text>
          <Card style={styles.componentContainer}>
            <InputText size="small" />
            <InputText label="First name" size="medium" />
            <InputText label="First name" size="large" />
          </Card>
        </View>
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            Prefilled
          </Text>
          <Card style={styles.componentContainer}>
            <InputText size="small" value="Thomas" />
            <InputText label="First name" size="medium" value="Charlotte" />
            <InputText label="First name" size="large" value="Hugo" />
          </Card>
        </View>
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            With left accessory
          </Text>
          <Card style={styles.componentContainer}>
            <InputText
              label="Contact name"
              leftAccessory={
                <View style={styles.leftAccessory}>
                  <Search color={theme.colors.contentPrimary} />
                </View>
              }
            />
          </Card>
        </View>
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            With right accessory
          </Text>
          <Card style={styles.componentContainer}>
            <InputText
              label="Messages"
              rightAccessory={
                <View style={styles.rightAccessory}>
                  <Slider color={theme.colors.contentPrimary} />
                </View>
              }
            />
          </Card>
        </View>
        <View style={styles.content}>
          <Text variant="body2" style={styles.heading}>
            With error
          </Text>
          <Card style={styles.componentContainer}>
            <InputText label="Last name" error="This field is required" />
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.ime,
  },
  content: {
    gap: theme.spacing.small,
    marginTop: theme.spacing.large,
  },
  heading: {
    fontWeight: 'bold',
  },
  componentContainer: {
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
  },
  leftAccessory: {
    marginRight: theme.spacing.small,
  },
  rightAccessory: {
    marginLeft: theme.spacing.small,
  },
}));
