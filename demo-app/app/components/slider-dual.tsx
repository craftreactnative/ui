import { Card } from '@/craftrn-ui/components/Card';
import { SliderDual } from '@/craftrn-ui/components/SliderDual';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function SliderDualScreen() {
  const [minValue, setMinValue] = useState(20);
  const [maxValue, setMaxValue] = useState(50);

  const handleValuesChange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      setMinValue(min);
      setMaxValue(max);
    },
    [],
  );

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
            minInitialValue={0}
            maxInitialValue={100}
            onValuesChange={() => null}
          />
        </Card>
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
            onValuesChange={handleValuesChange}
          />
        </Card>
        <Text variant="body2">
          Values: {minValue} - {maxValue}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.spacing.large,
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
