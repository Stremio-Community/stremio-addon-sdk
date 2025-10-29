# Hello World Addon Example

This is a simple "Hello World" addon example for Stremio, demonstrating how to create a basic addon using the Stremio Addon SDK. This addon is based on [Stremio/addon-helloworld](https://github.com/Stremio/addon-helloworld).

This example uses the following packages from this repository:

- `@stremio-addon/sdk` - Core SDK functionalities
- `@stremio-addon/validation-zod` - For manifest validation using Zod
- `@stremio-addon/runtime-node-express` - For running the addon server with Node.js and Express

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
pnpm --filter hello-world run build
pnpm --filter hello-world start
```

Install the addon to Stremio: `http://localhost:3000/manifest.json`.
