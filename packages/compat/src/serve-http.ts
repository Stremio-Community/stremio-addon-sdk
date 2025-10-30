import { getRouter } from "@stremio-addon/node-express";
import type { AddonInterface } from "@stremio-addon/sdk";
import express from "express";
import open from "open";
import { join } from "path";
import { existsSync } from "fs";
import { landingTemplate } from "./landing-template.js";
import type { AddressInfo } from "net";

export type Options = {
  port?: number;
  static?: string;
  cacheMaxAge?: number;
  /**
   * @deprecated use cacheMaxAge instead
   */
  cache?: number;
};

export function serveHTTP(addonInterface: AddonInterface, opts: Options = {}) {
  const cacheMaxAge = opts.cacheMaxAge || opts.cache;

  if (cacheMaxAge && cacheMaxAge > 365 * 24 * 60 * 60) {
    console.warn(
      "cacheMaxAge set to more then 1 year, be advised that cache times are in seconds, not milliseconds.",
    );
  }

  const app = express();
  app.use(getRouter(addonInterface, { cacheMaxAge: opts.cacheMaxAge }));

  // serve static dir
  if (opts.static) {
    const location = join(process.cwd(), opts.static);
    if (!existsSync(location)) {
      throw new Error("directory to serve does not exist");
    }
    app.use(opts.static, express.static(location));
  }

  const hasConfig = !!(addonInterface.manifest.config || []).length;

  // landing page
  const landingHTML = landingTemplate(addonInterface.manifest);
  app.get("/", (_, res) => {
    if (hasConfig) {
      res.redirect("/configure");
    } else {
      res.setHeader("content-type", "text/html");
      res.end(landingHTML);
    }
  });

  if (hasConfig)
    app.get("/configure", (_, res) => {
      res.setHeader("content-type", "text/html");
      res.end(landingHTML);
    });

  const server = app.listen(opts.port);
  return new Promise(function (resolve, reject) {
    server.on("listening", function () {
      const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/manifest.json`;
      console.log("HTTP addon accessible at:", url);
      if (process.argv.includes("--launch")) {
        const base = "https://staging.strem.io#";
        //const base = 'https://app.strem.io/shell-v4.4#'
        const installUrl = `${base}?addonOpen=${encodeURIComponent(url)}`;
        open(installUrl);
      }
      if (process.argv.includes("--install")) {
        open(url.replace("http://", "stremio://"));
      }
      resolve({ url, server });
    });
    server.on("error", reject);
  });
}
