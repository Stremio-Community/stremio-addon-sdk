# @stremio-addon/sdk

> This package is part of [**Stremio-Community/stremio-addon-sdk**](https://github.com/Stremio-Community/stremio-addon-sdk).

Core SDK package for building Stremio addons with TypeScript (or JavaScript).

## Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Runtime validation** - Optional schema validation support
- 🚀 **Modern** - ESM-first, tree-shakeable
- 🧩 **Framework-agnostic** - Works with any server framework or serverless platform

## Installation

```bash
pnpm add @stremio-addon/sdk
```

## Usage

### Basic Example

```typescript
import { AddonBuilder, createRouter } from "@stremio-addon/sdk";

// Define your addon manifest
const manifest = {
  id: "com.example.myaddon",
  version: "1.0.0",
  name: "My Addon",
  description: "My cool Stremio addon",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
};

// Create the addon builder
const builder = new AddonBuilder(manifest);

// Define handlers
builder.defineStreamHandler(async ({ type, id }) => {
  return {
    streams: [
      {
        url: "https://example.com/stream.mp4",
        title: "Example Stream",
      },
    ],
  };
});

// Get the addon interface
const addonInterface = builder.getInterface();

// Create a router (returns a Web Standard Request -> Response handler)
const router = createRouter(addonInterface);
```

### Handler Methods

- `defineStreamHandler(handler)` - Handle stream requests
- `defineMetaHandler(handler)` - Handle metadata requests
- `defineCatalogHandler(handler)` - Handle catalog requests
- `defineSubtitlesHandler(handler)` - Handle subtitle requests

### Router

The `createRouter` function creates a Web Standard Request -> Response handler that can be used with any server framework or serverless platform:

```typescript
const router = createRouter(addonInterface);
const response = await router(request); // Returns Response | null
```

## Runtime Integration

This package provides the core functionality, but you'll need a runtime adapter to serve your addon.

**Server**

- Node.js: [`@stremio-addon/node`](../runtime/node)
- Node.js + Express: [`@stremio-addon/node-express`](../runtime/node-express)

**Serverless**

- See [docs/runtimes.md](../../docs/runtimes.md)

**Custom**

- See [docs/runtimes.md](../../docs/runtimes.md)

## Validation

Add runtime validation by using a validation package:

- **Zod**: [`@stremio-addon/zod`](../validation/zod)
- **Linter**: [`@stremio-addon/linter`](../validation/linter)

## Examples

See the [examples](../../examples/) directory for complete working examples.

## License

MIT
