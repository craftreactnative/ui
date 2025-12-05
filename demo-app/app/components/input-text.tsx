import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { Divider } from '@/craftrn-ui/components/Divider';
import { InputText } from '@/craftrn-ui/components/InputText';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Switch } from '@/craftrn-ui/components/Switch';
import { File } from '@/tetrisly-icons/File';
import { Lock } from '@/tetrisly-icons/Lock';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

type InputTextSize = 'small' | 'medium' | 'large';

export default function InputTextScreen() {
  const { theme } = useUnistyles();
  const headerHeight = useHeaderHeight();

  const [size, setSize] = useState<InputTextSize>('medium');
  const [hasLabel, setHasLabel] = useState(true);
  const [hasItemLeft, setHasItemLeft] = useState(false);
  const [hasItemRight, setHasItemRight] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState('');

  const sizes: InputTextSize[] = ['small', 'medium', 'large'];

  const handleSizeChange = useCallback((newSize: InputTextSize) => {
    setSize(newSize);
    if (newSize === 'small') {
      setHasLabel(false);
    }
  }, []);

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
            title: 'InputText',
          }}
        />

        {/* Demo Input */}
        <View style={styles.demoSection}>
          <Card style={styles.demoContainer}>
            <InputText
              size={size}
              {...(hasLabel && size !== 'small'
                ? { label: 'Sample Label' }
                : { placeholder: 'Enter text here...' })}
              itemLeft={
                hasItemLeft ? (
                  <View style={styles.itemLeft}>
                    <File color={theme.colors.contentTertiary} />
                  </View>
                ) : undefined
              }
              itemRight={
                hasItemRight ? (
                  <View style={styles.itemRight}>
                    <Lock color={theme.colors.contentTertiary} />
                  </View>
                ) : undefined
              }
              error={hasError ? 'This field is required' : undefined}
              value={value}
              onChangeText={setValue}
            />
          </Card>
        </View>

        {/* Controls */}
        <Card style={styles.controlsCard}>
          {/* Size Selector */}
          <View style={styles.controlSection}>
            <ListItem text="Size" />
            <View style={styles.toggleGroup}>
              {sizes.map(s => (
                <Button
                  key={s}
                  size="small"
                  variant={size === s ? 'secondary' : 'neutral'}
                  onPress={() => handleSizeChange(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </View>
          </View>
          <Divider style={styles.divider} />

          {/* Toggle Controls */}
          <ListItem
            text="Label"
            textBelow={
              size === 'small'
                ? 'Not available for small size'
                : 'Show label above input'
            }
            itemRight={
              <Switch
                value={hasLabel}
                onValueChange={setHasLabel}
                disabled={size === 'small'}
              />
            }
            divider
          />

          <ListItem
            text="Item Left"
            textBelow="Show icon on the left"
            itemRight={
              <Switch value={hasItemLeft} onValueChange={setHasItemLeft} />
            }
            divider
          />

          <ListItem
            text="Item Right"
            textBelow="Show icon on the right"
            itemRight={
              <Switch value={hasItemRight} onValueChange={setHasItemRight} />
            }
            divider
          />

          <ListItem
            text="Error State"
            textBelow="Show input with error message"
            itemRight={<Switch value={hasError} onValueChange={setHasError} />}
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
    height: 300,
    marginBottom: theme.spacing.large,
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.large,
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.small,
  },
  controlSection: {
    gap: theme.spacing.small,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
  divider: {
    marginVertical: theme.spacing.xsmall,
  },
  itemLeft: {
    marginRight: theme.spacing.xsmall,
  },
  itemRight: {
    marginLeft: theme.spacing.xsmall,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
}));
