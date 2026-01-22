import { Stack, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function TemplateScreen() {
  const local = useLocalSearchParams();
  // Handle catch-all route: template is always an array with catch-all [...template]
  const templateName = Array.isArray(local.template)
    ? local.template[0]
    : (local.template as string);
  const player = useVideoPlayer(
    `https://www.craftreactnative.com/videos/templates/${templateName}.mp4`,
    player => {
      player.loop = true;
      player.play();
    },
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: `Template ${templateName}`,
        }}
      />
      <View style={styles.container}>
        <VideoView style={styles.video} player={player} nativeControls />
      </View>
    </>
  );
}

const styles = StyleSheet.create(({ borderRadius, colors, spacing }) => ({
  container: {
    flex: 1,
    marginHorizontal: spacing.large,
    marginVertical: spacing.large,
  },
  video: {
    width: '80%',
    aspectRatio: 9 / 19.5,
    overflow: 'hidden',
    backgroundColor: colors.backgroundScreen,
    borderRadius: borderRadius.xlarge,
    alignSelf: 'center',
  },
}));
