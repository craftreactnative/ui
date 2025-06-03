import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { AnimatedDot } from './AnimatedDot';

const config = {
  carouselHeight: 200,
};

type Photo = {
  id: string;
  uri: string;
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
  const { styles } = useStyles(stylesheet);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<Photo>>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderPhoto = ({ item }: { item: Photo }) => (
    <View onMoveShouldSetResponder={() => true}>
      {/* Using a library like react-native-fast-image can prevent the image from being refetched */}
      <Image
        source={{ uri: item.uri }}
        width={carouselWidth}
        height={carouselHeight}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View
      style={styles.container}
      onLayout={event => setCarouselWidth(event.nativeEvent.layout.width)}
    >
      {carouselWidth > 0 && (
        <View style={styles.carouselContainer(carouselWidth, carouselHeight)}>
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
          />
          <View style={[styles.dotsContainer, StyleSheet.flatten(dotsStyle)]}>
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

const stylesheet = createStyleSheet(({ spacing }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  carouselContainer: (width: number, height: number) => ({
    width,
    height,
    overflow: 'hidden',
  }),
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.medium,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xsmall,
  },
}));
