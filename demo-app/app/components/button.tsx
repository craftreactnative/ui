import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

type ButtonVariant = 'solid' | 'subtle' | 'outlined' | 'text';
type ButtonIntent = 'primary' | 'secondary' | 'positive' | 'negative';
type ButtonSize = 'small' | 'regular' | 'large';

export default function ButtonScreen() {
  const [variant, setVariant] = useState<ButtonVariant>('solid');
  const [intent, setIntent] = useState<ButtonIntent>('primary');
  const [size, setSize] = useState<ButtonSize>('regular');
  const [disabled, setDisabled] = useState(false);

  const variants: ButtonVariant[] = ['solid', 'subtle', 'outlined', 'text'];
  const intents: ButtonIntent[] = [
    'primary',
    'secondary',
    'positive',
    'negative',
  ];
  const sizes: ButtonSize[] = ['small', 'regular', 'large'];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Button',
        }}
      />

      {/* Demo Button */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Button
            variant={variant === 'solid' ? undefined : variant}
            intent={intent}
            size={size}
            disabled={disabled}
            onPress={() => {}}
          >
            Sample Button
          </Button>
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Variant Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Variant" />
          <View style={styles.toggleGroup}>
            {variants.map(v => (
              <Button
                key={v}
                size="small"
                variant="subtle"
                intent={variant === v ? 'primary' : 'secondary'}
                onPress={() => setVariant(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.divider} />

        {/* Intent Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Intent" />
          <View style={styles.toggleGroup}>
            {intents.map(i => (
              <Button
                key={i}
                size="small"
                variant="subtle"
                intent={intent === i ? 'primary' : 'secondary'}
                onPress={() => setIntent(i)}
              >
                {i.charAt(0).toUpperCase() + i.slice(1)}
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.divider} />

        {/* Size Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Size" />
          <View style={styles.toggleGroup}>
            {sizes.map(s => (
              <Button
                key={s}
                size="small"
                variant="subtle"
                intent={size === s ? 'primary' : 'secondary'}
                onPress={() => setSize(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.divider} />

        {/* Disabled Switch */}
        <ListItem
          text="Disabled"
          textBelow="Disable button interactions"
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
