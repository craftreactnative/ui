import { Stack, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function TemplateScreen() {
  const local = useLocalSearchParams();
  const { styles } = useStyles(stylesheet);
  const player = useVideoPlayer(
    `https://www.craftreactnative.com/videos/templates/${local.template}.mp4`,
    player => {
      player.loop = true;
      player.play();
    },
  );
  return (
    <>
      <Stack.Screen
        options={{
          title: `Template ${local.template}`,
        }}
      />
      <View style={styles.container}>
        <VideoView style={styles.video} player={player} nativeControls />
      </View>
    </>
  );
}

const stylesheet = createStyleSheet(({ borderRadius, colors, spacing }) => ({
  container: {
    flex: 1,
    marginHorizontal: spacing.large,
    marginVertical: spacing.large,
  },
  video: {
    width: '80%',
    aspectRatio: 9 / 19.5,
    overflow: 'hidden',
    backgroundColor: colors.backgroundPrimary,
    borderRadius: borderRadius.xlarge,
    alignSelf: 'center',
  },
}));
