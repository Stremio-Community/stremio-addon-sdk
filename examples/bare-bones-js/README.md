# Bare Bones JS Addon Example

> [!WARNING]
> We don't recommend using this setup for production addons.

This minimal addon example is based on [Stremio/stremio-addon-sdk/examples/from-readme.js](https://github.com/Stremio/stremio-addon-sdk/blob/8ee6e43fde9eab9452791f96f03f7cdfda8512eb/examples/from-readme.js) and uses only the following packages:

- `@stremio-addon/sdk` - Core SDK functionalities
- `@stremio-addon/node`- For running the addon server with Node.js

## Usage

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
pnpm --filter bare-bones-js start
```

Install the addon to Stremio: `http://localhost:43001/manifest.json`.
