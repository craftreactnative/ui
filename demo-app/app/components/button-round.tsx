import { Button } from '@/craftrn-ui/components/Button';
import { ButtonRound } from '@/craftrn-ui/components/ButtonRound';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { ChevronRight } from '@/tetrisly-icons/ChevronRight';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

type ButtonRoundVariant = 'default' | 'reversed' | 'accent';
type ButtonRoundIntent = 'primary' | 'secondary';
type ButtonRoundSize = 'small' | 'medium' | 'large';

export default function ButtonRoundScreen() {
  const [variant, setVariant] = useState<ButtonRoundVariant>('default');
  const [intent, setIntent] = useState<ButtonRoundIntent>('secondary');
  const [size, setSize] = useState<ButtonRoundSize>('medium');
  const [disabled, setDisabled] = useState(false);

  const variants: ButtonRoundVariant[] = ['default', 'reversed', 'accent'];
  const intents: ButtonRoundIntent[] = ['primary', 'secondary'];
  const sizes: ButtonRoundSize[] = ['small', 'medium', 'large'];

  // Intent is only available for default variant
  const showIntentControl = variant === 'default';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'ButtonRound',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <ButtonRound
            onPress={() => {}}
            {...(variant === 'default' ? { variant, intent } : { variant })}
            size={size}
            disabled={disabled}
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
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

        {/* Intent Selector (only for default variant) */}
        {showIntentControl && (
          <Animated.View
            layout={LinearTransition.duration(300)}
            entering={FadeIn.duration(300)}
            style={styles.controlSection}
          >
            <View style={styles.controlSection}>
              <ListItem
                text="Intent"
                textBelow="Only available for default variant"
              />
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
          </Animated.View>
        )}

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
