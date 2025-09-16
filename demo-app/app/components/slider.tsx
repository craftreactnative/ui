import { Card } from '@/craftrn-ui/components/Card';
import { Slider } from '@/craftrn-ui/components/Slider';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function SliderScreen() {
  const [sliderValue, setSliderValue] = useState(25);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Slider',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <Slider
            min={0}
            max={100}
            initialValue={0}
            onValueChange={() => null}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With value
        </Text>
        <Card style={styles.componentContainer}>
          <Slider
            min={0}
            max={100}
            initialValue={25}
            onValueChange={setSliderValue}
          />
        </Card>
        <Text variant="body2">Value: {sliderValue}</Text>
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
