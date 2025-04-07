import { Card } from '@/craftrn-ui/components/Card';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function SwitchScreen() {
  const { styles } = useStyles(stylesheet);
  const [enabled1, setEnabled1] = useState(false);
  const [enabled2, setEnabled2] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Switch',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <Switch value={enabled1} onValueChange={setEnabled1} />
          <Switch value={enabled2} onValueChange={setEnabled2} />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Disabled
        </Text>
        <Card style={styles.componentContainer}>
          <Switch value={false} disabled />
          <Switch value={true} disabled />
        </Card>
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
  },
}));
