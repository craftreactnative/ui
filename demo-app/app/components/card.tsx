import { Card } from '@/craftrn-ui/components/Card';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { Text } from '../../craftrn-ui/components/Text';

export default function CardScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Card',
        }}
      />

      {/* Demo Button */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Text variant="body3">Just a card</Text>
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
    marginBottom: theme.spacing.large,
  },
  demoContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
