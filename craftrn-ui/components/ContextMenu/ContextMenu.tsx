import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
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
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';
import { Divider } from '../Divider';
import { ListItem } from '../ListItem';

const animationConfig = {
  enter: {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
    overshootClamping: false,
  },
  exit: {
    duration: 150,
  },
};

export type ContextMenuItem = {
  type?: 'item';
  id: string;
  label: string;
  subtitle?: string;
  itemLeft?: ReactElement;
  itemRight?: ReactElement;
  onPress: () => void;
};

export type ContextMenuDivider = {
  type: 'divider';
  id: string;
};

export type ContextMenuElement = ContextMenuItem | ContextMenuDivider;

export type MenuAnchorPosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

type HorizontalAlignment = 'left' | 'center' | 'right';

export type ContextMenuProps = {
  items: ContextMenuElement[];
  trigger: (onPress: () => void) => ReactElement;
  menuAnchorPosition?: MenuAnchorPosition;
  offset?: { x: number; y: number };
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
  const [menuSize, setMenuSize] = useState({ height: 0, width: 0 });
  const [hasMenuPositioned, setHasMenuPositioned] = useState(false);
  const triggerRef = useRef<View>(null);

  const animationProgress = useSharedValue(0);

  const screenY = useMemo(() => {
    return Platform.OS === 'android'
      ? triggerPosition.y - UnistylesRuntime.insets.top
      : triggerPosition.y;
  }, [triggerPosition.y]);

  const alignment = useMemo(
    () => menuAnchorPosition.split('-')[1] as HorizontalAlignment,
    [menuAnchorPosition],
  );

  const isMenuOnTop = useMemo(() => {
    const { height } = triggerPosition;
    const screenHeight = Dimensions.get('window').height;
    const spaceAbove = screenY - UnistylesRuntime.insets.top;
    const spaceBelow =
      screenHeight - UnistylesRuntime.insets.bottom - (screenY + height);

    return menuAnchorPosition.startsWith('top-')
      ? spaceAbove >= menuSize.height + offset.y
      : spaceBelow < menuSize.height + offset.y &&
          spaceAbove >= menuSize.height + offset.y;
  }, [triggerPosition, menuAnchorPosition, menuSize.height, offset.y, screenY]);

  const measureTrigger = useCallback(() => {
    triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setTriggerPosition({ x: pageX, y: pageY, width, height });
      setHasMenuPositioned(true);
    });
  }, []);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      animationProgress.value = 0;
      Keyboard.dismiss();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible && isModalVisible) {
      animationProgress.value = withTiming(
        0,
        {
          duration: animationConfig.exit.duration,
          easing: Easing.in(Easing.cubic),
        },
        finished => {
          if (finished) {
            runOnJS(setIsModalVisible)(false);
            runOnJS(setHasMenuPositioned)(false);
          }
        },
      );
    }
  }, [visible, isModalVisible]);

  useEffect(() => {
    if (visible && !hasMenuPositioned) {
      const timer = setTimeout(measureTrigger, 10);
      return () => clearTimeout(timer);
    }
  }, [visible, hasMenuPositioned, measureTrigger]);

  const menuPosition = useMemo(() => {
    const { x, width, height } = triggerPosition;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const top = isMenuOnTop
      ? Math.max(
          screenY - menuSize.height - offset.y,
          UnistylesRuntime.insets.top,
        )
      : Math.min(
          screenY + height + offset.y,
          screenHeight - UnistylesRuntime.insets.bottom - menuSize.height,
        );

    switch (alignment) {
      case 'center':
        return {
          top,
          alignSelf: 'center' as const,
          marginHorizontal: theme.spacing.large,
        };
      case 'left':
        return { top, left: x + offset.x };
      case 'right':
        return { top, right: screenWidth - (x + width) + offset.x };
    }
  }, [
    triggerPosition,
    menuSize,
    offset,
    alignment,
    isMenuOnTop,
    screenY,
    theme.spacing.large,
  ]);

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
    if (visible && hasMenuPositioned && isModalVisible) {
      animationProgress.value = withSpring(1, animationConfig.enter);
    }
  }, [visible, hasMenuPositioned, isModalVisible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationProgress.value, [0, 1], [0, 0.3]),
  }));

  const menuAnimatedStyle = useAnimatedStyle(() => {
    const transformOriginY = isMenuOnTop
      ? menuSize.height / 2
      : -menuSize.height / 2;
    const transformOriginX =
      alignment === 'left'
        ? -menuSize.width / 2
        : alignment === 'right'
          ? menuSize.width / 2
          : 0;

    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [transformOriginX, 0],
    );
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [transformOriginY, 0],
    );
    const scale = interpolate(animationProgress.value, [0, 1], [0.8, 1]);

    return {
      opacity: animationProgress.value,
      transform: [
        { translateX },
        { translateY },
        { scale },
        { translateX: -translateX },
        { translateY: -translateY },
      ],
    };
  });

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
          aria-modal={true}
        >
          <Animated.View
            style={[styles.overlay, overlayAnimatedStyle]}
            aria-hidden={true}
          >
            <Pressable
              style={styles.overlayPressable}
              onPress={onClose}
              aria-hidden={true}
            />
          </Animated.View>
          <Animated.View
            style={[styles.menu, menuPosition, menuAnimatedStyle]}
            onLayout={e => setMenuSize(e.nativeEvent.layout)}
            role="menu"
            aria-label="Context menu"
          >
            {items.map(element =>
              element.type === 'divider' ? (
                <Divider key={element.id} style={styles.sectionDivider} />
              ) : (
                <ListItem
                  key={element.id}
                  text={element.label}
                  textBelow={element.subtitle}
                  itemLeft={element.itemLeft}
                  itemRight={element.itemRight}
                  onPress={() => handleItemPress(element.onPress)}
                  style={styles.menuItem}
                />
              ),
            )}
          </Animated.View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create(theme => ({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.backgroundOverlay,
  },
  overlayPressable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.spacing.medium,
    shadowColor: theme.colors.backgroundNeutral,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
    minWidth: 200,
    paddingVertical: theme.spacing.xsmall,
  },
  menuItem: {
    paddingHorizontal: theme.spacing.small,
    marginHorizontal: theme.spacing.xsmall,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
  },
  sectionDivider: {
    marginVertical: theme.spacing.xsmall,
    marginHorizontal: theme.spacing.medium,
  },
}));
