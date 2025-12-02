import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { CheckLarge } from '@/tetrisly-icons/CheckLarge';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';
import { Divider } from '../../craftrn-ui/components/Divider';

const AVATAR_URL = 'https://i.pravatar.cc/300?img=36';

type AvatarSize = 'small' | 'medium' | 'large';
type AvatarColor = 0 | 1 | 2 | 3;

export default function AvatarScreen() {
  const { theme } = useUnistyles();
  const [size, setSize] = useState<AvatarSize>('medium');
  const [showOnlineIndicator, setShowOnlineIndicator] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackColor, setFallbackColor] = useState<AvatarColor>(0);

  const sizes: AvatarSize[] = ['small', 'medium', 'large'];
  const fallbackColors: AvatarColor[] = [0, 1, 2, 3];
  const themeColors = [
    theme.colors.purple,
    theme.colors.maroon,
    theme.colors.forest,
    theme.colors.steel,
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Avatar',
        }}
      />

      {/* Demo Avatar */}
      <View style={styles.demoSection}>
        <Card style={styles.demoContainer}>
          <Avatar
            source={useFallback ? undefined : { uri: AVATAR_URL }}
            size={size}
            showOnlineIndicator={showOnlineIndicator}
            fallbackInitials="AB"
            fallbackColor={fallbackColor}
          />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Size Selector */}
        <View style={styles.controlSection}>
          <ListItem text="Size" />
          <View style={styles.toggleGroup}>
            {sizes.map(s => (
              <Button
                key={s}
                size="small"
                variant={size === s ? 'secondary' : 'neutral'}
                onPress={() => setSize(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Toggle Controls */}
        <View style={styles.listSection}>
          <ListItem
            text="Online Indicator"
            textBelow="Show green dot when user is online"
            itemRight={
              <Switch
                value={showOnlineIndicator}
                onValueChange={setShowOnlineIndicator}
              />
            }
            divider
          />
          <ListItem
            text="Fallback Mode"
            textBelow="Show initials instead of image"
            itemRight={
              <Switch value={useFallback} onValueChange={setUseFallback} />
            }
            divider={useFallback}
          />
        </View>

        {/* Fallback Color (only shown when in fallback mode) */}
        {useFallback && (
          <Animated.View entering={FadeIn.duration(300)}>
            <ListItem
              text="Fallback color"
              itemRight={
                <View style={styles.colorGroup}>
                  {fallbackColors.map((color, index) => (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorButton,
                        {
                          backgroundColor: themeColors[index],
                        },
                      ]}
                      onPress={() => setFallbackColor(color)}
                    >
                      {fallbackColor === color && (
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
              }
            />
          </Animated.View>
        )}
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
  listSection: {
    gap: theme.spacing.medium,
    overflow: 'hidden',
  },
  divider: {
    marginVertical: theme.spacing.xsmall,
  },
}));
