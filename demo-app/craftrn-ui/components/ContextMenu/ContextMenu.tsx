import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';
import { ListItem } from '../ListItem';

export type ContextMenuItem = {
  id: string;
  label: string;
  subtitle?: string;
  itemLeft?: ReactElement;
  itemRight?: ReactElement;
  onPress: () => void;
};

export type MenuAnchorPosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

type HorizontalAlignment = 'left' | 'center' | 'right';

export type ContextMenuProps = {
  items: ContextMenuItem[];
  trigger: (onPress: () => void) => ReactElement;
  menuAnchorPosition?: MenuAnchorPosition;
  offset?: { x: number; y: number };
};

const config = {
  enterDuration: 200,
  exitDuration: 150,
};

export const ContextMenu = ({
  items,
  trigger,
  menuAnchorPosition = 'bottom-center',
  offset = { x: 0, y: 8 },
}: ContextMenuProps) => {
  const { theme } = useUnistyles();
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [menuHeight, setMenuHeight] = useState(0);
  const [hasMenuPositioned, setHasMenuPositioned] = useState(false);
  const triggerRef = useRef<View>(null);
  const menuRef = useRef<View>(null);

  const animationProgress = useSharedValue(0);

  const overlayOpacity = useDerivedValue(() =>
    interpolate(animationProgress.value, [0, 1], [0, 0.3]),
  );

  const scale = useDerivedValue(() =>
    interpolate(animationProgress.value, [0, 1], [0.8, 1]),
  );

  const hideModal = () => setIsModalVisible(false);

  const measureTrigger = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setTriggerPosition({ x: pageX, y: pageY, width, height });
        setHasMenuPositioned(true);
      });
    }
  }, []);

  useEffect(() => {
    if (visible && !hasMenuPositioned) {
      const timer = setTimeout(() => {
        measureTrigger();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [visible, hasMenuPositioned, measureTrigger]);

  const getMenuPosition = () => {
    const { x, y, width, height } = triggerPosition;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const screenY =
      Platform.OS === 'android' ? y - UnistylesRuntime.insets.top : y;

    const spaceAbove = screenY - UnistylesRuntime.insets.top;
    const spaceBelow =
      screenHeight - UnistylesRuntime.insets.bottom - (screenY + height);

    const preferredIsTop = menuAnchorPosition.startsWith('top-');
    const shouldShowOnTop = preferredIsTop
      ? spaceAbove >= menuHeight + offset.y
      : spaceBelow < menuHeight + offset.y &&
        spaceAbove >= menuHeight + offset.y;

    const top = shouldShowOnTop
      ? Math.max(screenY - menuHeight - offset.y, UnistylesRuntime.insets.top)
      : Math.min(
          screenY + height + offset.y,
          screenHeight - UnistylesRuntime.insets.bottom - menuHeight,
        );

    const baseStyle = {
      top,
    };

    const triggerLeft = x;
    const triggerRight = screenWidth - (x + width);

    const horizontalAlign = menuAnchorPosition.split(
      '-',
    )[1] as HorizontalAlignment;

    switch (horizontalAlign) {
      case 'center':
        return {
          ...baseStyle,
          alignSelf: 'center' as const,
          marginHorizontal: theme.spacing.large,
        };

      case 'left':
        return {
          ...baseStyle,
          left: triggerLeft + offset.x,
        };

      case 'right':
        return {
          ...baseStyle,
          right: triggerRight + offset.x,
        };

      default:
        return {
          ...baseStyle,
          left: theme.spacing.large,
          right: theme.spacing.large,
        };
    }
  };

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const onOpen = useCallback(() => {
    setVisible(true);
  }, []);

  const handleItemPress = useCallback(
    (itemOnPress: () => void) => {
      itemOnPress();
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (visible) {
      setHasMenuPositioned(false);
      setIsModalVisible(true);
      animationProgress.value = 0;
      Keyboard.dismiss();
    } else if (isModalVisible) {
      animationProgress.value = withTiming(
        0,
        {
          duration: config.exitDuration,
          easing: Easing.in(Easing.cubic),
        },
        finished => {
          if (finished) {
            runOnJS(hideModal)();
          }
        },
      );
    }
  }, [visible, isModalVisible, animationProgress]);

  useEffect(() => {
    if (visible && hasMenuPositioned && isModalVisible) {
      animationProgress.value = withTiming(1, {
        duration: config.enterDuration,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [visible, hasMenuPositioned, isModalVisible, animationProgress]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animationProgress.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        {trigger(onOpen)}
      </View>
      {isModalVisible && (
        <Modal
          transparent
          visible
          animationType="none"
          onRequestClose={onClose}
        >
          <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
            <Pressable style={styles.overlayPressable} onPress={onClose} />
          </Animated.View>
          <Animated.View
            ref={menuRef}
            style={[styles.menu, getMenuPosition(), menuAnimatedStyle]}
            onLayout={event => {
              const { height } = event.nativeEvent.layout;
              setMenuHeight(height);
            }}
          >
            {items.map((item, index) => (
              <ListItem
                key={item.id}
                text={item.label}
                textBelow={item.subtitle}
                itemLeft={item.itemLeft}
                itemRight={item.itemRight}
                onPress={() => handleItemPress(item.onPress)}
                divider={index !== items.length - 1}
                style={styles.menuItem}
              />
            ))}
          </Animated.View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create(({ colors, spacing }) => ({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  overlayPressable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.backgroundPrimary,
    borderRadius: spacing.medium,
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
    minWidth: 200,
  },
  menuItem: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
}));
