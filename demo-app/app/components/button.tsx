import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
} from 'react-native-unistyles';

export default function ButtonScreen() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Button',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Variants
        </Text>
        <Card style={styles.componentContainer}>
          <Button onPress={() => {}}>Solid</Button>
          <Button variant="subtle" onPress={() => {}}>
            Subtle
          </Button>
          <Button variant="outlined" onPress={() => {}}>
            Outlined
          </Button>
          <Button variant="text" onPress={() => {}}>
            Text
          </Button>
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Intent / Solid
        </Text>
        <Card style={styles.componentContainer}>
          <Button intent="primary" onPress={() => {}}>
            Primary
          </Button>
          <Button intent="secondary" onPress={() => {}}>
            Secondary
          </Button>
          <Button intent="positive" onPress={() => {}}>
            Positive
          </Button>
          <Button intent="negative" onPress={() => {}}>
            Negative
          </Button>
        </Card>
        <Text variant="body2" style={styles.heading}>
          Intent / Subtle
        </Text>
        <Card style={styles.componentContainer}>
          <Button intent="primary" variant="subtle" onPress={() => {}}>
            Primary
          </Button>
          <Button intent="secondary" variant="subtle" onPress={() => {}}>
            Secondary
          </Button>
          <Button intent="positive" variant="subtle" onPress={() => {}}>
            Positive
          </Button>
          <Button intent="negative" variant="subtle" onPress={() => {}}>
            Negative
          </Button>
        </Card>
        <Text variant="body2" style={styles.heading}>
          Intent / Outlined
        </Text>
        <Card style={styles.componentContainer}>
          <Button intent="primary" variant="outlined" onPress={() => {}}>
            Primary
          </Button>
          <Button intent="secondary" variant="outlined" onPress={() => {}}>
            Secondary
          </Button>
          <Button intent="positive" variant="outlined" onPress={() => {}}>
            Positive
          </Button>
          <Button intent="negative" variant="outlined" onPress={() => {}}>
            Negative
          </Button>
        </Card>
        <Text variant="body2" style={styles.heading}>
          Intent / Text
        </Text>
        <Card style={styles.componentContainer}>
          <Button intent="primary" variant="text" onPress={() => {}}>
            Primary
          </Button>
          <Button intent="secondary" variant="text" onPress={() => {}}>
            Secondary
          </Button>
          <Button intent="positive" variant="text" onPress={() => {}}>
            Positive
          </Button>
          <Button intent="negative" variant="text" onPress={() => {}}>
            Negative
          </Button>
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Disabled
        </Text>
        <Card style={styles.componentContainer}>
          <Button disabled onPress={() => {}}>
            Solid
          </Button>
          <Button variant="subtle" disabled onPress={() => {}}>
            Subtle
          </Button>
          <Button variant="outlined" disabled onPress={() => {}}>
            Outlined
          </Button>
          <Button variant="text" disabled onPress={() => {}}>
            Text
          </Button>
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Sizes
        </Text>
        <Card style={styles.componentContainer}>
          <Button size="small" onPress={() => {}}>
            Small
          </Button>
          <Button size="regular" onPress={() => {}}>
            Regular
          </Button>
          <Button size="large" onPress={() => {}}>
            Large
          </Button>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing.xlarge,
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
    flexWrap: 'wrap',
  },
}));
