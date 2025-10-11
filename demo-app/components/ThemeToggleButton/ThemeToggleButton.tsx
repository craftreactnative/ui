import { useTheme } from '@/contexts/ThemeContext';
import type { Props as ButtonRoundProps } from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { ButtonRound } from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { MoonIcon } from '@/icons/MoonIcon';
import { SunIcon } from '@/icons/SunIcon';
import React from 'react';

type ThemeToggleButtonProps = {
  intent?: ButtonRoundProps['intent'];
};

export const ThemeToggleButton = ({
  intent = 'primary',
}: ThemeToggleButtonProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ButtonRound
      intent={intent}
      onPress={toggleTheme}
      accessibilityLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      accessibilityRole="button"
      renderContent={({ iconSize, iconColor }) =>
        theme === 'light' ? (
          <MoonIcon size={iconSize} color={iconColor} />
        ) : (
          <SunIcon size={iconSize} color={iconColor} />
        )
      }
    />
  );
};
