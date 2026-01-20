import aiConversationDark from '@/assets/images/screens/ai-conversation-dark.png';
import aiConversationLight from '@/assets/images/screens/ai-conversation-light.png';
import editorialArticleDark from '@/assets/images/screens/editorial-article-dark.png';
import editorialArticleLight from '@/assets/images/screens/editorial-article-light.png';
import editorialFeedDark from '@/assets/images/screens/editorial-feed-dark.png';
import editorialFeedLight from '@/assets/images/screens/editorial-feed-light.png';
import messagingInboxDark from '@/assets/images/screens/messaging-inbox-dark.png';
import messagingInboxLight from '@/assets/images/screens/messaging-inbox-light.png';
import messagingThreadDark from '@/assets/images/screens/messaging-thread-dark.png';
import messagingThreadLight from '@/assets/images/screens/messaging-thread-light.png';
import notificationsDark from '@/assets/images/screens/notifications-dark.png';
import notificationsLight from '@/assets/images/screens/notifications-light.png';
import onboardingCountryDark from '@/assets/images/screens/onboarding-country-dark.png';
import onboardingCountryLight from '@/assets/images/screens/onboarding-country-light.png';
import onboardingCreatePasscodeDark from '@/assets/images/screens/onboarding-create-passcode-dark.png';
import onboardingCreatePasscodeLight from '@/assets/images/screens/onboarding-create-passcode-light.png';
import onboardingOneTimeCodeDark from '@/assets/images/screens/onboarding-one-time-code-dark.png';
import onboardingOneTimeCodeLight from '@/assets/images/screens/onboarding-one-time-code-light.png';
import onboardingSignUpDark from '@/assets/images/screens/onboarding-sign-up-dark.png';
import onboardingSignUpLight from '@/assets/images/screens/onboarding-sign-up-light.png';
import paywallSubscriptionDark from '@/assets/images/screens/paywall-subscription-dark.png';
import paywallSubscriptionLight from '@/assets/images/screens/paywall-subscription-light.png';
import profileDark from '@/assets/images/screens/profile-dark.png';
import profileLight from '@/assets/images/screens/profile-light.png';
import settingsDark from '@/assets/images/screens/settings-dark.png';
import settingsLight from '@/assets/images/screens/settings-light.png';
import staysDetailsDark from '@/assets/images/screens/stays-details-dark.png';
import staysDetailsLight from '@/assets/images/screens/stays-details-light.png';
import staysFiltersDark from '@/assets/images/screens/stays-filters-dark.png';
import staysFiltersLight from '@/assets/images/screens/stays-filters-light.png';
import staysSearchDark from '@/assets/images/screens/stays-search-dark.png';
import staysSearchLight from '@/assets/images/screens/stays-search-light.png';
import staysSelectionDark from '@/assets/images/screens/stays-selection-dark.png';
import staysSelectionLight from '@/assets/images/screens/stays-selection-light.png';
import {
  default as tradingDashboardDark,
} from '@/assets/images/screens/trading-dashboard-dark.png';
import {
  default as tradingDashboardLight,
} from '@/assets/images/screens/trading-dashboard-light.png';
import tradingOrderDark from '@/assets/images/screens/trading-order-dark.png';
import tradingOrderLight from '@/assets/images/screens/trading-order-light.png';
import tradingTrendsDark from '@/assets/images/screens/trading-trends-dark.png';
import tradingTrendsLight from '@/assets/images/screens/trading-trends-light.png';
import ParallaxScrollView from '@/components/ParallaxScrollView/ParallaxScrollView';
import { Card } from '@/craftrn-ui/components/Card/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem/ListItem';
import { ChevronRight } from '@/tetrisly-icons/ChevronRight';
import { Href, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ComponentType } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from 'react-native-unistyles';
import { useTheme } from '../../contexts/ThemeContext';

const UniSvg = withUnistyles(Svg);

