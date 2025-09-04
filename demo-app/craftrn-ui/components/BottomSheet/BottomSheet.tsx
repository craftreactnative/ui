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
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

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
   */
  children: ReactElement | ReactElement[];
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
   * The visual style variant of the bottom sheet.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /**
   * Whether to show the handle bar at the top of the bottom sheet.
   * @default false
   */
  showHandleBar?: boolean;
};

type BottomSheetProps = Props & AccessibilityProps;

const withTimingConfig = {
  duration: 400,
  easing: Easing.inOut(Easing.cubic),
} satisfies WithTimingConfig;

export const BottomSheet = ({
  visible,
  onRequestClose,
  onClose,
  children,
  maxHeight,
  enableSwipeToClose = false,
  enableOverlayTapToClose = false,
  variant = 'primary',
  showHandleBar = false,
  ...accessibilityProps
}: BottomSheetProps) => {
  const [showModal, setShowModal] = useState(visible);
  const [contentHeight, setContentHeight] = useState<number | undefined>();
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const { height: windowHeight } = useWindowDimensions();
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
    const checkScreenReaderStatus = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };

    checkScreenReaderStatus();
  }, []);

  useEffect(() => {
    if (contentHeight) {
      translateY.value = withTiming(
        visible ? 0 : contentHeight,
        withTimingConfig,
      );
      overlayOpacity.value = withTiming(
        visible ? 0.5 : 0,
        withTimingConfig,
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
          0.5 * (1 - Math.min(newTranslateY / 100, 1)),
          { duration: 50 },
        );
      }
    })
    .onEnd(event => {
      gestureActive.value = false;
      if (event.translationY > 100) {
        translateY.value = withTiming(
          contentHeight ?? windowHeight,
          withTimingConfig,
          () => {
            runOnJS(onRequestClose)();
          },
        );
        overlayOpacity.value = withTiming(0, withTimingConfig);
      } else {
        translateY.value = withTiming(0, withTimingConfig);
        overlayOpacity.value = withTiming(0.5, withTimingConfig);
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
              <View style={styles.content}>
                {showHandleBar && (
                  <View style={styles.handleBarContainer}>
                    <View style={styles.handleBar} />
                  </View>
                )}
                {children}
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create(({ colors, borderRadius, spacing }) => ({
  container: {
    flex: 1,
  },
  overlay: {
    zIndex: 1,
    backgroundColor: colors.overlay,
  },
  overlayContent: {
    flex: 1,
  },
  sheet: ({ maxHeight, backgroundColor }) => ({
    backgroundColor: backgroundColor ?? colors.backgroundPrimary,
    zIndex: 2,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight,
  }),
  content: {
    paddingTop: spacing.large,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: spacing.medium,
    marginTop: -spacing.large,
    paddingTop: spacing.medium,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: colors.contentQuaternary,
    borderRadius: 2,
  },
}));
