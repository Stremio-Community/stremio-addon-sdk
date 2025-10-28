import { Router } from "express";
import cors from "cors";
import { createRouter, type AddonInterface } from "@stremio-addon/sdk";

export function getRouter(addonInterface: AddonInterface): Router {
  const expressRouter = Router();
  expressRouter.use(cors());
  expressRouter.use(async (expressRequest, expressResponse, next) => {
    // Convert an Express Request to a Request.
    const url = new URL(
      expressRequest.originalUrl,
      `http://${expressRequest.headers.host}`,
    );
    const req = new globalThis.Request(url, {
      method: expressRequest.method,
      headers: expressRequest.headers as HeadersInit,
      body: expressRequest.body,
    });

    // Route the request.
    const router = createRouter(addonInterface);
    const res = await router(req);

    // Convert Response back to to Express Response.
    expressResponse.status(res.status);
    res.headers.forEach((value, key) => {
      expressResponse.setHeader(key, value);
    });
    if (res.body) {
      const body = await res.text();
      expressResponse.send(body);
    }

    next();
  });
  return expressRouter;
}
