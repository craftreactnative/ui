# Release Notes - v1.0.8

## 🚀 Major Refactoring: GitHub-Based Component Distribution

This release introduces a significant architectural improvement to how components are distributed, solving a major workflow pain point.

## 🎯 Problem Solved

Previously, every time components were updated, the CLI package had to be republished to npm - even when the CLI code itself didn't change. This created unnecessary friction in the development workflow.

## ✨ What's New

### GitHub-Based Component Downloads
- Components are now downloaded directly from GitHub on first use
- No more bundling components in the npm package
- Components are always up-to-date from the repository

### Smart Caching System
- **1-Day Cache**: Components are cached locally for 24 hours
- **Auto-Refresh**: Cache automatically refreshes after 1 day
- **Fast Performance**: Subsequent commands use cached version (instant)
- **Offline Support**: Gracefully falls back to cache if GitHub is unavailable

### New `--latest` Flag
```bash
npx @craftreactnative/ui add Button --latest
```
Force download the latest components, bypassing the cache entirely.

## 📦 Package Improvements

- **Smaller Package Size**: Removed bundled components from npm package
- **Faster Builds**: No more component copying step during build
- **Cleaner Structure**: Simplified build process

## 🔧 Technical Details

### Changes
- Added `github-downloader.ts` utility for downloading and extracting components
- Implemented cache metadata system with timestamp tracking
- Added redirect handling for GitHub tarball downloads
- Improved error handling and user feedback

### Dependencies
- Added `tar@^7.0.0` for extracting GitHub tarballs

### Removed
- `copy-components` build script
- `craftrn-ui` directory from package files

## 🎉 Benefits

### For Developers
- ✅ No more republishing CLI for component updates
- ✅ Faster iteration cycle
- ✅ Simpler build process

### For Users
- ✅ Always get latest components (with smart caching)
- ✅ Faster CLI package downloads
- ✅ Better offline experience

## 📝 Migration

**No migration needed!** This is a transparent improvement. Existing users will automatically benefit from the new system on their next CLI usage.

## 🔗 Links

- [Full Changelog](https://github.com/craftreactnative/ui/blob/main/cli/CHANGELOG.md)
- [GitHub Repository](https://github.com/craftreactnative/ui)

---

**Release Date**: January 22, 2025  
**Tag**: [v1.0.8](https://github.com/craftreactnative/ui/releases/tag/v1.0.8)
