import { NavigationBackButton } from '@/components/NavigationBackButton/NavigationBackButton';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function ComponentsLayout() {
  const { theme } = useStyles();

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        contentStyle: { backgroundColor: theme.colors.backgroundSecondary }, // This sets the background color
        headerStyle: { backgroundColor: theme.colors.backgroundSecondary },
        headerTintColor: theme.colors.contentPrimary,
        headerShadowVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            // The NativeStack adds some margins on the sides of the header.
            // Those 16px compensates for that
            <View style={{ marginLeft: -16 }}>
              <NavigationBackButton
                onPress={navigation.goBack}
                variant="secondary"
              />
            </View>
          ) : undefined,
      })}
    />
  );
}
