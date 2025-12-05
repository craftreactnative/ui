import React, { useState } from 'react';
import {
  AccessibilityProps,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '../Text';

/**
 * Color of the avatar when the image cannot be loaded.
 */
export type AvatarColor = 0 | 1 | 2 | 3;

/**
 * Text variant mapping based on avatar size
 */
const textVariantBySize = {
  small: 'body3',
  medium: 'body2',
  large: 'body1',
} as const;

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

  const hasValidSource =
    source &&
    (typeof source === 'number' ||
      !('uri' in source) ||
      (source.uri && source.uri.trim() !== ''));

  return (
    <View
      style={[
        styles.container({ size }),
        (!hasValidSource || !imageLoaded) &&
          styles.containerColor({ color: fallbackColor }),
      ]}
      accessible
      accessibilityHint={showOnlineIndicator ? 'online' : undefined}
      {...accessibilityProps}
    >
      <View style={styles.fallbackContainer}>
        {(!hasValidSource || !imageLoaded) && (
          <Text variant={textVariantBySize[size]} style={styles.text}>
            {fallbackInitials}
          </Text>
        )}
        {hasValidSource && (
          <Image
            source={source}
            style={[styles.image, { opacity: imageLoaded ? 1 : 0 }]}
            onLoad={() => setImageLoaded(true)}
            alt={alt}
          />
        )}
      </View>
      {showOnlineIndicator && <View style={[styles.indicator({ size })]} />}
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: (params: { size: 'small' | 'medium' | 'large' }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(params.size === 'small' && {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.full,
    }),
    ...(params.size === 'medium' && {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.full,
    }),
    ...(params.size === 'large' && {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
    }),
  }),
  containerColor: (params: { color: AvatarColor }) => ({
    ...(params.color === 0 && {
      backgroundColor: theme.colors.purple,
    }),
    ...(params.color === 1 && {
      backgroundColor: theme.colors.maroon,
    }),
    ...(params.color === 2 && {
      backgroundColor: theme.colors.forest,
    }),
    ...(params.color === 3 && {
      backgroundColor: theme.colors.steel,
    }),
  }),
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    borderRadius: theme.borderRadius.full,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  text: {
    color: theme.colors.baseLight,
    fontWeight: 'bold',
  },
  indicator: (params: { size: 'small' | 'medium' | 'large' }) => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.baseLight,
    backgroundColor: theme.colors.sentimentPositive,
    ...(params.size === 'small' && {
      width: 10,
      height: 10,
    }),
    ...(params.size === 'medium' && {
      width: 12,
      height: 12,
    }),
    ...(params.size === 'large' && {
      width: 14,
      height: 14,
    }),
  }),
}));
