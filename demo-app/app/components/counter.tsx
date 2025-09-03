import { Card } from '@/craftrn-ui/components/Card';
import { Counter } from '@/craftrn-ui/components/Counter';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function CounterScreen() {
  const [counter1Value, setCounter1Value] = useState(0);
  const [counter2Value, setCounter2Value] = useState(0);
  const { theme } = useUnistyles();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Counter',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <Counter
            initialValue={counter1Value}
            onValueChange={setCounter1Value}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With empty label
        </Text>
        <Card style={styles.componentContainer}>
          <Counter
            initialValue={counter2Value}
            onValueChange={setCounter2Value}
            emptyLabel="Any"
          />
        </Card>
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
    gap: theme.spacing.xxsmall,
    padding: theme.spacing.medium,
  },
}));
