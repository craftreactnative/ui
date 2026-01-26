# CraftReactNative UI

**Copy-paste React Native components** built for [Unistyles](https://github.com/jpudysz/react-native-unistyles). Own your code, zero dependencies, full control.

[![GitHub stars](https://img.shields.io/github/stars/craftreactnative/ui?style=social)](https://github.com/craftreactnative/ui)
[![npm](https://img.shields.io/npm/v/@craftreactnative/ui)](https://www.npmjs.com/package/@craftreactnative/ui)
[![npm downloads](https://img.shields.io/npm/dm/@craftreactnative/ui)](https://www.npmjs.com/package/@craftreactnative/ui)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-000?logo=expo&logoColor=white)](https://docs.expo.dev/)
[![iOS](https://img.shields.io/badge/iOS-000?logo=apple)](https://developer.apple.com/ios/)
[![Android](https://img.shields.io/badge/Android-44CD11?logo=android&logoColor=white)](https://developer.android.com/)

## Why Copy-Paste?

Unlike traditional UI libraries that install as packages, CraftReactNative UI uses a **copy-paste approach**:

- **Zero dependency risk** - No version conflicts or breaking changes
- **Full code ownership** - Modify anything without restrictions
- **No black boxes** - See exactly what your components do
- **Production-ready** - Battle-tested components you can trust
- **Perfect for teams** - No package updates breaking your app

> **Note**: This is a community project and is not officially affiliated with the Unistyles team.

## Overview

CraftReactNative UI provides production-ready React Native components designed specifically to work with Unistyles. Instead of installing a package, you copy the component code directly into your project, giving you full control and customization.

## Features

- **Unistyles-optimized**: Components leverage Unistyles' theming and performance benefits
- **Copy-paste approach**: Own your code, no dependency lock-in
- **TypeScript**: Fully typed components with IntelliSense support
- **Theme-aware**: Built-in dark/light mode support
- **Fully customizable**: Modify anything without breaking updates
- **Production-ready**: Battle-tested components used in real apps
- **Accessible**: Built with accessibility best practices
- **CLI-powered**: Add components with a single command

## Quick Example

```bash
# Initialize your project
npx @craftreactnative/ui init

# Add components
npx @craftreactnative/ui add Button Avatar Card

# Start building!
```

```tsx
import { Button } from '@/craftrn-ui/components/Button';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export function MyScreen() {
  return (
    <View style={styles.container}>
      <Button onPress={() => console.log('Pressed!')}>
        Click Me
      </Button>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
  },
}));
```

## Getting Started

Visit the [documentation website](https://docs.craftreactnative.com/) for complete setup instructions and guides.

The fastest way to get started is with the CLI tool:

1. **Initialize** your project with themes and dependencies:

   ```bash
   npx @craftreactnative/ui init
   ```

2. **Add components** to your project:

   ```bash
   npx @craftreactnative/ui add Button
   npx @craftreactnative/ui add Avatar Card Slider
   # or install all components at once
   npx @craftreactnative/ui add --all
   ```

3. **Start building** with fully typed, theme-aware components!

## Available Components

- `Avatar` - User profile avatars
- `BottomSheet` - Modal bottom sheets
- `Button` - Primary action buttons
- `ButtonRound` - Circular action buttons
- `Card` - Container cards
- `Checkbox` - Checkboxes with animations
- `ContextMenu` - Context menus
- `Counter` - Number input counters
- `Divider` - Visual separators
- `InputOTP` - OTP/PIN input fields
- `InputSearch` - Search input fields
- `InputText` - Text input fields
- `ListItem` - List items
- `PasscodeEntry` - Passcode entry interface
- `PhotoCarousel` - Image carousels
- `Radio` - Radio buttons
- `Skeleton` - Loading placeholders
- `Slider` - Value sliders
- `SliderDual` - Range sliders
- `Switch` - Toggle switches
- `Text` - Styled text components

[View all components →](https://docs.craftreactnative.com/)

## Documentation

- [Documentation](https://docs.craftreactnative.com/) - Complete guides and API reference
- [Component Documentation](https://docs.craftreactnative.com/docs/components/avatar) - Detailed usage guides
- [Unistyles Documentation](https://www.unistyl.es/) - Learn about the styling library

## Premium Templates

Ready-to-use complete screen implementations built with these components. Save development time with production-ready code that includes dark mode support and follows best practices.

[Browse Templates →](https://craftreactnative.com/templates)

## Community

- [GitHub Discussions](https://github.com/craftreactnative/ui/discussions) - Ask questions and share ideas
- [Report Issues](https://github.com/craftreactnative/ui/issues) - Found a bug? Let us know!
- [Feature Requests](https://github.com/craftreactnative/ui/issues/new?template=feature_request.md) - Suggest new components or features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Whether it's:

- Bug fixes
- New components
- Documentation improvements
- Example usage
- Design improvements

See our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built for the React Native community</strong>
  <br />
  <sub>If CraftRN UI helps you build better apps, consider giving it a star</sub>
</div>
