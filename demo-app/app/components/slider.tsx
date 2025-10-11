import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Slider } from '@/craftrn-ui/components/Slider';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

type SliderRange = '0-50' | '0-100' | '10-90';

export default function SliderScreen() {
  const [sliderValue, setSliderValue] = useState(25);
  const [range, setRange] = useState<SliderRange>('0-100');

  const ranges: SliderRange[] = ['0-50', '0-100', '10-90'];

  const handleRangeChange = useCallback(
    (newRange: SliderRange) => {
      const [currentMin, currentMax] = getRangeValues(range);
      const currentSpan = currentMax - currentMin;
      const ratio = (sliderValue - currentMin) / currentSpan;

      setRange(newRange);

      const [newMin, newMax] = getRangeValues(newRange);
      const newSpan = newMax - newMin;
      setSliderValue(Math.round(newMin + ratio * newSpan));
    },
    [range, sliderValue],
  );

  const handleValueChange = useCallback((value: number) => {
    setSliderValue(value);
  }, []);

  const getRangeValues = (rangeType: SliderRange) => {
    switch (rangeType) {
      case '0-50':
        return [0, 50];
      case '10-90':
        return [10, 90];
      default:
        return [0, 100];
    }
  };

  const [min, max] = getRangeValues(range);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'Slider',
        }}
      />

      {/* Demo Slider */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Slider
            min={min}
            max={max}
            initialValue={sliderValue}
            onValueChange={handleValueChange}
          />
          <Text
            variant="body3"
            color="contentSecondary"
            style={styles.valueText}
          >
            Value: {sliderValue}
          </Text>
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Range Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Range" />
          <View style={styles.toggleGroup}>
            {ranges.map(currentRange => (
              <Button
                key={currentRange}
                size="small"
                variant="subtle"
                intent={range === currentRange ? 'primary' : 'secondary'}
                onPress={() => handleRangeChange(currentRange)}
              >
                {currentRange}
              </Button>
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexGrow: 1,
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
    justifyContent: 'center',
    padding: theme.spacing.large,
    gap: theme.spacing.medium,
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
  valueText: {
    textAlign: 'center',
    marginTop: theme.spacing.small,
  },
  scrollView: {
    flex: 1,
  },
}));
