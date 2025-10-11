import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { SliderDual } from '@/craftrn-ui/components/SliderDual';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

type SliderRange = '0-50' | '0-100' | '10-90';

export default function SliderDualScreen() {
  const [minValue, setMinValue] = useState(20);
  const [maxValue, setMaxValue] = useState(50);
  const [range, setRange] = useState<SliderRange>('0-100');

  const ranges: SliderRange[] = ['0-50', '0-100', '10-90'];

  const handleRangeChange = useCallback(
    (newRange: SliderRange) => {
      const [currentMin, currentMax] = getRangeValues(range);
      const currentSpan = currentMax - currentMin;
      const minRatio = (minValue - currentMin) / currentSpan;
      const maxRatio = (maxValue - currentMin) / currentSpan;

      setRange(newRange);

      const [newMin, newMax] = getRangeValues(newRange);
      const newSpan = newMax - newMin;
      setMinValue(Math.round(newMin + minRatio * newSpan));
      setMaxValue(Math.round(newMin + maxRatio * newSpan));
    },
    [range, minValue, maxValue],
  );

  const handleValuesChange = useCallback(
    ({ min, max }: { min: number; max: number }) => {
      setMinValue(min);
      setMaxValue(max);
    },
    [],
  );

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
          title: 'SliderDual',
        }}
      />

      {/* Demo SliderDual */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <SliderDual
            min={min}
            max={max}
            minInitialValue={minValue}
            maxInitialValue={maxValue}
            onValuesChange={handleValuesChange}
          />
          <Text
            variant="body3"
            color="contentSecondary"
            style={styles.valueText}
          >
            Range: {minValue} - {maxValue}
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.medium,
    padding: theme.spacing.large,
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
