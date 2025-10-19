import { getRouter } from "@stremio-addon/runtime-node-express";
import { addonInterface } from "./addon.js";
import express from "express";

const app = express();
const port = process.env.PORT ? +process.env.PORT : 3000;

app.use("/", getRouter(addonInterface));

app.listen(port, () => {
  console.log(`Hello World Addon listening at http://localhost:${port}`);
});
