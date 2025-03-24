import CraftRNLogoDark from '@/assets/images/craftrn-dark.png';
import CraftRNLogoLight from '@/assets/images/craftrn-light.png';
import { Text } from '@/craftrn-ui/components/Text/Text';
import type { PropsWithChildren } from 'react';
import { Image, useColorScheme, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const HEADER_HEIGHT = 200;

type Props = PropsWithChildren<{
  title: string;
}>;

export default function ParallaxScrollView({ children, title }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const colorScheme = useColorScheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ bottom: 0 }}
      contentContainerStyle={{ paddingBottom: 0 }}
    >
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: theme.colors.backgroundPrimary },
          headerAnimatedStyle,
        ]}
      >
        <View style={styles.parallaxHeader}>
          <Image
            source={
              colorScheme === 'light' ? CraftRNLogoLight : CraftRNLogoDark
            }
            style={styles.headerLogo}
          />
          <Text variant="heading1">{title}</Text>
        </View>
      </Animated.View>
      {children}
    </Animated.ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  parallaxHeader: {
    bottom: theme.spacing.large,
    paddingHorizontal: theme.spacing.horizontalScreen,
    position: 'absolute',
    width: '100%',
  },
  headerLogo: {
    height: 100,
    width: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
}));
