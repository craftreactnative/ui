import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  AccessibilityProps,
  LayoutChangeEvent,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const animationConfig = {
  sheetOpen: {
    damping: 20,
    stiffness: 220,
    mass: 0.8,
    overshootClamping: false,
  } satisfies WithSpringConfig,
  sheetClose: {
    duration: 400,
    easing: Easing.inOut(Easing.cubic),
  } satisfies WithTimingConfig,
  swipeToDismiss: {
    velocity: 0,
    damping: 100,
    stiffness: 500,
    mass: 0.5,
    overshootClamping: true,
  } satisfies WithSpringConfig,
  overlayDrag: {
    duration: 50,
    easing: Easing.inOut(Easing.cubic),
  } satisfies WithTimingConfig,
  overlayFadeOut: {
    duration: 200,
    easing: Easing.inOut(Easing.cubic),
  } satisfies WithTimingConfig,
};

/**
 * Props for the BottomSheet component.
 * @see AccessibilityProps
 */
export type Props = {
  /**
   * Whether the bottom sheet is visible.
   */
  visible: boolean;
  /**
   * Callback function to handle the request to close the bottom sheet.
   */
  onRequestClose: () => void;
  /**
   * Callback function triggered when the bottom sheet is fully closed.
   */
  onClose?: () => void;
  /**
   * The content to display inside the bottom sheet.
   * Must be a single React element.
   */
  children: ReactElement;
  /**
   * The maximum height of the bottom sheet.
   */
  maxHeight?: number;
  /**
   * Whether to enable swipe-to-close gesture.
   * @default false
   */
  enableSwipeToClose?: boolean;
  /**
   * Whether to enable tap on overlay to close the bottom sheet.
   * @default false
   */
  enableOverlayTapToClose?: boolean;
  /**
   * Whether to show the handle bar at the top of the bottom sheet.
   * @default false
   */
  showHandleBar?: boolean;
};

type BottomSheetProps = Props & AccessibilityProps;

export const BottomSheet = ({
  visible,
  onRequestClose,
  onClose,
  children,
  maxHeight,
  enableSwipeToClose = false,
  enableOverlayTapToClose = false,
  showHandleBar = false,
  ...accessibilityProps
}: BottomSheetProps) => {
  const [showModal, setShowModal] = useState(visible);
  const [contentHeight, setContentHeight] = useState<number | undefined>();
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const { height: windowHeight } = useWindowDimensions();
  const { theme } = useUnistyles();
  const translateY = useSharedValue(windowHeight);
  const overlayOpacity = useSharedValue(0);
  const startY = useSharedValue(0);
  const gestureActive = useSharedValue(false);
  const bottomSheetMaxHeight = useMemo(
    () => Math.max(maxHeight ?? 0, windowHeight),
    [maxHeight, windowHeight],
  );

  useEffect(() => {
    if (visible) {
      setShowModal(true);
    }
  }, [visible]);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(enabled => {
      setIsScreenReaderEnabled(enabled);
    });
  }, []);

  useEffect(() => {
    if (contentHeight) {
      translateY.value = visible
        ? withSpring(0, animationConfig.sheetOpen)
        : withTiming(contentHeight, animationConfig.sheetClose);
      overlayOpacity.value = withTiming(
        visible ? 0.5 : 0,
        visible ? animationConfig.sheetClose : animationConfig.sheetClose,
        () => {
          if (!visible) {
            runOnJS(setShowModal)(false);
            runOnJS(setContentHeight)(undefined);
            if (onClose) {
              runOnJS(onClose)();
            }
          }
        },
      );
    }
  }, [visible, translateY, overlayOpacity, contentHeight, onClose]);

  const closeGestureThreshold = useMemo(() => {
    const currentContentHeight = contentHeight ?? 100;
    return Math.max(50, Math.min(100, currentContentHeight * 0.3));
  }, [contentHeight]);

  const gesture = Gesture.Pan()
    .enabled(enableSwipeToClose && !isScreenReaderEnabled)
    .onStart(() => {
      startY.value = translateY.value;
      gestureActive.value = true;
    })
    .onUpdate(event => {
      const newTranslateY = startY.value + event.translationY;
      if (newTranslateY >= 0) {
        translateY.value = newTranslateY;
        overlayOpacity.value = withTiming(
          0.5 * (1 - Math.min(newTranslateY / (contentHeight ?? 200), 1)),
          animationConfig.overlayDrag,
        );
      }
    })
    .onEnd(event => {
      gestureActive.value = false;

      // Check if should close by velocity or distance
      const shouldClose =
        event.velocityY > 500 || event.translationY > closeGestureThreshold;

      if (shouldClose) {
        // Use spring with high damping to avoid bounce, but respect velocity
        translateY.value = withSpring(
          contentHeight ?? windowHeight,
          {
            ...animationConfig.swipeToDismiss,
            velocity: event.velocityY,
          },
          () => {
            runOnJS(onRequestClose)();
          },
        );
        overlayOpacity.value = withTiming(0, animationConfig.overlayFadeOut);
      } else {
        // Snap back to open position
        translateY.value = withTiming(0, animationConfig.sheetClose);
        overlayOpacity.value = withTiming(0.5, animationConfig.sheetClose);
      }
    });

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (!contentHeight) {
        translateY.value = height;
        setContentHeight(height);
      }
    },
    [contentHeight, translateY],
  );

  return (
    <Modal
      accessible={false}
      transparent={true}
      visible={showModal}
      onRequestClose={onRequestClose}
      animationType="none"
    >
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.overlay,
                StyleSheet.absoluteFillObject,
                overlayAnimatedStyle,
              ]}
            >
              <TouchableWithoutFeedback
                onPress={enableOverlayTapToClose ? onRequestClose : undefined}
              >
                <View style={styles.overlayContent} />
              </TouchableWithoutFeedback>
            </Animated.View>
            <Animated.View
              style={[
                styles.sheet({
                  maxHeight: bottomSheetMaxHeight,
                }),
                bottomSheetAnimatedStyle,
              ]}
              onLayout={handleLayout}
              role="dialog"
              accessible
              accessibilityLiveRegion="polite"
              accessibilityViewIsModal
              onAccessibilityEscape={onRequestClose}
              {...accessibilityProps}
            >
              <View style={styles.contentWrapper}>
                {showHandleBar && (
                  <View style={styles.handleBarContainer}>
                    <View style={styles.handleBar} />
                  </View>
                )}
                {React.isValidElement(children)
                  ? React.cloneElement(children, {
                      style: [
                        (
                          children.props as unknown as {
                            style?: unknown;
                          }
                        ).style,
                        {
                          paddingTop: showHandleBar
                            ? theme.spacing.xlarge
                            : theme.spacing.large,
                        },
                      ],
                    } as Partial<unknown>)
                  : children}
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
  },
  overlay: {
    zIndex: 1,
    backgroundColor: theme.colors.backgroundOverlay,
  },
  overlayContent: {
    flex: 1,
  },
  sheet: ({ maxHeight }: { maxHeight: number }) => ({
    backgroundColor: theme.colors.backgroundElevated,
    zIndex: 2,
    borderTopLeftRadius: theme.borderRadius.xlarge,
    borderTopRightRadius: theme.borderRadius.xlarge,
    position: 'absolute',
    bottom: -50,
    left: theme.spacing.small,
    right: theme.spacing.small,
    maxHeight,
    overflow: 'hidden',
  }),
  contentWrapper: {
    paddingBottom: 50,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: theme.colors.interactiveNeutral,
    borderRadius: theme.borderRadius.full,
  },
}));
