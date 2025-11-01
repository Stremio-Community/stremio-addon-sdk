# Supported Runtimes

We provide runtime adapters for popular server frameworks and platforms.

Since serverless platforms are very easily supported, we don't provide dedicated packages for them but include example adapter code snippets for your to copy paste into your code base instead. Server frameworks, on the other hand, often require more boilerplate and setup, so we provide dedicated packages for those.

To implement your own custom runtime adapter, see the [custom](#custom) section below.

## Node.js

### Installation

```bash
pnpm add @stremio-addon/node
```

### Usage

See [examples/bare-bones-js](../examples/bare-bones-js/).

## Node.js + Express

### Installation

```bash
pnpm add @stremio-addon/node-express express
# (Optional) if using TypeScript:
pnpm add -D @types/express
```

### Usage

See [examples/hello-world](../examples/hello-world/).

## Hono

### Installation

See the [Hono documentation](https://hono.dev/docs/) to set up your project.

### Adapter Code

```typescript
import { Hono } from "hono";
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

export function getRouter(addonInterface: AddonInterface) {
  const router = createRouter(addonInterface);

  const honoRouter = new Hono();
  honoRouter.use(async (c, next) => {
    const req = c.req.raw;
    const res = await router(req);
    if (res) {
      c.res = res;
    }
    next();
  });

  return honoRouter;
}
```

### usage

```typescript
import { Hono } from "hono";
import { addonInterface } from "./addon.js";
import { getRouter } from "./router.js";

const addonRouter = getRouter(addonInterface);

const app = new Hono();

app.route("/", addonRouter);

export default app;
```

## Cloudflare Workers

### Installation

See the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/get-started/guide/) to set up your project.

### Adapter Code

```typescript
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

export function getRouter(addonInterface: AddonInterface) {
  const router = createRouter(addonInterface);

  return async (request: Request): Promise<Response> => {
    const response = await router(request);
    return response ?? new Response("Not Found", { status: 404 });
  };
}
```

### Usage

```typescript
import { getRouter } from "./router.js";
import { addonInterface } from "./addon.js";

const addonRouter = getRouter(addonInterface);

export default {
  async fetch(request: Request): Promise<Response> {
    return addonRouter(request);
  },
};
```

## Custom

Runtime adapters bridge the SDK's framework-agnostic `createRouter` function with your preferred server framework or serverless platform.

### How It Works

```typescript
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

const router = createRouter(addonInterface);
const response = await router(request); // Returns Response | null
```

An adapter must:

1. Convert framework request -> standard `Request`
2. Call `createRouter(addonInterface)(request)`
3. Convert standard `Response` -> framework response

Most serverless platforms can skip step 1 and 3 since they use standard `Request`/`Response` objects already.

### Key Points

- **Null handling**: `createRouter` returns `null` when no route matches
- **Standard APIs**: Use Web Standard `Request`/`Response` objects
- **Headers**: Preserve all response headers from the SDK

### Resources

- [Web Request API](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Web Response API](https://developer.mozilla.org/en-US/docs/Web/API/Response)
