import { Card } from '@/craftrn-ui/components/Card';
import { PasscodeEntry } from '@/craftrn-ui/components/PasscodeEntry';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function PasscodeEntryScreen() {
  const [passcode, setPasscode] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'PasscodeEntry',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <PasscodeEntry
            onPasscodeEntered={passcode => setPasscode(passcode)}
          />
        </Card>
        <Text variant="body2">Passcode entered is: {passcode}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
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
    padding: theme.spacing.medium,
  },
}));
