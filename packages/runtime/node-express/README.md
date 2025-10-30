# @stremio-addon/node-express

> This package is part of [**Stremio-Community/stremio-addon-sdk**](https://github.com/Stremio-Community/stremio-addon-sdk).

Node.js + Express runtime adapter for the Community Stremio Addon SDK.

## Features

- 🚀 **Express integration** - Seamless integration with Express.js
- 🌐 **CORS enabled** - Pre-configured CORS middleware
- 🎯 **Type-safe** - Full TypeScript support
- 🔧 **Flexible** - Works with existing Express apps

## Installation

```bash
pnpm add @stremio-addon/node-express express
```

If using TypeScript:

```bash
pnpm add -D @types/express
```

## Usage

```typescript
import express from "express";
import { getRouter } from "@stremio-addon/node-express";
import { AddonBuilder } from "@stremio-addon/sdk";

// Create your addon
const builder = new AddonBuilder({
  id: "com.example.myaddon",
  version: "1.0.0",
  name: "My Addon",
  description: "My cool Stremio addon",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
});

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

const addonInterface = builder.getInterface();

// Create Express app
const app = express();

// Mount the addon router
app.use(getRouter(addonInterface));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Addon available at http://localhost:${PORT}/manifest.json`);
});
```

## API

### `getRouter(addonInterface)`

Creates an Express router configured to serve your addon with CORS enabled.

**Parameters:**

- `addonInterface` - The addon interface from `builder.getInterface()`

**Returns:** Express `Router` instance

## Examples

See the [hello-world example](../../../examples/hello-world/) for a complete working example.

## Related Packages

- [`@stremio-addon/sdk`](../../sdk) - Core SDK package
- [`@stremio-addon/node`](../node) - Basic Node.js runtime

## License

MIT
