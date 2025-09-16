import { StyleSheet } from 'react-native-unistyles';
import { darkTheme, lightTheme } from './config';

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    initialTheme: 'light',
  },
});
