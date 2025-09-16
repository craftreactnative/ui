# CraftReactNative UI CLI

[![npm version](https://img.shields.io/npm/v/@craftreactnative/ui.svg?style=for-the-badge)](https://www.npmjs.com/package/@craftreactnative/ui)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

A CLI tool for adding [CraftReactNative UI](https://github.com/craftreactnative/ui) components to your React Native projects. Built for [Unistyles](https://github.com/jpudysz/react-native-unistyles).

## Quick Start

1. **Initialize** your project with themes and dependencies:

```bash
npx @craftreactnative/ui init
```

2. **Add components** to your project:

```bash
npx @craftreactnative/ui add Button
npx @craftreactnative/ui add Avatar Card
# or install all components at once
npx @craftreactnative/ui add --all
```

## Commands

### `init`

Initialize your project with Unistyles themes and install required dependencies.

```bash
npx @craftreactnative/ui init
```

**Options:**

- `--skip-deps` - Skip installing dependencies

### `list`

List all available components.

```bash
npx @craftreactnative/ui list
# or
npx @craftreactnative/ui ls
```

### `add [components...]`

Add one or more components to your project.

```bash
npx @craftreactnative/ui add Button
npx @craftreactnative/ui add Avatar Card Slider
# or install all components at once
npx @craftreactnative/ui add --all
```

**Options:**

- `--force` - Overwrite existing components
- `--all` - Install all available components

## Available Components

- `Avatar` - User profile avatars
- `BottomSheet` - Modal bottom sheets
- `Button` - Primary action buttons
- `ButtonRound` - Circular action buttons
- `Card` - Container cards
- `Checkbox` - Checkboxes with animations
- `ContextMenu` - Context menus
- `Counter` - Number input counters
- `InputOTP` - OTP/PIN input fields
- `InputSearch` - Search input fields
- `InputText` - Text input fields
- `ListItem` - List items
- `PasscodeEntry` - Passcode entry interface
- `PhotoCarousel` - Image carousels
- `Radio` - Radio buttons
- `Slider` - Value sliders
- `SliderDual` - Range sliders
- `Switch` - Toggle switches
- `Text` - Styled text components

## Prerequisites

Your project needs these dependencies:

```bash
npm install react-native-unistyles@^3 react-native-edge-to-edge react-native-nitro-modules@0.29.4 react-native-gesture-handler@^2 react-native-reanimated@^3 react-native-svg@^14
```

The CLI will install these automatically when you run `init`, unless you use `--skip-deps`.

## How It Works

This CLI copies component source code directly into your project, giving you:

- ✅ **Full control** over the component code
- ✅ **No runtime dependencies** for the components
- ✅ **Easy customization** without breaking updates
- ✅ **TypeScript support** out of the box

## Project Structure

After running `init`, you'll have:

```
your-project/
├── craftrn-ui/
│   ├── themes/
│   │   ├── config.ts
│   │   └── unistyles.ts
│   └── components/
│       └── [added components]
```

## Documentation

- 📚 [Component Documentation](https://docs.craftreactnative.com/)
- 🎨 [Unistyles Documentation](https://www.unistyl.es/)
- 💎 [Premium Templates](https://craftreactnative.com/templates)

## License

MIT License - see the [LICENSE](https://github.com/craftreactnative/ui/blob/main/LICENSE) file for details.

## Repository

This CLI is part of the [CraftReactNative UI](https://github.com/craftreactnative/ui) project.
