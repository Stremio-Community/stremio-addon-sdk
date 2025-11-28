import { Router } from "express";
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

export type Options = {
  cacheMaxAge?: number;
};

export function getRouter(
  addonInterface: AddonInterface,
  options: Options = {},
): Router {
  const expressRouter = Router();
  expressRouter.use((_, res, next) => {
    const cacheMaxAge = options.cacheMaxAge;

    if (cacheMaxAge && !res.getHeader("Cache-Control")) {
      res.setHeader("Cache-Control", `max-age=${cacheMaxAge}, public`);
    }

    next();
  });
  expressRouter.use(async (expressRequest, expressResponse, next) => {
    // Convert an Express Request to a Request.
    const url = new URL(
      expressRequest.url,
      `http://${expressRequest.headers.host || "localhost"}`,
    );
    const req = new globalThis.Request(url, {
      method: expressRequest.method,
      headers: expressRequest.headers as HeadersInit,
      body: expressRequest.body,
    });

    // Route the request.
    const router = createRouter(addonInterface);
    const res = await router(req);

    if (res) {
      // Convert Response back to to Express Response.
      expressResponse.status(res.status);
      res.headers.forEach((value, key) => {
        expressResponse.setHeader(key, value);
      });
      if (res.body) {
        const body = await res.text();
        expressResponse.send(body);
      }
    }

    next();
  });
  return expressRouter;
}
