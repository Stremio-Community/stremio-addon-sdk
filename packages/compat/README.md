# @stremio-addon/compat

> This package is part of [**Stremio-Community/stremio-addon-sdk**](https://github.com/Stremio-Community/stremio-addon-sdk).

Drop-in compatibility layer for migrating from the official Stremio Addon SDK to the community Stremio Addon SDK.

## Features

- 🔄 **Easy migration** - Drop-in replacement for the official SDK
- ✅ **Compatible API** - Same interface as `stremio-addon-sdk`
- 🚀 **Modern foundation** - Powered by the new community SDK packages

## Installation

```bash
pnpm add @stremio-addon/compat
```

## Usage

Replace your import from `stremio-addon-sdk` with `@stremio-addon/compat`:

```typescript
// Before (official SDK)
import { addonBuilder, serveHTTP, getRouter } from "stremio-addon-sdk";

// After (community SDK)
import { addonBuilder, serveHTTP, getRouter } from "@stremio-addon/compat";

// The rest of your code stays the same!
const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  return { streams: [...] };
});

serveHTTP(builder.getInterface(), { port: 3000 });
```

## What's Included

This package provides:

- `addonBuilder` - Compatible with the official SDK's `addonBuilder`
- `serveHTTP` - Function to serve your addon over HTTP
- `getRouter` - Express router factory
- `publishToCentral` - Function to publish to the Stremio addon catalog

## Migration Path

This compatibility package makes it easy to migrate gradually:

1. **Phase 1**: Replace `stremio-addon-sdk` with `@stremio-addon/compat`
2. **Phase 2**: Gradually adopt new features from the community SDK
3. **Phase 3**: Eventually migrate to direct usage of `@stremio-addon/sdk`

For a detailed migration guide, see [MIGRATION.md](../../../MIGRATION.md).

## Architecture

Under the hood, this package uses:

- [`@stremio-addon/sdk`](../sdk) - Core SDK
- [`@stremio-addon/linter`](../validation/linter) - Validation (same as official SDK)
- [`@stremio-addon/node-express`](../runtime/node-express) - Express integration

## Related Packages

- [`@stremio-addon/sdk`](../sdk) - Core SDK package (recommended for new projects)
- [Official Stremio Addon SDK](https://github.com/Stremio/stremio-addon-sdk) - Original SDK

## License

MIT
