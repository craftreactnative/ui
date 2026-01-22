# @craftreactnative/ui

## 1.0.8

### Major Refactor

- [`cbd66fa`](https://github.com/craftreactnative/ui/commit/cbd66fa) Thanks [@alexmngn](https://github.com/alexmngn)! - **Refactor: Download components from GitHub instead of bundling**

  This major refactoring addresses a critical workflow issue where the CLI had to be republished to npm every time components changed, even when the CLI code itself wasn't modified.

  **Key Changes:**
  - Components are now downloaded from GitHub on first use
  - Intelligent cache system with 1-day staleness detection (auto-refreshes after 24 hours)
  - Added `--latest` flag to force download latest components, bypassing cache
  - Removed `copy-components` build step and `craftrn-ui` from package files
  - Added `tar` dependency for extracting GitHub tarballs
  - Improved error handling and user feedback during downloads

  **Benefits:**
  - ✅ No need to republish CLI when only components change
  - ✅ Users always get latest components (with smart 1-day cache)
  - ✅ Smaller CLI package size
  - ✅ Faster development workflow
  - ✅ Better offline support (graceful cache fallback)

  **Breaking Changes:**
  - None - this is a transparent improvement for end users

## 1.0.6

### Patch Changes

- [#1](https://github.com/craftreactnative/ui/pull/1) [`63a31d7`](https://github.com/craftreactnative/ui/commit/63a31d76e9ac2a7ca497447c1e735da372886c71) Thanks [@alexmngn](https://github.com/alexmngn)! - Update to unistyles v3

- [`141af06`](https://github.com/craftreactnative/ui/commit/141af06512000ac91ed371ef356cff37d3a0eb9f) Thanks [@alexmngn](https://github.com/alexmngn)! - add command to support new --all option

## 1.0.5

### Patch Changes

- [#1](https://github.com/craftreactnative/ui/pull/1) [`06dbb16`](https://github.com/craftreactnative/ui/commit/06dbb16071df0ea389f2061c9b98ed0f6eb52db7) Thanks [@alexmngn](https://github.com/alexmngn)! - Update to unistyles v3

## 1.0.4

### Patch Changes

- [`8e4cd6f`](https://github.com/craftreactnative/ui/commit/8e4cd6f2449acf7bf0233e356c33c920eb826424) Thanks [@alexmngn](https://github.com/alexmngn)! - Support dependency install from cli init

## 1.0.3

### Patch Changes

- [`00d53b4`](https://github.com/craftreactnative/ui/commit/00d53b4dda03aea13be3162c8f655af63abeb348) Thanks [@alexmngn](https://github.com/alexmngn)! - Add support for adding multiple components
