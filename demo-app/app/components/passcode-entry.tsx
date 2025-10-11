import { Card } from '@/craftrn-ui/components/Card';
import { PasscodeEntry } from '@/craftrn-ui/components/PasscodeEntry';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function PasscodeEntryScreen() {
  const [passcode, setPasscode] = useState('');

  const handlePasscodeEntered = useCallback((value: string) => {
    setPasscode(value);
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'PasscodeEntry',
        }}
      />

      {/* Demo PasscodeEntry */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <View style={styles.passcodeEntryContainer}>
            <PasscodeEntry onPasscodeEntered={handlePasscodeEntered} />
          </View>
          {passcode && (
            <Text
              variant="body3"
              color="contentSecondary"
              style={styles.passcodeValue}
            >
              Entered: {passcode}
            </Text>
          )}
        </Card>
      </View>
    </ScrollView>
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
  passcodeEntryContainer: {
    height: 400,
    marginBottom: theme.spacing.xlarge,
  },
  passcodeValue: {
    marginTop: theme.spacing.small,
  },
  scrollView: {
    flex: 1,
  },
}));
