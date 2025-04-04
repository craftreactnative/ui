import { ButtonRound } from '@/craftrn-ui/components/ButtonRound';
import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { ChevronRight } from '@/tetrisly-icons/ChevronRight';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function ButtonRoundScreen() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'ButtonRound',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Variants
        </Text>
        <Card style={styles.componentContainer}>
          <ButtonRound
            onPress={() => {}}
            variant="primary"
            renderContent={({ iconSize }) => (
              <ChevronRight
                color={theme.colors.contentPrimary}
                size={iconSize}
              />
            )}
          />
          <ButtonRound
            onPress={() => {}}
            variant="secondary"
            renderContent={({ iconSize }) => (
              <ChevronRight
                color={theme.colors.contentPrimary}
                size={iconSize}
              />
            )}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Sizes
        </Text>
        <Card style={styles.componentContainer}>
          <ButtonRound
            onPress={() => {}}
            size="small"
            renderContent={({ iconSize }) => (
              <ChevronRight
                color={theme.colors.contentPrimary}
                size={iconSize}
              />
            )}
          />
          <ButtonRound
            onPress={() => {}}
            size="medium"
            renderContent={({ iconSize }) => (
              <ChevronRight
                color={theme.colors.contentPrimary}
                size={iconSize}
              />
            )}
          />
          <ButtonRound
            onPress={() => {}}
            size="large"
            renderContent={({ iconSize }) => (
              <ChevronRight
                color={theme.colors.contentPrimary}
                size={iconSize}
              />
            )}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Disabled
        </Text>
        <Card style={styles.componentContainer}>
          <ButtonRound
            onPress={() => {}}
            size="medium"
            disabled
            renderContent={({ iconSize }) => (
              <ChevronRight
                color={theme.colors.contentPrimary}
                size={iconSize}
              />
            )}
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
    flexDirection: 'row',
  },
}));
