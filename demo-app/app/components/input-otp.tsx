import { Card } from '@/craftrn-ui/components/Card';
import { InputOTP } from '@/craftrn-ui/components/InputOTP';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function InputOTPScreen() {
  const { styles } = useStyles(stylesheet);
  const [otp, setOtp] = useState('');

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          title: 'InputOTP',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <InputOTP onChange={setOtp} />
        </Card>
        <Text variant="body2">OTP entered is: {otp}</Text>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.horizontalScreen,
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
