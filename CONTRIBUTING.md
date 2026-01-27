# Contributing to CraftReactNative UI

Thank you for your interest in contributing to CraftReactNative UI! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/craftreactnative/ui/issues/new?template=bug_report.md) with:

- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (React Native version, Expo version, etc.)

### Suggesting Features

Have an idea for a new component or feature? [Open a feature request](https://github.com/craftreactnative/ui/issues/new?template=feature_request.md) with:

- A clear description of the feature
- Use cases and examples
- Why this would be valuable

### Adding Components

New components are always welcome! Here's how to add one:

1. **Check existing components** - Make sure the component doesn't already exist
2. **Follow the structure** - Use existing components as a template
3. **Include documentation** - Add usage examples and prop descriptions
4. **Add to CLI** - Update the CLI to include your component
5. **Create a demo** - Add a demo screen in the demo app

### Component Guidelines

- ✅ Use TypeScript with proper types
- ✅ Support dark/light mode via Unistyles
- ✅ Follow accessibility best practices
- ✅ Include comprehensive prop types
- ✅ Add JSDoc comments for IDE support
- ✅ Keep components focused and composable
- ✅ Use React Native best practices

### Code Style

- Use TypeScript
- Follow existing code formatting (Prettier)
- Write clear, descriptive variable names
- Add comments for complex logic
- Keep components small and focused

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-component`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing component'`)
6. Push to the branch (`git push origin feature/amazing-component`)
7. Open a Pull Request

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Component works in both light and dark mode
- [ ] TypeScript types are complete
- [ ] Documentation is updated
- [ ] Demo screen is added/updated
- [ ] Component is added to CLI
- [ ] No console errors or warnings

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/craftreactnative/ui.git
   cd craftrn-ui
   ```

2. Install dependencies:
   ```bash
   cd cli
   npm install
   cd ../demo-app
   npm install
   ```

3. Build the CLI:
   ```bash
   cd cli
   npm run build
   ```

4. Test locally:
   ```bash
   npm run test:local
   ```

5. Run the demo app:
   ```bash
   cd demo-app
   npx expo start
   ```

## Questions?

- 💬 [GitHub Discussions](https://github.com/craftreactnative/ui/discussions)
- 🐛 [Open an Issue](https://github.com/craftreactnative/ui/issues)

Thank you for contributing! 🎉
