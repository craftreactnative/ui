import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { PhotoCarousel } from '@/craftrn-ui/components/PhotoCarousel';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

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

type DotsPosition = 'top' | 'bottom';

export default function PhotoCarouselScreen() {
  const [dotsPosition, setDotsPosition] = useState<DotsPosition>('bottom');

  const positions: DotsPosition[] = ['top', 'bottom'];

  const handlePositionChange = useCallback((position: DotsPosition) => {
    setDotsPosition(position);
  }, []);

  const getDotsStyle = () => {
    return dotsPosition === 'top' ? { top: 10 } : undefined;
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'PhotoCarousel',
        }}
      />

      {/* Demo PhotoCarousel */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <PhotoCarousel photos={photos} dotsStyle={getDotsStyle()} />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        <View style={styles.controlSection}>
          <ListItem text="Dots Position" />
          <View style={styles.toggleGroup}>
            {positions.map(position => (
              <Button
                key={position}
                size="small"
                variant={dotsPosition === position ? 'secondary' : 'neutral'}
                onPress={() => handlePositionChange(position)}
              >
                {position.charAt(0).toUpperCase() + position.slice(1)}
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
    padding: theme.spacing.medium,
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.small,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
  scrollView: {
    flex: 1,
  },
}));
