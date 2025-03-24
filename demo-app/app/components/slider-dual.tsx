import { Card } from '@/craftrn-ui/components/Card';
import { SliderDual } from '@/craftrn-ui/components/SliderDual';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function SliderDualScreen() {
  const { styles } = useStyles(stylesheet);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'SliderDual',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <SliderDual
            min={0}
            max={100}
            minInitialValue={minValue}
            maxInitialValue={maxValue}
            onValuesChange={({ min, max }) => {
              setMinValue(min);
              setMaxValue(max);
            }}
          />
        </Card>
        <Text variant="body2">
          Values: {minValue} - {maxValue}
        </Text>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With min and max initial values
        </Text>
        <Card style={styles.componentContainer}>
          <SliderDual
            min={0}
            max={100}
            minInitialValue={20}
            maxInitialValue={50}
            onValuesChange={({ min, max }) => {}}
          />
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
    padding: theme.spacing.large,
    alignItems: 'center',
  },
}));
