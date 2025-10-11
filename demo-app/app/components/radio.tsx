import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Radio } from '@/craftrn-ui/components/Radio';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function RadioScreen() {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Radio',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Radio
            checked={checked}
            disabled={disabled}
            onPress={() => !disabled && setChecked(!checked)}
          />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Checked State Toggle */}
        <ListItem
          text="Checked"
          textBelow="Toggle the checked state"
          itemRight={<Switch value={checked} onValueChange={setChecked} />}
          divider
        />

        {/* Disabled Switch */}
        <ListItem
          text="Disabled"
          textBelow="Disable radio interactions"
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
    gap: theme.spacing.large,
  },
}));
