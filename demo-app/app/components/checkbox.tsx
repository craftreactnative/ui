import { Card } from '@/craftrn-ui/components/Card';
import { Checkbox } from '@/craftrn-ui/components/Checkbox';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function CheckboxScreen() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Checkbox',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <Checkbox checked={checked1} onPress={() => setChecked1(!checked1)} />
          <Checkbox onPress={() => setChecked2(!checked2)} checked={checked2} />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Disabled
        </Text>
        <Card style={styles.componentContainer}>
          <Checkbox checked={false} disabled />
          <Checkbox checked={true} disabled />
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
    flexDirection: 'row',
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
  },
}));
