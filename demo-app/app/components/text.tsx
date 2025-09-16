import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function TextScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Text',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Variants
        </Text>
        <Card style={styles.componentContainer}>
          <Text variant="heading1">Heading 1</Text>
          <Text variant="heading2">Heading 2</Text>
          <Text variant="heading3">Heading 3</Text>
          <Text variant="body1">Body 1</Text>
          <Text variant="body2">Body 2</Text>
          <Text variant="body3">Body 3</Text>
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Colors
        </Text>
        <Card style={styles.componentContainer}>
          <Text variant="body1" color="contentPrimary">
            Content Primary
          </Text>
          <Text variant="body1" color="contentSecondary">
            Content Secondary
          </Text>
          <Text variant="body1" color="contentTertiary">
            Content Tertiary
          </Text>
          <Text variant="body1" color="contentAccent">
            Content Accent
          </Text>
          <Text variant="body1" color="positivePrimary">
            Content Positive Primary
          </Text>
          <Text variant="body1" color="positiveSecondary">
            Content Positive Secondary
          </Text>
          <Text variant="body1" color="negativePrimary">
            Content Negative Primary
          </Text>
          <Text variant="body1" color="negativeSecondary">
            Content Negative Secondary
          </Text>
        </Card>
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
    gap: theme.spacing.medium,
    padding: theme.spacing.medium,
  },
}));
