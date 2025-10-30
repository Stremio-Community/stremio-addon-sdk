# @stremio-addon/linter

> This package is part of [**Stremio-Community/stremio-addon-sdk**](https://github.com/Stremio-Community/stremio-addon-sdk).

Validation package for the Community Stremio Addon SDK using the official `stremio-addon-linter`.

## Features

- ✅ **Runtime validation** - Validates addon manifest using the official Stremio linter
- 🔗 **Compatible** - Uses the same validation as the official Stremio Addon SDK
- 🎯 **Type-safe** - Full TypeScript support

## Installation

```bash
pnpm add @stremio-addon/linter stremio-addon-linter
```

## Usage

```typescript
import { AddonBuilder } from "@stremio-addon/linter";

// The AddonBuilder from this package automatically validates
// your manifest using stremio-addon-linter
const builder = new AddonBuilder({
  id: "com.example.myaddon",
  version: "1.0.0",
  name: "My Addon",
  description: "My cool Stremio addon",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
});

// Define handlers as usual
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
```

## API

This package exports:

- `AddonBuilder` - Extended builder that validates manifests using `stremio-addon-linter`
- `manifestSchema` - Linter-based validation schema

## Related Packages

- [`@stremio-addon/sdk`](../../sdk) - Core SDK package
- [`@stremio-addon/zod`](../zod) - Alternative validation using Zod

## License

MIT
