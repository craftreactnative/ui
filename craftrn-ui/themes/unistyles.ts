import { StyleSheet } from 'react-native-unistyles';
import {
  darkOrangeTheme,
  darkTealTheme,
  lightOrangeTheme,
  lightTealTheme,
} from './config';

type AppThemes = {
  lightTeal: typeof lightTealTheme;
  darkTeal: typeof darkTealTheme;
  lightOrange: typeof lightOrangeTheme;
  darkOrange: typeof darkOrangeTheme;
};

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    lightTeal: lightTealTheme,
    darkTeal: darkTealTheme,
    lightOrange: lightOrangeTheme,
    darkOrange: darkOrangeTheme,
  },
  settings: {
    initialTheme: 'lightTeal',
  },
});

