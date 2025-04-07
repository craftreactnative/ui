import { Card } from '@/craftrn-ui/components/Card';
import { Radio } from '@/craftrn-ui/components/Radio';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function RadioScreen() {
  const { styles } = useStyles(stylesheet);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);

  const handlePress = () => {
    setChecked1(!checked1);
    setChecked2(!checked2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Radio',
        }}
      />
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Default
        </Text>
        <Card style={styles.componentContainer}>
          <Pressable onPress={handlePress}>
            <Radio checked={checked1} />
          </Pressable>
          <Pressable onPress={handlePress}>
            <Radio checked={checked2} />
          </Pressable>
        </Card>
      </View>
      <View style={styles.content}>
        <Text variant="body2" style={styles.heading}>
          Disabled
        </Text>
        <Card style={styles.componentContainer}>
          <Radio checked={false} disabled />
          <Radio checked={true} disabled />
        </Card>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
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
    flexDirection: 'row',
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
  },
}));
