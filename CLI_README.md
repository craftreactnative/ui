# CraftReactNative UI CLI

[![npm version](https://img.shields.io/npm/v/@craftreactnative/ui.svg?style=for-the-badge)](https://www.npmjs.com/package/@craftreactnative/ui)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

A CLI tool for adding [CraftReactNative UI](https://github.com/craftreactnative/ui) components to your React Native projects. Copy-paste components built for [Unistyles](https://github.com/jpudysz/react-native-unistyles).

## Installation

```bash
npx @craftreactnative/ui init
```

## Quick Start

1. **Initialize** your project with themes and dependencies:
```bash
npx @craftreactnative/ui init
```

2. **Add components** to your project:
```bash
npx @craftreactnative/ui add button
npx @craftreactnative/ui add avatar card
```

## Commands

### `init`
Initialize your project with Unistyles themes and install required dependencies.

```bash
npx @craftreactnative/ui init
```

**Options:**
- `--skip-deps` - Skip installing dependencies

### `add <components...>`
Add one or more components to your project.

```bash
npx @craftreactnative/ui add button
npx @craftreactnative/ui add avatar card slider
```

## Available Components

- `avatar` - User profile avatars
- `bottom-sheet` - Modal bottom sheets
- `button` - Primary action buttons
- `button-round` - Circular action buttons
- `card` - Container cards
- `checkbox` - Checkboxes with animations
- `context-menu` - Context menus
- `counter` - Number input counters
- `input-otp` - OTP/PIN input fields
- `input-search` - Search input fields
- `input-text` - Text input fields
- `list-item` - List items
- `passcode-entry` - Passcode entry interface
- `photo-carousel` - Image carousels
- `radio` - Radio buttons
- `slider` - Value sliders
- `slider-dual` - Range sliders
- `switch` - Toggle switches
- `text` - Styled text components

## Prerequisites

Your project needs these dependencies:

```bash
npm install react-native-reanimated@^3 react-native-gesture-handler@^2 react-native-svg@^14 react-native-unistyles@^2
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
- 🎨 [Unistyles Documentation](https://v2.unistyl.es/)
- 💎 [Premium Templates](https://craftreactnative.com/templates)

## License

MIT License - see the [LICENSE](https://github.com/craftreactnative/ui/blob/main/LICENSE) file for details.

## Repository

This CLI is part of the [CraftReactNative UI](https://github.com/craftreactnative/ui) project.