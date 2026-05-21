# Frontend / Configuration UI

**Frontends are out of scope for this SDK.** We don't ship a default HTML page, configuration UI, or landing page with the core packages.

## Why

Addons vary wildly in what they need from a frontend; some need none, some need a simple install page, others need a full configuration UI. We don't want to lock you into a stack (plain HTML, React, Vue, Svelte, etc.) or ship dead bytes for addons that don't need a UI at all.

The only exception is [`@stremio-addon/compat`](../packages/compat/), which ships Stremio's default HTML landing page to keep drop-in compatibility with the official SDK.

## Adding your own frontend

Build your UI with whatever stack you prefer and export it to static files, then serve that `static/` (or `dist/`, `public/`, ...) folder from your runtime alongside the addon router.

### Node.js + Express

```typescript
import express from "express";
import { getRouter } from "@stremio-addon/node-express";
import { addonInterface } from "./addon.js";

const app = express();
app.use(express.static("public")); // your built frontend
app.use(getRouter(addonInterface));

app.listen(3000);
```

### Hono

```typescript
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { addonInterface } from "./addon.js";
import { getRouter } from "./router.js";

const app = new Hono();
app.use("/*", serveStatic({ root: "./public" }));
app.route("/", getRouter(addonInterface));

export default app;
```

### Cloudflare Workers / Vercel / other serverless

Use the platform's native static asset hosting (Workers Assets, Vercel's `public/` directory, etc.) and mount the addon router for the addon routes (`/manifest.json`, `/stream/...`, etc.).

## Linking install from your UI

Point users at `stremio://<your-host>/manifest.json` (or `https://...` to open the web installer).
