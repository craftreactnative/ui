import { Card } from '@/craftrn-ui/components/Card';
import { InputOTP } from '@/craftrn-ui/components/InputOTP';
import { Text } from '@/craftrn-ui/components/Text';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function InputOTPScreen() {
  const headerHeight = useHeaderHeight();

  const [otp, setOtp] = useState('');

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
            <InputOTP onChange={handleOtpChange} />
            {otp && (
              <Text
                variant="body3"
                color="contentSecondary"
                style={styles.otpValue}
              >
                Entered: {otp}
              </Text>
            )}
          </Card>
        </View>
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
    flex: 1,
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
    gap: theme.spacing.medium,
  },
  otpValue: {
    marginTop: theme.spacing.small,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}));