export const MenuItem: ComponentType<{
  title: string;
  href: Href;
  imageSource: ImageSourcePropType;
  description: string;
}> = ({ title, href, imageSource, description }) => {
  const router = useRouter();

  return (
    <Card>
      <Pressable onPress={() => router.push(href)} style={styles.menuItem}>
        <Image source={imageSource} style={styles.menuItemImage} />
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemText}>{title}</Text>
          {description && (
            <Text style={styles.menuItemTextBelow}>{description}</Text>
          )}
        </View>
      </Pressable>
    </Card>
  );
};

export default function TemplatesScreen() {
  const { mode } = useTheme();
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <ParallaxScrollView title="Templates">
        <View style={styles.scrollViewContent}>
          <MenuItem
            title="AI Conversation"
            description="Chat interface inspired by AI assistant apps with clean design and modern messaging."
            href="/templates/ai-conversation/a7b8c9d0-e1f2-3456-abcd-789012345678"
            imageSource={
              mode === 'light' ? aiConversationLight : aiConversationDark
            }
          />
          <MenuItem
            title="Editorial article"
            description="A detailed article view with rich content and related readings."
            href="/templates/editorial-article/16d48496-00b0-4270-854d-94393828952a"
            imageSource={
              mode === 'light' ? editorialArticleLight : editorialArticleDark
            }
          />
          <MenuItem
            title="Editorial feed"
            description="A feed of editorial content, perfect for news or blog layouts."
            href="/templates/editorial-feed"
            imageSource={
              mode === 'light' ? editorialFeedLight : editorialFeedDark
            }
          />
          <MenuItem
            title="Messaging inbox"
            description="An inbox for managing messages and conversations."
            href="/templates/messaging-inbox"
            imageSource={
              mode === 'light' ? messagingInboxLight : messagingInboxDark
            }
          />
          <MenuItem
            title="Messaging thread"
            description="A detailed view of a single messaging thread."
            href="/templates/messaging-thread/7d3463b7-9acd-4ee3-8d0e-3c28fab32945"
            imageSource={
              mode === 'light' ? messagingThreadLight : messagingThreadDark
            }
          />
          <MenuItem
            title="Notifications"
            description="Display and manage user notifications."
            href="/templates/notifications"
            imageSource={
              mode === 'light' ? notificationsLight : notificationsDark
            }
          />
          <MenuItem
            title="Onboarding country"
            description="Select your country during the onboarding process."
            href="/templates/onboarding-country?countryCode=FR"
            imageSource={
              mode === 'light' ? onboardingCountryLight : onboardingCountryDark
            }
          />
          <MenuItem
            title="Onboarding create passcode"
            description="Set up a secure passcode for your account."
            href="/templates/onboarding-create-passcode"
            imageSource={
              mode === 'light'
                ? onboardingCreatePasscodeLight
                : onboardingCreatePasscodeDark
            }
          />
          <MenuItem
            title="Onboarding one time code"
            description="Enter a one-time code for verification."
            href="/templates/onboarding-one-time-code"
            imageSource={
              mode === 'light'
                ? onboardingOneTimeCodeLight
                : onboardingOneTimeCodeDark
            }
          />
          <MenuItem
            title="Onboarding sign up"
            description="User registration and sign-up flow."
            href="/templates/onboarding-sign-up"
            imageSource={
              mode === 'light' ? onboardingSignUpLight : onboardingSignUpDark
            }
          />
          <MenuItem
            title="Paywall subscription"
            description="Manage and subscribe to premium content."
            href="/templates/paywall-subscription"
            imageSource={
              mode === 'light'
                ? paywallSubscriptionLight
                : paywallSubscriptionDark
            }
          />
          <MenuItem
            title="Profile"
            description="View and edit user profile information."
            href="/templates/profile"
            imageSource={mode === 'light' ? profileLight : profileDark}
          />
          <MenuItem
            title="Settings"
            description="Configure application settings and preferences."
            href="/templates/settings"
            imageSource={mode === 'light' ? settingsLight : settingsDark}
          />
          <MenuItem
            title="Stays details"
            description="Detailed information about a specific stay or accommodation."
            href="/templates/stays-details/f7a97e34-1b6f-4f5c-ae16-d7c28f1de169"
            imageSource={
              mode === 'light' ? staysDetailsLight : staysDetailsDark
            }
          />
          <MenuItem
            title="Stays filters"
            description="Apply filters to refine your search for stays."
            href="/templates/stays-filters"
            imageSource={
              mode === 'light' ? staysFiltersLight : staysFiltersDark
            }
          />
          <MenuItem
            title="Stays search"
            description="Search for available stays and accommodations."
            href="/templates/stays-search"
            imageSource={mode === 'light' ? staysSearchLight : staysSearchDark}
          />
          <MenuItem
            title="Stays selection"
            description="Select and manage your chosen stays."
            href="/templates/stays-selection"
            imageSource={
              mode === 'light' ? staysSelectionLight : staysSelectionDark
            }
          />
          <MenuItem
            title="Trading dashboard"
            description="Monitor and manage your trading activities."
            href="/templates/trading-dashboard"
            imageSource={
              mode === 'light' ? tradingDashboardLight : tradingDashboardDark
            }
          />
          <MenuItem
            title="Trading order"
            description="Place and manage your trading orders."
            href="/templates/trading-order/3e458e61-677c-4d55-b908-507a490a4853"
            imageSource={
              mode === 'light' ? tradingOrderLight : tradingOrderDark
            }
          />
          <MenuItem
            title="Trading trends"
            description="View market trends, top gainers, losers, and market sentiment."
            href="/templates/trading-trends"
            imageSource={
              mode === 'light' ? tradingTrendsLight : tradingTrendsDark
            }
          />
        </View>
      </ParallaxScrollView>

      <View style={styles.bottomWrapper}>
        <View style={styles.gradientContainer}>
          <UniSvg height="24" style={styles.gradient}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop
                  offset="0"
                  stopColor={theme.colors.backgroundScreen}
                  stopOpacity="0"
                />
                <Stop
                  offset="1"
                  stopColor={theme.colors.backgroundScreen}
                  stopOpacity="1"
                />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="24" fill="url(#grad)" />
          </UniSvg>
        </View>

        <View style={styles.fixedBottomContainer}>
          <Card>
            <ListItem
              text="Get all templates"
              textBelow="Access GitHub resources now"
              style={styles.listItem}
              itemRight={<ChevronRight color={theme.colors.contentPrimary} />}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  'https://www.craftreactnative.com/pricing',
                  {
                    controlsColor: theme.colors.interactivePrimary,
                    presentationStyle:
                      WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
                  },
                )
              }
            />
          </Card>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
  },
  scrollViewContent: {
    backgroundColor: theme.colors.backgroundScreen,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.large,
    gap: theme.spacing.small,
  },
  listItem: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
  },
  menuItemContent: {
    flex: 1,
    marginHorizontal: theme.spacing.small,
    gap: theme.spacing.small,
    justifyContent: 'flex-start',
    padding: theme.spacing.medium,
  },
  menuItemText: {
    ...theme.textVariants.body1,
    fontWeight: '500',
    color: theme.colors.contentPrimary,
  },
  menuItemTextBelow: {
    ...theme.textVariants.body3,
    color: theme.colors.contentTertiary,
  },
  bottomWrapper: {
    position: 'relative',
  },
  fixedBottomContainer: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.small,
    paddingBottom: theme.spacing.large,
  },
  gradientContainer: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    height: 24,
    pointerEvents: 'none',
    zIndex: 1,
  },
  gradient: {
    flex: 1,
  },
  themeButtonContainer: {
    marginTop: theme.spacing.small,
  },
  themeIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.small,
  },
  menuItemImage: {
    width: 120,
    aspectRatio: 0.46,
    borderRadius: theme.borderRadius.small,
  },
}));
