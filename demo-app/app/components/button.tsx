import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function ButtonScreen() {
  const { styles } = useStyles(stylesheet);

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
          <Button onPress={() => {}}>Primary</Button>
          <Button variant="secondary" onPress={() => {}}>
            Secondary
          </Button>
          <Button variant="negative" onPress={() => {}}>
            Negative
          </Button>
          <Button variant="text" onPress={() => {}}>
            Text
          </Button>
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Disabled
        </Text>
        <Card style={styles.componentContainer}>
          <Button disabled onPress={() => {}}>
            Primary
          </Button>
          <Button variant="secondary" disabled onPress={() => {}}>
            Secondary
          </Button>
          <Button variant="negative" disabled onPress={() => {}}>
            Negative
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
        </Card>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.horizontalScreen,
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
    flexWrap: 'wrap',
  },
}));
