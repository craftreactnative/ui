import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Slider } from '@/craftrn-ui/components/Slider';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { Divider } from '../../craftrn-ui/components/Divider';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'neutral-secondary',
  'negative',
] as const;
const sizes = ['small', 'regular', 'large'] as const;

export default function ButtonScreen() {
  const [variant, setVariant] = useState<(typeof variants)[number]>('primary');
  const [size, setSize] = useState<(typeof sizes)[number]>('regular');
  const [disabled, setDisabled] = useState(false);
  const [scaleIn, setScaleIn] = useState(105);

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
            variant={variant}
            size={size}
            disabled={disabled}
            animationConfig={{ scaleIn: scaleIn / 100 }}
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
                variant={variant === v ? 'secondary' : 'neutral'}
                onPress={() => setVariant(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Size Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Size" />
          <View style={styles.toggleGroup}>
            {sizes.map(s => (
              <Button
                key={s}
                size="small"
                variant={size === s ? 'secondary' : 'neutral'}
                onPress={() => setSize(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Animation Scale Slider */}
        <View style={styles.controlSection}>
          <ListItem text="Animation Scale" textBelow={`Scale: ${scaleIn}%`} />
          <View style={styles.sliderContainer}>
            <Slider
              min={80}
              max={120}
              initialValue={scaleIn}
              onValueChange={setScaleIn}
              step={1}
            />
          </View>
        </View>
        <Divider style={styles.divider} />

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
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.small,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
  divider: {
    marginVertical: theme.spacing.xsmall,
  },
}));
