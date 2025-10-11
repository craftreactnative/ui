import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

type TextColor =
  | 'contentPrimary'
  | 'contentSecondary'
  | 'contentTertiary'
  | 'contentAccent'
  | 'positivePrimary'
  | 'positiveSecondary'
  | 'negativePrimary'
  | 'negativeSecondary';

export default function TextScreen() {
  const { theme } = useUnistyles();
  const [selectedColor, setSelectedColor] =
    useState<TextColor>('contentPrimary');

  const colors: { key: TextColor; label: string; value: string }[] = [
    {
      key: 'contentPrimary',
      label: 'Primary',
      value: theme.colors.contentPrimary,
    },
    {
      key: 'contentSecondary',
      label: 'Secondary',
      value: theme.colors.contentSecondary,
    },
    {
      key: 'contentTertiary',
      label: 'Tertiary',
      value: theme.colors.contentTertiary,
    },
    {
      key: 'contentAccent',
      label: 'Accent',
      value: theme.colors.contentAccent,
    },
    {
      key: 'positivePrimary',
      label: 'Positive Primary',
      value: theme.colors.positivePrimary,
    },
    {
      key: 'positiveSecondary',
      label: 'Positive Secondary',
      value: theme.colors.positiveSecondary,
    },
    {
      key: 'negativePrimary',
      label: 'Negative Primary',
      value: theme.colors.negativePrimary,
    },
    {
      key: 'negativeSecondary',
      label: 'Negative Secondary',
      value: theme.colors.negativeSecondary,
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Text',
        }}
      />

      {/* Demo Section */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <View style={styles.variantsGroup}>
            <Text variant="heading1" color={selectedColor}>
              Heading 1
            </Text>
            <Text variant="heading2" color={selectedColor}>
              Heading 2
            </Text>
            <Text variant="heading3" color={selectedColor}>
              Heading 3
            </Text>
            <Text variant="body1" color={selectedColor}>
              Body 1
            </Text>
            <Text variant="body2" color={selectedColor}>
              Body 2
            </Text>
            <Text variant="body3" color={selectedColor}>
              Body 3
            </Text>
          </View>
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        <View style={styles.controlSection}>
          <ListItem text="Text Color" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorScrollContent}
          >
            <View style={styles.colorGroup}>
              {colors.map(color => (
                <Pressable
                  key={color.key}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.value },
                    selectedColor === color.key && styles.selectedColorButton,
                  ]}
                  onPress={() => setSelectedColor(color.key)}
                />
              ))}
            </View>
          </ScrollView>
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
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: theme.colors.contentSecondary,
  },
  variantsGroup: {
    gap: theme.spacing.medium,
    alignItems: 'center',
  },
  controlsCard: {
    padding: theme.spacing.large,
  },
  controlSection: {
    gap: theme.spacing.medium,
  },
  colorScrollContent: {
    paddingHorizontal: theme.spacing.small,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorButton: {
    borderColor: theme.colors.contentPrimary,
    borderWidth: 2,
  },
}));
