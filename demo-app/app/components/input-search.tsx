import { ButtonRound } from '@/craftrn-ui/components/ButtonRound';
import { Card } from '@/craftrn-ui/components/Card';
import { InputSearch } from '@/craftrn-ui/components/InputSearch';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { Search } from '@/tetrisly-icons/Search';
import { Slider } from '@/tetrisly-icons/Slider';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

export default function InputSearchScreen() {
  const { theme } = useUnistyles();
  const headerHeight = useHeaderHeight();

  const [hasLeftAccessory, setHasLeftAccessory] = useState(false);
  const [hasRightAccessory, setHasRightAccessory] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
      style={styles.keyboardView}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Stack.Screen
          options={{
            title: 'InputSearch',
          }}
        />

        {/* Demo InputSearch */}
        <View style={styles.demoSection}>
          <Card style={styles.demoContainer}>
            <InputSearch
              placeholder="Search for a destination"
              leftAccessory={
                hasLeftAccessory ? (
                  <View style={styles.leftAccessory}>
                    <Search color={theme.colors.contentTertiary} />
                  </View>
                ) : undefined
              }
              rightAccessory={
                hasRightAccessory ? (
                  <ButtonRound
                    renderContent={({ iconSize }) => (
                      <Slider
                        size={iconSize}
                        color={theme.colors.contentTertiary}
                      />
                    )}
                    onPress={() => {}}
                  />
                ) : undefined
              }
              selectionColor={theme.colors.accentPrimary}
            />
          </Card>
        </View>

        {/* Controls */}
        <Card style={styles.controlsCard}>
          <ListItem
            text="Left Accessory"
            textBelow="Show search icon on the left"
            itemRight={
              <Switch
                value={hasLeftAccessory}
                onValueChange={setHasLeftAccessory}
              />
            }
            divider
          />

          <ListItem
            text="Right Accessory"
            textBelow="Show filter button on the right"
            itemRight={
              <Switch
                value={hasRightAccessory}
                onValueChange={setHasRightAccessory}
              />
            }
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    paddingBottom: UnistylesRuntime.insets.bottom + theme.spacing.medium,
  },
  demoSection: {
    flex: 1,
    marginBottom: theme.spacing.large,
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.large,
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
  leftAccessory: {
    marginHorizontal: theme.spacing.xsmall,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}));
