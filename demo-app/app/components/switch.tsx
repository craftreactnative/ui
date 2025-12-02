import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function SwitchScreen() {
  const [enabled, setEnabled] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Switch',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Switch
            value={enabled}
            disabled={disabled}
            onValueChange={disabled ? undefined : setEnabled}
          />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Enabled State Toggle */}
        <ListItem
          text="Enabled"
          textBelow="Toggle the switch state"
          itemRight={<Switch value={enabled} onValueChange={setEnabled} />}
          divider
        />

        {/* Disabled Switch */}
        <ListItem
          text="Disabled"
          textBelow="Disable switch interactions"
          itemRight={<Switch value={disabled} onValueChange={setDisabled} />}
        />
      </Card>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
}));
