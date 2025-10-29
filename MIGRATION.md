# Migration Guide

This guide will help you migrate from the official `stremio-addon-sdk` to the Community Stremio Addon SDK.

## 📥 Import Changes

The main difference is in how you import the SDK modules.

### Official SDK

```javascript
const { addonBuilder } = require("stremio-addon-sdk");
// or
import { addonBuilder } from "stremio-addon-sdk";
```

### Community SDK

```typescript
import { AddonBuilder } from "@stremio-addon/validation-zod";
import { getRouter } from "@stremio-addon/runtime-node-express";
```

## 🖥️ Runtime Setup

You now get to choose your preferred runtime (e.g., Express, Hono or something else), whereas the official SDK forces you to use a specific version of express that comes bundled with it.

### Official SDK

```javascript
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder(manifest);
// ... define handlers

serveHTTP(builder.getInterface(), { port: 7000 });
```

### Community SDK

```typescript
import express from "express";
import { AddonBuilder } from "@stremio-addon/validation-zod";
import { getRouter } from "@stremio-addon/runtime-node-express";

const builder = new AddonBuilder(manifest);
// ... define handlers

const app = express();
const port = process.env.PORT ? +process.env.PORT : 3000;

app.use("/", getRouter(builder.getInterface()));

app.listen(port, () => {
  console.log(`Addon listening at http://localhost:${port}`);
});
```

- Use `getRouter()` instead of `serveHTTP()`
- Set up Express server manually (more flexibility)
- Can add custom middleware and routes

## 🎯 Type Safety Improvements

### Typed Handlers

The Community SDK provides full type safety for handler arguments and return values:

```typescript
import { type StreamHandler } from "@stremio-addon/validation-zod";

// Fully typed handler
const streamHandler: StreamHandler = async ({ type, id }) => {
  // 'type' and 'id' are typed
  // Return type is validated
  return { streams: [] };
};

builder.defineStreamHandler(streamHandler);
```

### Typed Schema Objects

Use types to ensure your data matches the expected schemas:

```typescript
import {
  type StreamSchema,
  type MetaPreviewSchema,
} from "@stremio-addon/validation-zod";

const stream: StreamSchema = {
  name: "HD Stream",
  url: "https://example.com/stream.mp4",
  // IDE will autocomplete properties and check types
};

const meta: MetaPreviewSchema = {
  id: "tt1234567",
  type: "movie",
  name: "Example Movie",
  poster: "https://example.com/poster.jpg",
};
```

## 🔧 Common Patterns

### Before: Official SDK

```javascript
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "com.example.addon",
  version: "1.0.0",
  name: "Example Addon",
  resources: ["stream", "meta"],
  types: ["movie"],
  idPrefixes: ["tt"],
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(function (args) {
  if (args.type === "movie" && args.id === "tt1254207") {
    return Promise.resolve({
      streams: [{ url: "http://example.com/stream.mp4" }],
    });
  }
  return Promise.resolve({ streams: [] });
});

builder.defineMetaHandler(function (args) {
  if (args.type === "movie" && args.id === "tt1254207") {
    return Promise.resolve({
      meta: {
        id: "tt1254207",
        type: "movie",
        name: "Big Buck Bunny",
      },
    });
  }
  return Promise.resolve({ meta: null });
});

serveHTTP(builder.getInterface(), { port: 7000 });
```

### After: Community SDK

```typescript
import express from "express";
import {
  AddonBuilder,
  type ManifestSchema,
} from "@stremio-addon/validation-zod";
import { getRouter } from "@stremio-addon/runtime-node-express";

const manifest: ManifestSchema = {
  id: "com.example.addon",
  version: "1.0.0",
  name: "Example Addon",
  resources: ["stream", "meta"],
  types: ["movie"],
  idPrefixes: ["tt"],
};

// Your manifest will be validated at runtime using zod.
const builder = new AddonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  if (type === "movie" && id === "tt1254207") {
    return {
      streams: [{ url: "http://example.com/stream.mp4" }],
    };
  }
  return { streams: [] };
});

builder.defineMetaHandler(async ({ type, id }) => {
  if (type === "movie" && id === "tt1254207") {
    return {
      meta: {
        id: "tt1254207",
        type: "movie",
        name: "Big Buck Bunny",
      },
    };
  }
  return { meta: null };
});

const addonInterface = builder.getInterface();

const app = express();
const port = process.env.PORT ? +process.env.PORT : 7000;

app.use("/", getRouter(addonInterface));

app.listen(port, () => {
  console.log(`Addon listening at http://localhost:${port}`);
});
```

## 📝 Step-by-Step Migration Example

Let's migrate a complete addon:

### Step 1: Update dependencies

```bash
# Remove old SDK
npm uninstall stremio-addon-sdk @types/stremio-addon-sdk

# Install new SDK with zod validation and express runtime
npm install @stremio-addon/sdk @stremio-addon/validation-zod @stremio-addon/runtime-node-express
npm install express zod
npm install -D @types/express typescript
```

### Step 2: Update package.json

```json
{
  "type": "module",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### Step 3: Update tsconfig.json (only if using TypeScript)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Step 4: Update your addon code

Follow the patterns shown in the [Common Patterns](#-common-patterns) section above.

### Step 5: Test your addon

```bash
npm build
npm start
```

Visit `http://localhost:3000/manifest.json` to verify your addon is working.

## 📚 Additional Resources

- [README](./README.md) - Overview and features
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Examples](./examples/) - Sample addons
- [Official Stremio Docs](https://github.com/Stremio/stremio-addon-sdk/tree/master/docs) - Stremio concepts

## 🆘 Need Help?

- Open an [issue](https://github.com/Stremio-Community/stremio-addon-sdk/issues) if you encounter problems
- Check existing [discussions](https://github.com/Stremio-Community/stremio-addon-sdk/discussions) for Q&A
- Review the [examples](./examples/) for working code

Happy migrating! 🚀
