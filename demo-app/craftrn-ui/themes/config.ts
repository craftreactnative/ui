export const colors = {
  stone50: '#fafaf9',
  stone100: '#f5f5f4',
  stone200: '#e7e5e4',
  stone300: '#d6d3d1',
  stone400: '#beb9b6',
  stone500: '#78716c',
  stone600: '#57534e',
  stone700: '#44403c',
  stone800: '#292524',
  stone900: '#1c1917',
  stone950: '#0c0a09',

  teal150: '#d5f2f5',
  teal300: '#0bb6cb',
  teal600: '#007884',
  teal700: '#006771',
  teal800: '#004247',

  // Semantic colors
  green500: '#22c55e',
  green700: '#15803d',
  green800: '#166534',

  red500: '#ef4444',
  red700: '#b91c1c',
  red800: '#991b1b',

  blue700: '#1d4ed8',

  // Non-semantic colors
  grape600: '#544171',
  eggplant600: '#714148',
  fjord600: '#415171',
  olive600: '#456138',
  sunshine200: '#f5be0a',
} as const;

const fontSizes = {
  xxlarge: {
    fontSize: 32,
    lineHeight: 32,
  },
  xlarge: {
    fontSize: 24,
    lineHeight: 30,
  },
  large: {
    fontSize: 18,
    lineHeight: 25,
  },
  medium: {
    fontSize: 16,
    lineHeight: 21,
  },
  small: {
    fontSize: 14,
    lineHeight: 19,
  },
  xsmall: {
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

export const lightTheme = {
  colors: {
    backgroundPrimary: colors.stone100,
    backgroundSecondary: colors.stone200,
    backgroundTertiary: colors.stone300,
    backgroundQuaternary: colors.stone400,

    accentPrimary: colors.teal700,
    accentSecondary: colors.teal800,
    accentTertiary: colors.teal300,
    accentQuaternary: colors.teal150,

    contentPrimary: colors.stone900,
    contentSecondary: colors.stone700,
    contentTertiary: colors.stone600,
    contentAccent: colors.teal700,
    contentError: colors.red700,

    borderPrimary: colors.stone300,
    borderSecondary: colors.stone200,

    shadowPrimary: colors.stone800,

    overlay: colors.stone600,

    transparent: 'transparent',

    // Semantic colors
    informativeStrong: colors.blue700,

    positivePrimary: colors.green700,
    positiveSecondary: colors.green800,

    negativePrimary: colors.red700,
    negativeSecondary: colors.red800,

    // Non-semantic colors
    white: colors.stone50,
    black: colors.stone950,
    berryStrong: colors.grape600,
    wineStrong: colors.eggplant600,
    imperialBlueStrong: colors.fjord600,
    darkOliveStrong: colors.olive600,
    sunshineStrong: colors.sunshine200,
  },
  borderRadius: {
    xsmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
    full: 999,
  },
  fontSizes,
  spacing: {
    xxsmall: 2,
    xsmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
    xxlarge: 32,
  },
  textVariants: {
    heading1: {
      ...fontSizes.xxlarge,
      fontWeight: '900',
      letterSpacing: -1,
    },
    heading2: {
      ...fontSizes.xlarge,
      fontWeight: '800',
    },
    heading3: {
      ...fontSizes.large,
      fontWeight: '700',
    },
    body1: {
      ...fontSizes.medium,
      fontWeight: '400',
    },
    body2: {
      ...fontSizes.small,
      fontWeight: '400',
    },
    body3: {
      ...fontSizes.xsmall,
      fontWeight: '400',
    },
  },
} as const;

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,

    backgroundPrimary: colors.stone900,
    backgroundSecondary: colors.stone950,
    backgroundTertiary: colors.stone800,
    backgroundQuaternary: colors.stone700,

    accentPrimary: colors.teal700,
    accentSecondary: colors.teal600,
    accentTertiary: colors.teal800,

    contentPrimary: colors.stone50,
    contentSecondary: colors.stone300,
    contentTertiary: colors.stone400,
    contentAccent: colors.teal300,

    borderPrimary: colors.stone800,
    borderSecondary: colors.stone900,

    shadowPrimary: colors.stone600,

    overlay: colors.stone600,

    // Semantic colors
    positivePrimary: colors.green700,

    negativePrimary: colors.red700,
  },
} as const;
