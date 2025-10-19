# Hello World Addon Example

This is a simple "Hello World" addon example for Stremio, demonstrating how to create a basic addon using the Stremio Addon SDK. This addon is based on [Stremio/addon-helloworld](https://github.com/Stremio/addon-helloworld).

## Getting Started

### Prerequisites

- Cloned this repository
- Node.js installed
- Installed and built all dependencies:

```bash
# Run from the project root:
pnpm install
pnpm run build
```

### Try the Addon

Build and start the addon:

```bash
pnpm --filter hello-world run build
pnpm --filter hello-world start
```
