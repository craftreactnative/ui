import { Card } from '@/craftrn-ui/components/Card';
import { PhotoCarousel } from '@/craftrn-ui/components/PhotoCarousel';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const photos = [
  {
    id: '1',
    uri: 'https://picsum.photos/id/107/600/800',
  },
  {
    id: '2',
    uri: 'https://picsum.photos/id/127/600/800',
  },
  {
    id: '3',
    uri: 'https://picsum.photos/id/122/600/800',
  },
  {
    id: '4',
    uri: 'https://picsum.photos/id/116/600/800',
  },
];

export default function PhotoCarouselScreen() {
  const { theme } = useUnistyles();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'PhotoCarousel',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <PhotoCarousel photos={photos} />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With custom dots positioning
        </Text>
        <Card style={styles.componentContainer}>
          <PhotoCarousel photos={photos} dotsStyle={{ top: 10 }} />
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
    padding: theme.spacing.medium,
  },
}));
