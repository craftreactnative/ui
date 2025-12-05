import { ButtonRound } from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { ChevronLeft } from '@/tetrisly-icons/ChevronLeft';
import React, { ComponentProps } from 'react';
import { Platform, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const NavigationBackButton = (
  props: Partial<ComponentProps<typeof ButtonRound>>,
) => {
  return (
    <View style={styles.container}>
      <ButtonRound
        {...props}
        animationConfig={{ scaleIn: 1.1 }}
        renderContent={({ iconSize, iconColor }) => (
          <ChevronLeft size={iconSize} color={iconColor} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginRight:
      Platform.OS === 'ios' ? theme.spacing.xsmall : theme.spacing.medium,
  },
}));
