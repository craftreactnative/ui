import React, { useRef, useState } from 'react';
import { Image, View, ViewProps, StyleSheet as RNStyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AnimatedDot } from './AnimatedDot';

const config = {
  carouselHeight: 200,
};

type Photo = {
  id: string;
  uri: string;
  alt?: string;
};

/**
 * Props for the PhotoCarousel component.
 */
export type Props = {
  /**
   * Array of photos to display in the carousel.
   */
  photos: Photo[];
  /**
   * Height of the carousel.
   * @default 200
   */
  carouselHeight?: number;
  /**
   * Style for the dots. Can be used to reposition the dots.
   */
  dotsStyle?: ViewProps['style'];
};

export const PhotoCarousel = ({
  photos,
  carouselHeight = config.carouselHeight,
  dotsStyle = {},
}: Props): React.ReactElement => {
  const { theme } = useUnistyles();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<Photo>>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateCurrentIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / carouselWidth);
      runOnJS(updateCurrentIndex)(index);
    },
  });

  const scrollToIndex = (index: number) => {
    if (flatListRef.current && index >= 0 && index < photos.length) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      runOnJS(updateCurrentIndex)(index);
    }
  };

  const onAccessibilityAction = (event: any) => {
    switch (event.nativeEvent.actionName) {
      case 'increment':
        if (currentIndex < photos.length - 1) {
          scrollToIndex(currentIndex + 1);
        }
        break;
      case 'decrement':
        if (currentIndex > 0) {
          scrollToIndex(currentIndex - 1);
        }
        break;
    }
  };

  const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
    <View onMoveShouldSetResponder={() => true}>
      <Image
        source={{ uri: item.uri }}
        width={carouselWidth}
        height={carouselHeight}
        resizeMode="cover"
        accessibilityLabel={
          item.alt || `Photo ${index + 1} of ${photos.length}`
        }
        alt={item.alt}
        accessible={true}
      />
    </View>
  );

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
      onLayout={event => setCarouselWidth(event.nativeEvent.layout.width)}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Photo carousel, showing photo ${currentIndex + 1} of ${photos.length}. ${photos[currentIndex]?.alt || ''}`}
      accessibilityActions={[
        { name: 'increment', label: 'Next photo' },
        { name: 'decrement', label: 'Previous photo' },
      ]}
      onAccessibilityAction={onAccessibilityAction}
    >
      {carouselWidth > 0 && (
        <View style={{
          width: carouselWidth,
          height: carouselHeight,
          overflow: 'hidden',
        }}>
          <Animated.FlatList
            ref={flatListRef}
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          />
          <View
            style={[{
              position: 'absolute',
              bottom: theme.spacing.medium,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: theme.spacing.xsmall,
            }, RNStyleSheet.flatten(dotsStyle)]}
            accessible={false}
          >
            {photos.map((_, index) => (
              <AnimatedDot
                key={index}
                index={index}
                scrollX={scrollX}
                carouselWidth={carouselWidth}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};


