import { getRouter } from "@stremio-addon/runtime-node-express";
import { AddonBuilder } from "@stremio-addon/sdk";
import { serveHTTP } from "./serve-http.js";
import { publishToCentral } from "./publish-to-central.js";

export default {
  addonBuilder: AddonBuilder,
  serveHTTP,
  getRouter,
  publishToCentral,
};
