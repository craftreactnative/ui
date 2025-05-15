import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text/Text';

export const config = {
  avatarSmall: 32,
  avatarMedium: 38,
  avatarLarge: 44,
  avatarIndicatorSmall: 10,
  avatarIndicatorLarge: 12,
};

/**
 * Color of the avatar when the image cannot be loaded.
 */
export type AvatarColor = 0 | 1 | 2 | 3;

/**
 * A component that displays an avatar.
 */
export type Props = {
  /**
   * The URI of the image to display.
   */
  uri?: string;
  /**
   * The fallback initials to display if the image cannot be loaded.
   */
  fallbackInitials?: string;
  /**
   * The fallback color to use if the image cannot be loaded.
   * @default AvatarColor[0]
   */
  fallbackColor?: AvatarColor;
  /**
   * Whether to show an online indicator.
   * @default false
   */
  showOnlineIndicator?: boolean;
  /**
   * The size of the avatar.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
};

export const Avatar = ({
  uri,
  fallbackInitials = '',
  fallbackColor = 0,
  showOnlineIndicator = false,
  size = 'medium',
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const { styles } = useStyles(stylesheet, {
    color: fallbackColor,
    size,
  });

  const avatarIndicatorSize =
    size === 'small'
      ? config.avatarIndicatorSmall
      : config.avatarIndicatorLarge;

  return (
    <View
      style={[
        styles.container,
        (!uri || imageError) && styles.containerFallback,
      ]}
    >
      {uri && !imageError ? (
        <Image
          source={{ uri }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <Text variant="body2" style={styles.text}>
          {fallbackInitials}
        </Text>
      )}
      {showOnlineIndicator && (
        <View
          style={[
            styles.indicator,
            { width: avatarIndicatorSize, height: avatarIndicatorSize },
          ]}
        />
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(({ borderRadius, colors, spacing }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    variants: {
      size: {
        small: {
          width: config.avatarSmall,
          height: config.avatarSmall,
          borderRadius: borderRadius.small,
        },
        medium: {
          width: config.avatarMedium,
          height: config.avatarMedium,
          borderRadius: borderRadius.medium,
        },
        large: {
          width: config.avatarLarge,
          height: config.avatarLarge,
          borderRadius: borderRadius.medium,
        },
      },
    },
  },
  containerFallback: {
    variants: {
      color: {
        0: {
          backgroundColor: colors.wineStrong,
        },
        1: {
          backgroundColor: colors.berryStrong,
        },
        2: {
          backgroundColor: colors.darkOliveStrong,
        },
        3: {
          backgroundColor: colors.imperialBlueStrong,
        },
      },
    },
  },
  image: {
    borderRadius: borderRadius.medium,
    width: '100%',
    height: '100%',
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: -spacing.xsmall,
    right: -spacing.xsmall,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.positivePrimary,
  },
}));
