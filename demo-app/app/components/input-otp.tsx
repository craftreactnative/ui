import { Card } from '@/craftrn-ui/components/Card';
import { InputOTP } from '@/craftrn-ui/components/InputOTP';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Text } from '@/craftrn-ui/components/Text';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { Divider } from '../../craftrn-ui/components/Divider';

export default function InputOTPScreen() {
  const headerHeight = useHeaderHeight();

  const [otp, setOtp] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleOtpChange = useCallback((value: string) => {
    setOtp(value);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
      style={styles.keyboardView}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Stack.Screen
          options={{
            title: 'InputOTP',
          }}
        />

        {/* Demo OTP */}
        <View style={styles.demoSection}>
          <Card style={styles.demoContainer}>
            <InputOTP
              onChange={handleOtpChange}
              error={hasError && otp.length === 6}
            />
            <Text
              variant="body3"
              color="contentSecondary"
              style={styles.otpValue({ opacity: otp ? 1 : 0 })}
            >
              Entered: {otp}
            </Text>
          </Card>
        </View>

        {/* Controls */}
        <Card style={styles.controlsCard}>
          {/* Error State Switch */}
          <ListItem
            text="Error State"
            textBelow="Show error when OTP is complete"
            itemRight={<Switch value={hasError} onValueChange={setHasError} />}
          />
          <Divider style={styles.divider} />

          {/* Copy/Paste */}
          <View style={styles.controlSection}>
            <ListItem
              text="Copy/Paste Test"
              textBelow="Copy and paste into OTP input above"
            />
            <TextInput
              style={styles.controlsInput}
              value="123456"
              selectTextOnFocus
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing.medium,
  },
  demoSection: {
    height: 300,
    marginBottom: theme.spacing.large,
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
    gap: theme.spacing.medium,
  },
  otpValue: ({ opacity }) => ({
    marginTop: theme.spacing.small,
    opacity,
  }),
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.small,
  },
  controlsInput: {
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralSecondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    fontSize: theme.fontSizes.xlarge.fontSize,
    color: theme.colors.contentPrimary,
    backgroundColor: theme.colors.interactiveNeutral,
    textAlign: 'center',
  },
  divider: {
    marginVertical: theme.spacing.xsmall,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}));
