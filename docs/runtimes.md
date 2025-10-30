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

> [!WARNING]  
> This section is a work in progress. Contributions and documentation improvements are welcome!

### Installation

```bash
pnpm add hono hono/cors
```

### Adapter Code

```typescript
// hono-adapter.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

export function getRouter(addonInterface: AddonInterface) {
  const app = new Hono();
  app.use("/*", cors());

  app.all("/*", async (c) => {
    const router = createRouter(addonInterface);
    const response = await router(c.req.raw);
    return response || c.notFound();
  });

  return app;
}
```

## Cloudflare Workers

> [!WARNING]  
> This section is a work in progress. Contributions and documentation improvements are welcome!

### Installation

```bash
pnpm add wrangler
```

### Adapter Code

```typescript
// cloudflare-adapter.ts
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

export function getRouter(addonInterface: AddonInterface) {
  const router = createRouter(addonInterface);

  return async (request: Request): Promise<Response> => {
    const response = await router(request);

    if (response) {
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    return new Response("Not Found", { status: 404 });
  };
}
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
4. Add CORS headers

Most serverless platforms can skip step 1 and 3 since they use standard `Request`/`Response` objects already.

### Key Points

- **CORS**: Always enable CORS headers for Stremio web app access
- **Null handling**: `createRouter` returns `null` when no route matches
- **Headers**: Preserve all response headers from the SDK
- **Standard APIs**: Use Web Standard `Request`/`Response` objects

### Resources

- [Web Request API](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Web Response API](https://developer.mozilla.org/en-US/docs/Web/API/Response)
