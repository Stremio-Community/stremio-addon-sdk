# @stremio-addon/zod

> This package is part of [**Stremio-Community/stremio-addon-sdk**](https://github.com/Stremio-Community/stremio-addon-sdk).

Validation package for the Community Stremio Addon SDK using `zod`.

## Features

- ✅ **Runtime validation** - Validates addon manifest and responses using Zod schemas
- 🎯 **Type-safe** - Full TypeScript support with inferred types from Zod schemas
- 🚀 **Modern** - Popular validation library

## Installation

```bash
pnpm add @stremio-addon/zod zod
```

## Usage

```typescript
import { AddonBuilder } from "@stremio-addon/zod";

// The AddonBuilder from this package automatically validates
// your manifest against the Zod schema
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

- `AddonBuilder` - Extended builder that validates manifests using `zod`
- `manifestSchema` - Zod schema for addon manifests

## Related Packages

- [`@stremio-addon/sdk`](../../sdk) - Core SDK package
- [`@stremio-addon/linter`](../linter) - Alternative validation using `stremio-addon-linter`

## License

MIT
