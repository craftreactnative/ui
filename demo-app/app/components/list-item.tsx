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
import { Divider } from '../../craftrn-ui/components/Divider';

export default function ListItemScreen() {
  const { theme } = useUnistyles();
  const [hasTextAbove, setHasTextAbove] = useState(false);
  const [hasTextBelow, setHasTextBelow] = useState(false);
  const [hasLeftItem, setHasLeftItem] = useState(false);
  const [hasRightItem, setHasRightItem] = useState(false);
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
      itemLeft: hasLeftItem ? (
        <View style={styles.leftItem}>
          <SliderIcon color={theme.colors.contentPrimary} />
        </View>
      ) : undefined,
      itemRight: hasRightItem ? (
        <View style={styles.rightItem}>
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
              variant={hasTextAbove ? 'secondary' : 'neutral'}
              onPress={() => setHasTextAbove(!hasTextAbove)}
            >
              Text above
            </Button>
            <Button
              size="small"
              variant={hasTextBelow ? 'secondary' : 'neutral'}
              onPress={() => setHasTextBelow(!hasTextBelow)}
            >
              Text below
            </Button>
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Toggle Controls */}
        <ListItem
          text="Left item"
          textBelow="Show icon on the left side"
          itemRight={
            <Switch value={hasLeftItem} onValueChange={setHasLeftItem} />
          }
          divider
        />

        <ListItem
          text="Right item"
          textBelow="Show icon on the right side"
          itemRight={
            <Switch value={hasRightItem} onValueChange={setHasRightItem} />
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
        <Divider style={styles.divider} />

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
  sliderContainer: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    alignItems: 'center',
  },
  divider: {
    marginVertical: theme.spacing.xsmall,
  },
  leftItem: {
    marginRight: theme.spacing.medium,
  },
  rightItem: {
    marginLeft: theme.spacing.medium,
  },
  scrollView: {
    flex: 1,
  },
}));
