import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '../Text';
import { Backspace } from './Backspace';
import { Key } from './Key';
import { PinDot } from './PinDot';

const config = {
  pinLength: 6,
};

/**
 * Props for the PasscodeEntry component.
 */
export type Props = {
  /**
   * Callback function triggered when the passcode is filled.
   */
  onPasscodeEntered: (passcode: string) => void;
};

export const PasscodeEntry = ({ onPasscodeEntered }: Props) => {
  const [pin, setPin] = useState<string>('');
  const { styles, theme } = useStyles(stylesheet);

  const handlePinKeyPress = (value: number) => {
    if (pin.length < config.pinLength) {
      setPin(pin + value);
    }
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (pin.length === config.pinLength) {
      onPasscodeEntered(pin);
      timeoutId = setTimeout(() => {
        setPin('');
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  });

  const handleBackspaceKeyPress = () => {
    setPin(prevPin => prevPin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.pinDotsContainer}>
        {[...Array(config.pinLength)].map((_, index) => (
          <PinDot key={index} filled={index < pin.length} />
        ))}
      </View>
      <View style={styles.pinKeysContainer}>
        <View style={styles.pinKeysRow}>
          {[1, 2, 3].map(num => (
            <Key
              key={num}
              onPress={() => handlePinKeyPress(num)}
              ariaLabel={`${num}`}
            >
              <Text style={styles.pinKeyText}>{num}</Text>
            </Key>
          ))}
        </View>
        <View style={styles.pinKeysRow}>
          {[4, 5, 6].map(num => (
            <Key
              key={num}
              onPress={() => handlePinKeyPress(num)}
              ariaLabel={`${num}`}
            >
              <Text style={styles.pinKeyText}>{num}</Text>
            </Key>
          ))}
        </View>
        <View style={styles.pinKeysRow}>
          {[7, 8, 9].map(num => (
            <Key
              key={num}
              onPress={() => handlePinKeyPress(num)}
              ariaLabel={`${num}`}
            >
              <Text style={styles.pinKeyText}>{num}</Text>
            </Key>
          ))}
        </View>
        <View style={styles.pinKeysRow}>
          <View style={styles.pinKeysRowSpacer} />
          <Key onPress={() => handlePinKeyPress(0)} ariaLabel={`0`}>
            <Text style={styles.pinKeyText}>0</Text>
          </Key>
          <Key onPress={handleBackspaceKeyPress} ariaLabel="Backspace">
            <Backspace color={theme.colors.contentPrimary} size={28} />
          </Key>
        </View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ spacing, textVariants }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    gap: spacing.medium,
    paddingVertical: spacing.xxlarge,
  },
  pinKeysContainer: {
    marginVertical: spacing.large,
  },
  pinKeysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxlarge,
    marginBottom: spacing.large,
  },
  pinKeysRowSpacer: {
    width: 70,
  },
  pinKeyText: {
    ...textVariants.heading3,
  },
}));
