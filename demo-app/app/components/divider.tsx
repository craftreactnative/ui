import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { Divider } from '@/craftrn-ui/components/Divider';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

const orientations = ['horizontal', 'vertical'] as const;

export default function DividerScreen() {
  const [orientation, setOrientation] =
    useState<(typeof orientations)[number]>('horizontal');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Divider',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          {orientation === 'horizontal' ? (
            <View style={styles.horizontalDemo}>
              <Text variant="body2" color="contentPrimary">
                Content Above
              </Text>
              <Divider orientation={orientation} />
              <Text variant="body2" color="contentPrimary">
                Content Below
              </Text>
            </View>
          ) : (
            <View style={styles.verticalDemo}>
              <Text variant="body2" color="contentPrimary">
                Left
              </Text>
              <Divider orientation={orientation} />
              <Text variant="body2" color="contentPrimary">
                Right
              </Text>
            </View>
          )}
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Orientation Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Orientation" />
          <View style={styles.toggleGroup}>
            {orientations.map(o => (
              <Button
                key={o}
                size="small"
                variant={orientation === o ? 'secondary' : 'neutral'}
                onPress={() => setOrientation(o)}
              >
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </Button>
            ))}
          </View>
        </View>
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
    padding: theme.spacing.xlarge,
  },
  horizontalDemo: {
    width: '100%',
    gap: theme.spacing.large,
  },
  verticalDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.large,
    height: 100,
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.small,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
}));
