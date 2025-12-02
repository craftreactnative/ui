import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

type ThemeColor = 'teal' | 'orange';
type ThemeMode = 'light' | 'dark';
type ThemeName = NonNullable<typeof UnistylesRuntime.themeName>;

interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  setColor: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const getThemeName = (mode: ThemeMode, color: ThemeColor): ThemeName => {
  const themeMap: Record<ThemeMode, Record<ThemeColor, ThemeName>> = {
    light: {
      teal: 'lightTeal',
      orange: 'lightOrange',
    },
    dark: {
      teal: 'darkTeal',
      orange: 'darkOrange',
    },
  };
  return themeMap[mode][color];
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [color, setColorState] = useState<ThemeColor>('teal');

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    const newThemeName = getThemeName(newMode, color);
    UnistylesRuntime.setTheme(newThemeName);
    Appearance.setColorScheme(newMode);
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    const newThemeName = getThemeName(mode, newColor);
    UnistylesRuntime.setTheme(newThemeName);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{ color, mode, setColor, setMode, toggleMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
