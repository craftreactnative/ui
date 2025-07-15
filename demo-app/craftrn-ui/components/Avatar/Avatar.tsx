import React, { useState } from 'react';
import {
  AccessibilityProps,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text';

export const config = {
  small: {
    avatarSize: 32,
    indicatorSize: 10,
  },
  medium: {
    avatarSize: 38,
    indicatorSize: 10,
  },
  large: {
    avatarSize: 44,
    indicatorSize: 12,
  },
};

/**
 * Color of the avatar when the image cannot be loaded.
 */
export type AvatarColor = 0 | 1 | 2 | 3;

/**
 * A component that displays an avatar.
 * @see AccessibilityProps
 */
export type Props = {
  /**
   * The source of the image to display.
   */
  source?: ImageSourcePropType;
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
  /**
   * Alternative text for the image.
   */
  alt?: string;
};

type AvatarProps = Props & AccessibilityProps;

export const Avatar = ({
  source,
  fallbackInitials = '',
  fallbackColor = 0,
  showOnlineIndicator = false,
  size = 'medium',
  alt,
  ...accessibilityProps
}: AvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { styles } = useStyles(stylesheet, {
    color: fallbackColor,
    size,
  });

  const avatarIndicatorSize = config[size].indicatorSize;

  return (
    <View
      style={[
        styles.container,
        (!source || !imageLoaded) && styles.containerFallback,
      ]}
      accessible
      accessibilityHint={showOnlineIndicator ? 'online' : undefined}
      {...accessibilityProps}
    >
      <View style={styles.fallbackContainer}>
        {(!source || !imageLoaded) && (
          <Text variant="body2" style={styles.text}>
            {fallbackInitials}
          </Text>
        )}
        {source && (
          <Image
            source={source}
            style={[styles.image, { opacity: imageLoaded ? 1 : 0 }]}
            onLoad={() => setImageLoaded(true)}
            alt={alt}
          />
        )}
      </View>
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
          width: config.small.avatarSize,
          height: config.small.avatarSize,
          borderRadius: borderRadius.small,
        },
        medium: {
          width: config.medium.avatarSize,
          height: config.medium.avatarSize,
          borderRadius: borderRadius.medium,
        },
        large: {
          width: config.large.avatarSize,
          height: config.large.avatarSize,
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
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    borderRadius: borderRadius.medium,
    width: '100%',
    height: '100%',
    position: 'absolute',
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
