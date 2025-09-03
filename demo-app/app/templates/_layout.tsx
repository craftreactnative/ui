import { NavigationBackButton } from '@/components/NavigationBackButton/NavigationBackButton';
import { Button } from '@/craftrn-ui/components/Button/Button';
import { Stack } from 'expo-router';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function TemplatesLayout() {
  const { theme } = useUnistyles();

  return (
    <>
      <Stack
        screenOptions={({ navigation }) => ({
          contentStyle: { backgroundColor: theme.colors.backgroundQuaternary }, // This sets the background color
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
                  intent="secondary"
                />
              </View>
            ) : undefined,
        })}
      />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <Button
          onPress={() =>
            Linking.openURL('https://craftreactnative.com/pricing')
          }
        >
          Buy now
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create(theme => ({
  safeArea: {
    backgroundColor: theme.colors.backgroundQuaternary,
    paddingHorizontal: theme.spacing.large,
  },
}));
