import { ButtonRound } from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { ChevronLeft } from '@/tetrisly-icons/ChevronLeft';
import React, { ComponentProps } from 'react';
import { Platform, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export const NavigationBackButton = (
  props: Partial<ComponentProps<typeof ButtonRound>>,
) => {
  const { theme } = useUnistyles();
  const { intent, variant, ...restProps } = props;
  return (
    <View style={styles.container}>
      <ButtonRound
        {...restProps}
        renderContent={({ iconSize, iconColor }) => (
          <ChevronLeft size={iconSize} color={iconColor} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginLeft: theme.spacing.large,
    marginRight:
      Platform.OS === 'ios' ? theme.spacing.xsmall : theme.spacing.medium,
  },
}));
