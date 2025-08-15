import { Card } from '@/craftrn-ui/components/Card/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem/ListItem';
import { ChevronRight } from '@/tetrisly-icons/ChevronRight';
import { Href, useRouter } from 'expo-router';
import { ComponentProps, ComponentType } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ParallaxScrollView from '../../components/ParallaxScrollView/ParallaxScrollView';

export const MenuItem: ComponentType<
  ComponentProps<typeof ListItem> & { divider?: boolean; href: Href }
> = ({ divider = true, href, ...listItemProps }) => {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();

  return (
    <ListItem
      style={styles.listItem}
      divider={divider}
      itemRight={<ChevronRight color={theme.colors.contentPrimary} />}
      onPress={() => router.push(href)}
      {...listItemProps}
    />
  );
};

export default function ComponentsScreen() {
  const { styles } = useStyles(stylesheet);

  return (
    <ParallaxScrollView title="Components">
      <View style={styles.scrollViewContent}>
        <Card>
          <MenuItem
            text="Avatar"
            textBelow="Renders an avatar with the option to show a status indicator and fallback state"
            href="/components/avatar"
          />
          <MenuItem
            text="BottomSheet"
            textBelow="Renders a modal bottom sheet with options to swipe down to close and tap overlay to dismiss"
            href="/components/bottom-sheet"
          />
          <MenuItem
            text="Button"
            textBelow="Renders a pressable button with different variants and sizes"
            href="/components/button"
          />
          <MenuItem
            text="ButtonRound"
            textBelow="Renders a pressable circular button with an icon"
            href="/components/button-round"
          />
          <MenuItem
            text="Card"
            textBelow="Renders a card with rounded corners and hidden overflow"
            href="/components/card"
          />
          <MenuItem
            text="Checkbox"
            textBelow="Renders a checkbox"
            href="/components/checkbox"
          />
          <MenuItem
            text="ContextMenu"
            textBelow="Renders a context menu with options to perform actions"
            href="/components/context-menu"
          />
          <MenuItem
            text="Counter"
            textBelow="Renders a counter with increase and decrease buttons and an empty optional text"
            href="/components/counter"
          />
          <MenuItem
            text="InputOTP"
            textBelow="Renders a text input field to enter a one-time passcode"
            href="/components/input-otp"
          />
          <MenuItem
            text="InputSearch"
            textBelow="Renders a search input field"
            href="/components/input-search"
          />
          <MenuItem
            text="InputText"
            textBelow="Renders a text input field"
            href="/components/input-text"
          />
          <MenuItem
            text="ListItem"
            textBelow="Renders a configurable list item with a optional left and right elements"
            href="/components/list-item"
          />
          <MenuItem
            text="PasscodeEntry"
            textBelow="Renders a component with a digit keyboard to enter a passcode"
            href="/components/passcode-entry"
          />
          <MenuItem
            text="PhotoCarousel"
            textBelow="Renders a carousel to swipe through images"
            href="/components/photo-carousel"
          />
          <MenuItem
            text="Radio"
            textBelow="Renders a radio button"
            href="/components/radio"
          />
          <MenuItem
            text="Slider"
            textBelow="Renders a slider with a single knob"
            href="/components/slider"
          />
          <MenuItem
            text="SliderDual"
            textBelow="Renders a slider with two knobs"
            href="/components/slider-dual"
          />
          <MenuItem
            text="Switch"
            textBelow="Renders a switch"
            href="/components/switch"
          />
          <MenuItem
            text="Text"
            textBelow="Renders text with different variants"
            href="/components/text"
            divider={false}
          />
        </Card>
      </View>
    </ParallaxScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollViewContent: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.large,
  },
  listItem: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
  parallaxHeader: {
    bottom: theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
    position: 'absolute',
    width: '100%',
  },
  headerLogo: {
    height: 100,
    width: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
}));
