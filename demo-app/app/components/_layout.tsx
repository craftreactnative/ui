import { NavigationBackButton } from '@/components/NavigationBackButton/NavigationBackButton';
import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';
import { ThemeToggleButton } from '../../components/ThemeToggleButton/ThemeToggleButton';

export default function ComponentsLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        contentStyle: { backgroundColor: theme.colors.backgroundScreen },
        headerStyle: { backgroundColor: theme.colors.backgroundScreen },
        headerTintColor: theme.colors.contentPrimary,
        headerShadowVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <NavigationBackButton
              onPress={navigation.goBack}
              variant="neutral-secondary"
            />
          ) : undefined,
        headerRight: () => <ThemeToggleButton variant="neutral-secondary" />,
      })}
    />
  );
}
