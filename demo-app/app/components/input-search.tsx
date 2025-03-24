import { ButtonRound } from '@/craftrn-ui/components/ButtonRound';
import { Card } from '@/craftrn-ui/components/Card';
import { InputSearch } from '@/craftrn-ui/components/InputSearch';
import { Text } from '@/craftrn-ui/components/Text';
import { Search } from '@/tetrisly-icons/Search';
import { Slider } from '@/tetrisly-icons/Slider';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function InputSearchScreen() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'InputSearch',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <InputSearch
            placeholder="Search for a destination"
            selectionColor={theme.colors.accentPrimary}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With left and right accessories
        </Text>
        <Card style={styles.componentContainer}>
          <InputSearch
            placeholder="Search for a destination"
            leftAccessory={
              <View style={styles.leftAccessory}>
                <Search color={theme.colors.contentTertiary} />
              </View>
            }
            rightAccessory={
              <ButtonRound
                renderIcon={size => (
                  <Slider size={size} color={theme.colors.contentTertiary} />
                )}
                onPress={() => {}}
              />
            }
            selectionColor={theme.colors.accentPrimary}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.horizontalScreen,
    paddingVertical: theme.spacing.medium,
  },
  content: {
    gap: theme.spacing.small,
    marginTop: theme.spacing.large,
  },
  heading: {
    fontWeight: 'bold',
  },
  componentContainer: {
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
  },
  leftAccessory: {
    marginHorizontal: theme.spacing.xsmall,
  },
}));
