import { useTheme } from '@/contexts/ThemeContext';
import {
  ButtonRound,
  type Props as ButtonRoundProps,
} from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import {
  ContextMenu,
  ContextMenuElement,
} from '@/craftrn-ui/components/ContextMenu/ContextMenu';
import { MoonIcon } from '@/icons/MoonIcon';
import { SunIcon } from '@/icons/SunIcon';
import { Brush } from '@/tetrisly-icons/Brush';
import { CheckLarge } from '@/tetrisly-icons/CheckLarge';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type ThemeToggleButtonProps = {
  variant?: ButtonRoundProps['variant'];
};

const ColorCircle = ({ color }: { color: string }) => (
  <View style={[styles.colorCircle, { backgroundColor: color }]} />
);

export const ThemeToggleButton = ({
  variant = 'neutral',
}: ThemeToggleButtonProps) => {
  const { setMode, setColor, mode, color } = useTheme();
  const { theme } = useUnistyles();

  const menuItems: ContextMenuElement[] = useMemo(
    () => [
      {
        id: 'light',
        label: 'Light',
        itemLeft: <SunIcon color={theme.colors.contentPrimary} size={20} />,
        itemRight:
          mode === 'light' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setMode('light'),
      },
      {
        id: 'dark',
        label: 'Dark',
        itemLeft: <MoonIcon color={theme.colors.contentPrimary} size={20} />,
        itemRight:
          mode === 'dark' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setMode('dark'),
      },
      {
        type: 'divider',
        id: 'divider-1',
      },
      {
        id: 'teal',
        label: 'Teal',
        itemLeft: <ColorCircle color="#1e809e" />,
        itemRight:
          color === 'teal' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setColor('teal'),
      },
      {
        id: 'orange',
        label: 'Orange',
        itemLeft: <ColorCircle color="#9e661e" />,
        itemRight:
          color === 'orange' ? (
            <CheckLarge color={theme.colors.contentPrimary} size={20} />
          ) : undefined,
        onPress: () => setColor('orange'),
      },
    ],
    [theme, setMode, setColor, mode, color],
  );

  return (
    <ContextMenu
      items={menuItems}
      menuAnchorPosition="bottom-right"
      trigger={onPress => (
        <ButtonRound
          onPress={onPress}
          accessibilityLabel="Change theme"
          animationConfig={{ scaleIn: 1.1 }}
          variant={variant}
          renderContent={({ iconSize, iconColor }) => (
            <Brush size={iconSize} color={iconColor} />
          )}
        />
      )}
    />
  );
};

const styles = StyleSheet.create(theme => ({
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.full,
  },
}));
