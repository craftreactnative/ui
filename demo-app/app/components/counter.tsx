import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { Counter } from '@/craftrn-ui/components/Counter';
import { InputText } from '@/craftrn-ui/components/InputText';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function CounterScreen() {
  const [, setCounterValue] = useState(0);
  const [controlledValue, setControlledValue] = useState<number | undefined>(0);
  const [increment, setIncrement] = useState(1);
  const [hasEmptyLabel, setHasEmptyLabel] = useState(false);
  const [emptyLabel, setEmptyLabel] = useState('Any');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Counter',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Counter
            value={controlledValue}
            increment={increment}
            onValueChange={setCounterValue}
            emptyLabel={hasEmptyLabel ? emptyLabel : undefined}
          />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Set Value Controls */}
        <View style={styles.controlSection}>
          <ListItem
            text="Set Value"
            textBelow="Set counter to specific value"
          />
          <View style={styles.toggleGroup}>
            {[0, 1, 5, 10].map(value => (
              <Button
                key={value}
                size="small"
                variant="subtle"
                intent={controlledValue === value ? 'primary' : 'secondary'}
                onPress={() => setControlledValue(value)}
              >
                {String(value)}
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.divider} />

        {/* Increment Step */}
        <View style={styles.controlSection}>
          <ListItem
            text="Increment Step"
            textBelow="How much to increase/decrease by"
          />
          <View style={styles.toggleGroup}>
            {[1, 2, 5].map(value => (
              <Button
                key={value}
                size="small"
                variant="subtle"
                intent={increment === value ? 'primary' : 'secondary'}
                onPress={() => setIncrement(value)}
              >
                {String(value)}
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.divider} />

        {/* Empty Label Toggle */}
        <ListItem
          text="Custom Empty Label"
          textBelow="Show custom label when counter is at min value"
          itemRight={
            <Switch value={hasEmptyLabel} onValueChange={setHasEmptyLabel} />
          }
          divider={hasEmptyLabel}
        />

        {/* Empty Label Text (only shown when enabled) */}
        {hasEmptyLabel && (
          <Animated.View
            key="empty-label-input"
            layout={LinearTransition.duration(300)}
            entering={FadeIn.duration(300)}
            style={styles.controlSection}
          >
            <ListItem
              text="Empty Label Text"
              textBelow="Text to show when counter is at minimum"
            />
            <InputText
              value={emptyLabel}
              onChangeText={setEmptyLabel}
              placeholder="Enter empty label text"
            />
          </Animated.View>
        )}
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
  controlSection: {
    gap: theme.spacing.medium,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    marginVertical: theme.spacing.xsmall,
  },
}));
