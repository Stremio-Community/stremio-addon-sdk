import { getRouter } from "@stremio-addon/node-express";
import { AddonBuilder } from "@stremio-addon/validation-addon-linter";
import { serveHTTP } from "./serve-http.js";
import { publishToCentral } from "./publish-to-central.js";

export default {
  addonBuilder: AddonBuilder,
  serveHTTP,
  getRouter,
  publishToCentral,
};
