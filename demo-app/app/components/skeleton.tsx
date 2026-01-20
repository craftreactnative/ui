import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Skeleton } from '@/craftrn-ui/components/Skeleton';
import { Slider } from '@/craftrn-ui/components/Slider';
import { CheckLarge } from '@/tetrisly-icons/CheckLarge';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';
import { Divider } from '../../craftrn-ui/components/Divider';

type SkeletonColor = 0 | 1 | 2 | 3;

export default function SkeletonScreen() {
  const { theme } = useUnistyles();
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(20);
  const [borderRadius, setBorderRadius] = useState(8);
  const [color, setColor] = useState<SkeletonColor>(0);

  const themeColors: SkeletonColor[] = [0, 1, 2, 3];
  const colorValues = [
    theme.colors.backgroundNeutral,
    theme.colors.purple,
    theme.colors.maroon,
    theme.colors.forest,
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'Skeleton',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Skeleton
            width={width}
            height={height}
            borderRadius={borderRadius}
            color={colorValues[color]}
          />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Width Control */}
        <View style={styles.controlSection}>
          <ListItem
            text="Width"
            textBelow={`Adjust width: ${width}px`}
          />
          <View style={styles.sliderContainer}>
            <Slider
              min={50}
              max={300}
              initialValue={width}
              width={300}
              onValueChange={setWidth}
              ariaLabel="Skeleton width"
              accessibilityHint="Adjust the width of the skeleton"
            />
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Height Control */}
        <View style={styles.controlSection}>
          <ListItem
            text="Height"
            textBelow={`Adjust height: ${height}px`}
          />
          <View style={styles.sliderContainer}>
            <Slider
              min={10}
              max={100}
              initialValue={height}
              width={300}
              onValueChange={setHeight}
              ariaLabel="Skeleton height"
              accessibilityHint="Adjust the height of the skeleton"
            />
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Border Radius Control */}
        <View style={styles.controlSection}>
          <ListItem
            text="Border Radius"
            textBelow={`Adjust border radius: ${borderRadius}px`}
          />
          <View style={styles.sliderContainer}>
            <Slider
              min={0}
              max={50}
              initialValue={borderRadius}
              width={300}
              onValueChange={setBorderRadius}
              ariaLabel="Skeleton border radius"
              accessibilityHint="Adjust the border radius of the skeleton"
            />
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Color Picker */}
        <View style={styles.controlSection}>
          <ListItem text="Color" />
          <View style={styles.colorGroup}>
            {themeColors.map((colorIndex, index) => (
              <Pressable
                key={colorIndex}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: colorValues[index],
                  },
                ]}
                onPress={() => setColor(colorIndex)}
              >
                {color === colorIndex && (
                  <View style={styles.checkmarkContainer}>
                    <CheckLarge
                      color={theme.colors.baseLight}
                      size={20}
                    />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing.medium,
  },
  demoSection: {
    flex: 1,
    marginBottom: theme.spacing.large,
    justifyContent: 'center',
  },
  demoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xlarge,
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.xsmall,
  },
  sliderContainer: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    alignItems: 'center',
  },
  divider: {
    marginVertical: theme.spacing.xsmall,
  },
  colorGroup: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    alignItems: 'center',
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
