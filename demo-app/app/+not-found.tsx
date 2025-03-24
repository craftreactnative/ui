import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '../craftrn-ui/components/Text/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant="heading3">This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text variant="body2" color="contentAccent">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
