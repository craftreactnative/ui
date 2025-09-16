import { HapticTab } from '@/components/HapticTab/HapticTab';
import { Tabs } from 'expo-router';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

const ComponentsIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 100 100" {...props}>
    <Path d="M13 10h30.7c1.7 0 3 1.3 3 3v30.7c0 1.7-1.3 3-3 3H13c-1.7 0-3-1.3-3-3V13c0-1.7 1.3-3 3-3zM83.3 53.3H60c-3.7 0-6.7 3-6.7 6.7v23.3c0 3.7 3 6.7 6.7 6.7h23.3c3.7 0 6.7-3 6.7-6.7V60c0-3.7-3-6.7-6.7-6.7zM46.7 71.7c0 10.1-8.2 18.3-18.3 18.3-10.1 0-18.3-8.2-18.3-18.3 0-10.1 8.2-18.3 18.3-18.3 10.1 0 18.3 8.2 18.3 18.3ZM69.037 13.604 54.559 40.053c-1.062 1.93.385 4.247 2.509 4.247H85.93a2.844 2.844 0 0 0 2.51-4.247L74.057 13.604c-1.062-2.027-3.958-2.027-5.02 0Z" />
  </Svg>
);

const TemplatesIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 100 100" {...props}>
    <Path
      fillRule="evenodd"
      d="M17.943 25.342c0-9.535 7.726-17.265 17.261-17.265h29.592c9.535 0 17.265 7.73 17.265 17.265v49.316c0 9.535-7.73 17.265-17.265 17.265H35.204c-9.535 0-17.261-7.73-17.261-17.265V25.342ZM40.331 70.22a4.44 4.44 0 0 0 0 8.877h19.337a4.44 4.44 0 0 0 4.439-4.439 4.44 4.44 0 0 0-4.439-4.438H40.331Z"
    />
  </Svg>
);

export default function TabLayout() {
  const { theme } = useUnistyles();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accentPrimary,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: {
          backgroundColor: theme.colors.backgroundSecondary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Components',
          tabBarIcon: ({ color }) => <ComponentsIcon fill={color} />,
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ color }) => <TemplatesIcon fill={color} />,
        }}
      />
    </Tabs>
  );
}
