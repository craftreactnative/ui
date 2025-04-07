import { ButtonRound } from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { ChevronLeft } from '@/tetrisly-icons/ChevronLeft';
import React, { ComponentProps } from 'react';
import { Platform, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const NavigationBackButton = (
  props: Partial<ComponentProps<typeof ButtonRound>>,
) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <ButtonRound
        renderContent={({ iconSize }) => (
          <ChevronLeft size={iconSize} color={theme.colors.contentPrimary} />
        )}
        {...props}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    marginLeft: theme.spacing.large,
    marginRight:
      Platform.OS === 'ios' ? theme.spacing.xsmall : theme.spacing.medium,
  },
}));
