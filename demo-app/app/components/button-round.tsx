import { ButtonRound } from '@/craftrn-ui/components/ButtonRound';
import { Card } from '@/craftrn-ui/components/Card';
import { Text } from '@/craftrn-ui/components/Text';
import { ChevronRight } from '@/tetrisly-icons/ChevronRight';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function ButtonRoundScreen() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'ButtonRound',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default Variant
        </Text>
        <Card style={styles.componentContainer}>
          <ButtonRound
            onPress={() => {}}
            variant="default"
            intent="primary"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
          <ButtonRound
            onPress={() => {}}
            variant="default"
            intent="secondary"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Reversed Variant
        </Text>
        <Card style={styles.componentContainer}>
          <ButtonRound
            onPress={() => {}}
            variant="reversed"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Accent Variant
        </Text>
        <Card style={styles.componentContainer}>
          <ButtonRound
            onPress={() => {}}
            variant="accent"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
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
            variant="accent"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
          <ButtonRound
            onPress={() => {}}
            size="medium"
            variant="accent"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
          <ButtonRound
            onPress={() => {}}
            size="large"
            variant="accent"
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
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
            variant="default"
            intent="primary"
            size="medium"
            disabled
            renderContent={({ iconSize, iconColor }) => (
              <ChevronRight color={iconColor} size={iconSize} />
            )}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.spacing.large,
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
