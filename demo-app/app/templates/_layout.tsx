import { NavigationBackButton } from '@/components/NavigationBackButton/NavigationBackButton';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Stack } from 'expo-router';
import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function TemplatesLayout() {
  const { theme } = useUnistyles();

  return (
    <>
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
        })}
      />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <Button
          onPress={() =>
            Linking.openURL('https://craftreactnative.com/pricing')
          }
        >
          Get access now
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create(theme => ({
  safeArea: {
    backgroundColor: theme.colors.backgroundScreen,
    paddingHorizontal: theme.spacing.large,
  },
}));
