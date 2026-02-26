# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

- **React**: All files outside `/compiler/` (this document applies here)
- **React Compiler**: `/compiler/` directory has its own CLAUDE.md with separate instructions

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `/packages/` | Publishable packages (react, react-dom, scheduler, etc.) |
| `/scripts/` | Build, test, and development scripts |
| `/fixtures/` | Test applications for manual testing |
| `/compiler/` | React Compiler (separate sub-project) |

## Key Packages

| Package | Purpose |
|---------|---------|
| `react` | Core React library |
| `react-dom` | DOM renderer |
| `react-reconciler` | Core reconciliation algorithm (Fiber architecture) |
| `scheduler` | Cooperative scheduling |
| `shared` | Shared utilities and feature flags |
| `react-server-dom-*` | Server Components implementations |
| `react-devtools-*` | Developer Tools |
| `react-refresh` | Fast Refresh runtime |

## Requirements

- **Node**: Must be installed
- **Package Manager**: Use `yarn` only (specified in package.json: `yarn@1.22.22`)

## Common Commands

### Testing

```bash
# Run all tests (experimental channel by default)
yarn test

# Run tests for specific release channel
yarn test-stable          # Stable channel
yarn test-www             # www-modern channel
yarn test-classic         # www-classic channel

# Run specific test file
yarn test <test-file-path>

# Run tests matching a pattern
yarn test <pattern>

# Run tests with additional Jest flags
yarn test --watch         # Watch mode
yarn test --coverage      # Coverage report
```

### Linting and Formatting

```bash
# Lint code
yarn lint

# Format changed files
yarn prettier

# Format all files
yarn prettier-all

# Check formatting without changes
yarn prettier-check
```

### Type Checking

```bash
# Run Flow type checker
yarn flow

# Run Flow in CI mode
yarn flow-ci
```

### Feature Flags

```bash
# Check feature flag states
yarn flags

# Compare flags between channels
yarn flags --diff experimental stable

# Output flags as CSV
yarn flags --csv
```

### Building

```bash
# Build all release channels (usually handled by CI)
yarn build

# Build for DevTools
yarn build-for-devtools
```

### Error Codes

```bash
# Extract error messages (run after adding new error messages)
yarn extract-errors
```

## Architecture Overview

### Fiber Reconciler

The core of React's reconciliation algorithm lives in `packages/react-reconciler/src/`. Key files:

- **ReactFiberWorkLoop.js** - Main work loop that processes fiber tree
- **ReactFiberBeginWork.js** - Begin phase of fiber processing
- **ReactFiberCompleteWork.js** - Complete phase of fiber processing
- **ReactFiberCommitWork.js** - Commit phase that applies changes to DOM
- **ReactFiberHooks.js** - Implementation of React Hooks
- **ReactFiber.js** - Fiber node creation and management
- **ReactFiberLane.js** - Priority and scheduling system using lanes

### Feature Flags

Feature flags are defined in `packages/shared/ReactFeatureFlags.js` and control experimental features. Flags are configured differently per release channel (experimental, stable, www, etc.) via forks in `packages/shared/forks/`.

### Release Channels

React has multiple release channels with different feature flag configurations:

- **experimental** - Latest features, used for testing
- **stable** - Production-ready features
- **www-modern** - Facebook's modern www bundle
- **www-classic** - Facebook's legacy www bundle
- **xplat** - Cross-platform (React Native)

### Test Infrastructure

Tests use Jest and are configured in `scripts/jest/`:

- **config.source.js** - Main test configuration
- **config.build.js** - Tests for built artifacts
- **jest-cli.js** - Custom Jest CLI wrapper with release channel support

Tests can use `@gate` pragmas to conditionally run based on feature flags:

```javascript
// @gate enableSomeFeature
test('some feature', () => {
  // This test only runs when enableSomeFeature is true
});
```

### Build System

The build system uses Rollup (configured in `scripts/rollup/`) to create multiple bundle formats:

- **NODE_DEV** - Development builds for Node.js
- **NODE_PROD** - Production builds for Node.js
- **UMD_DEV** - Development UMD bundles for browsers
- **UMD_PROD** - Production UMD bundles for browsers
- **ESM_PROD** - ES modules for modern bundlers

## Development Workflow

### Before Committing

**IMPORTANT**: Always run `/verify` to validate all changes before committing. This runs:
- Linting
- Type checking
- Tests
- Other validation checks

### Making Changes

1. Make your code changes
2. Run `/fix` to lint and format code
3. Run `/test` to run relevant tests
4. Run `/flow` if you modified Flow types
5. Run `/verify` before committing

### Adding New Error Messages

When adding new error messages to React:

1. Add the error message in the code
2. Run `yarn extract-errors` to generate error codes
3. Commit both the code and the generated error codes

### Working with Feature Flags

Use `/flags` to check feature flag states across channels. When adding a new feature:

1. Add the flag to `packages/shared/ReactFeatureFlags.js`
2. Configure the flag for each channel in `packages/shared/forks/`
3. Use `@gate` pragmas in tests to conditionally run tests

## Important Notes

- Builds are typically handled by CI; avoid running locally unless necessary
- The codebase uses Flow for type checking (not TypeScript)
- Tests are organized by package in `packages/*/src/__tests__/`
- The reconciler is renderer-agnostic; renderers (DOM, Native, etc.) implement a host config
- React uses a custom error code system to minimize bundle size in production
