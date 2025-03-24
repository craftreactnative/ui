import ParallaxScrollView from '@/components/ParallaxScrollView/ParallaxScrollView';
import { Card } from '@/craftrn-ui/components/Card/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem/ListItem';
import { Href, useRouter } from 'expo-router';
import { ComponentType } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ChevronRight } from '../../tetrisly-icons/ChevronRight';

export const MenuItem: ComponentType<{
  title: string;
  href: Href;
}> = ({ title, href }) => {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();

  return (
    <Card>
      <ListItem
        text={title}
        style={styles.listItem}
        itemRight={<ChevronRight color={theme.colors.contentPrimary} />}
        onPress={() => router.push(href)}
      />
    </Card>
  );
};

export default function TemplatesScreen() {
  const { styles } = useStyles(stylesheet);

  return (
    <ParallaxScrollView title="Templates">
      <View style={styles.scrollViewContent}>
        <MenuItem title="Discussions" href="/templates/discussions" />
        <MenuItem title="Listings" href="/templates/listings" />
        <MenuItem title="Notifications" href="/templates/notifications" />
        <MenuItem title="Onboarding" href="/templates/onboarding" />
        <MenuItem title="Paywall" href="/templates/paywall" />
        <MenuItem title="Publishing" href="/templates/publishing" />
        <MenuItem title="Trading" href="/templates/trading" />
        <MenuItem title="Settings" href="/templates/settings" />
      </View>
    </ParallaxScrollView>
  );
}

const stylesheet = createStyleSheet(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollViewContent: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.horizontalScreen,
    paddingVertical: spacing.large,
    gap: spacing.small,
  },
  listItem: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
  },
}));
