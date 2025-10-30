# @stremio-addon/node

> This package is part of [**Stremio-Community/stremio-addon-sdk**](https://github.com/Stremio-Community/stremio-addon-sdk).

Node.js runtime adapter for the Community Stremio Addon SDK.

## Features

- 🚀 **Simple** - Minimal setup for Node.js HTTP server
- 🎯 **Type-safe** - Full TypeScript support
- 🔧 **Flexible** - Works with the built-in Node.js HTTP server

## Installation

```bash
pnpm add @stremio-addon/node
```

## Usage

```typescript
import { getRouter } from "@stremio-addon/node";
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

// Create and start the server
const server = getRouter(addonInterface);
server.listen(3000, () => {
  console.log("Addon server running at http://localhost:3000");
});
```

## API

### `getRouter(addonInterface)`

Creates a Node.js HTTP server instance configured to serve your addon.

**Parameters:**

- `addonInterface` - The addon interface from `builder.getInterface()`

**Returns:** `http.Server` instance

## Examples

See the [bare-bones-js example](../../../examples/bare-bones-js/) for a complete working example.

## Related Packages

- [`@stremio-addon/sdk`](../../sdk) - Core SDK package
- [`@stremio-addon/node-express`](../node-express) - Node.js with Express runtime

## License

MIT
