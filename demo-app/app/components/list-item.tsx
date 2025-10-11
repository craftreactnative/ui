import { Button } from '@/craftrn-ui/components/Button';
import { Card } from '@/craftrn-ui/components/Card';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Slider } from '@/craftrn-ui/components/Slider';
import { Switch } from '@/craftrn-ui/components/Switch';
import { ChevronDown } from '@/tetrisly-icons/ChevronDown';
import { Slider as SliderIcon } from '@/tetrisly-icons/Slider';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from 'react-native-unistyles';

export default function ListItemScreen() {
  const { theme } = useUnistyles();

  const [hasTextAbove, setHasTextAbove] = useState(false);
  const [hasTextBelow, setHasTextBelow] = useState(false);
  const [hasLeftAccessory, setHasLeftAccessory] = useState(false);
  const [hasRightAccessory, setHasRightAccessory] = useState(false);
  const [isPressable, setIsPressable] = useState(false);
  const [hasDivider, setHasDivider] = useState(false);
  const [padding, setPadding] = useState(16);

  const getListItemProps = () => {
    return {
      onPress: isPressable ? () => {} : undefined,
      divider: hasDivider,
      ...(hasTextAbove && { textAbove: 'Label' }),
      text: 'Charlotte',
      ...(hasTextBelow && { textBelow: 'Additional info' }),
      itemLeft: hasLeftAccessory ? (
        <View style={styles.leftAccessory}>
          <SliderIcon color={theme.colors.contentPrimary} />
        </View>
      ) : undefined,
      itemRight: hasRightAccessory ? (
        <View style={styles.rightAccessory}>
          <ChevronDown color={theme.colors.contentPrimary} />
        </View>
      ) : undefined,
    };
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: 'ListItem',
        }}
      />

      {/* Demo ListItem */}
      <View style={styles.demoSection}>
        <Card>
          <ListItem {...getListItemProps()} style={{ padding }} />
        </Card>
      </View>

      {/* Controls */}
      <Card style={styles.controlsCard}>
        {/* Text Content Toggles */}
        <View style={styles.controlSection}>
          <ListItem text="Text Content" />
          <View style={styles.toggleGroup}>
            <Button
              size="small"
              variant="subtle"
              intent={hasTextAbove ? 'primary' : 'secondary'}
              onPress={() => setHasTextAbove(!hasTextAbove)}
            >
              Text above
            </Button>
            <Button
              size="small"
              variant="subtle"
              intent={hasTextBelow ? 'primary' : 'secondary'}
              onPress={() => setHasTextBelow(!hasTextBelow)}
            >
              Text below
            </Button>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Toggle Controls */}
        <ListItem
          text="Left Accessory"
          textBelow="Show icon on the left side"
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
          textBelow="Show icon on the right side"
          itemRight={
            <Switch
              value={hasRightAccessory}
              onValueChange={setHasRightAccessory}
            />
          }
          divider
        />

        <ListItem
          text="Pressable"
          textBelow="Make the list item pressable"
          itemRight={
            <Switch value={isPressable} onValueChange={setIsPressable} />
          }
          divider
        />

        <View style={styles.controlSection}>
          <ListItem text="Padding" textBelow={`Adjust padding: ${padding}px`} />
          <View style={styles.sliderContainer}>
            <Slider
              min={0}
              max={48}
              initialValue={padding}
              width={300}
              onValueChange={setPadding}
              ariaLabel="ListItem padding"
              accessibilityHint="Adjust the padding of the ListItem"
            />
          </View>
        </View>
        <View style={styles.divider} />

        <ListItem
          text="Divider"
          textBelow="Show divider line below the item"
          itemRight={
            <Switch value={hasDivider} onValueChange={setHasDivider} />
          }
        />
      </Card>
    </ScrollView>
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
    justifyContent: 'center',
  },
  demoCard: {
    padding: theme.spacing.large,
  },
  controlsCard: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
  controlSection: {
    gap: theme.spacing.medium,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xsmall,
    flexWrap: 'wrap',
  },
  sliderContainer: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    marginVertical: theme.spacing.xsmall,
  },
  leftAccessory: {
    marginRight: theme.spacing.medium,
  },
  rightAccessory: {
    marginLeft: theme.spacing.medium,
  },
  scrollView: {
    flex: 1,
  },
}));
