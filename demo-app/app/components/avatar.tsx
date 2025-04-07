import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const AVATAR_URL1 = 'https://i.pravatar.cc/300?img=5';
const AVATAR_URL2 = 'https://i.pravatar.cc/300?img=8';
const AVATAR_URL3 = 'https://i.pravatar.cc/300?img=26';

export default function AvatarScreen() {
  const { styles } = useStyles(stylesheet);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Avatar',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Sizes
        </Text>
        <Card style={styles.componentContainer}>
          <Avatar uri={AVATAR_URL1} size="small" />
          <Avatar uri={AVATAR_URL2} size="medium" />
          <Avatar uri={AVATAR_URL3} size="large" />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Online indicator
        </Text>
        <Card style={styles.componentContainer}>
          <Avatar uri={AVATAR_URL1} size="small" showOnlineIndicator />
          <Avatar uri={AVATAR_URL2} size="medium" showOnlineIndicator />
          <Avatar uri={AVATAR_URL3} size="large" showOnlineIndicator />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Fallback initial
        </Text>
        <Card style={styles.componentContainer}>
          <Avatar uri="https://404" size="medium" fallbackInitials="AL" />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Fallback colors
        </Text>
        <Card style={styles.componentContainer}>
          <Avatar
            uri="https://404"
            size="medium"
            fallbackInitials="F"
            fallbackColor={0}
          />
          <Avatar
            uri="https://404"
            size="medium"
            fallbackInitials="CM"
            fallbackColor={1}
          />
          <Avatar
            uri="https://404"
            size="medium"
            fallbackInitials="H"
            fallbackColor={2}
          />
          <Avatar
            uri="https://404"
            size="medium"
            fallbackInitials="TP"
            fallbackColor={3}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
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
    flexDirection: 'row',
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
  },
}));
