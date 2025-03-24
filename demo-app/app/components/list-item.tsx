import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Text } from '@/craftrn-ui/components/Text';
import { ChevronDown } from '@/tetrisly-icons/ChevronDown';
import { Slider } from '@/tetrisly-icons/Slider';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function ListItemScreen() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'ListItem',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <ListItem text="Account" />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With text and textBelow
        </Text>
        <Card style={styles.componentContainer}>
          <ListItem text="First name" textBelow="Charlotte" />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With left accessory
        </Text>
        <Card style={styles.componentContainer}>
          <ListItem
            onPress={() => {}}
            text="Filters"
            textBelow="Configure your filter preferences"
            itemLeft={
              <View style={styles.leftAccessory}>
                <Slider color={theme.colors.contentPrimary} />
              </View>
            }
          />
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          With right accessory
        </Text>
        <Card style={styles.componentContainer}>
          <ListItem
            onPress={() => {}}
            text="First name"
            textBelow="Charlotte"
            itemRight={
              <View style={styles.rightAccessory}>
                <ChevronDown color={theme.colors.contentPrimary} />
              </View>
            }
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
    marginRight: theme.spacing.medium,
  },
  rightAccessory: {
    marginLeft: theme.spacing.medium,
  },
}));
