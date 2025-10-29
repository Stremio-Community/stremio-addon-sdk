import { createRouter, type AddonInterface } from "@stremio-addon/sdk";
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { toRequest } from "./utils.js";

export function getRouter(
  addonInterface: AddonInterface,
): Server<typeof IncomingMessage, typeof ServerResponse> {
  const router = createRouter(addonInterface);
  const server = createServer(async (nodeRequest, nodeResponse) => {
    const req = toRequest(nodeRequest);

    try {
      const res = await router(req);

      if (!res) {
        nodeResponse.writeHead(404, { "Content-Type": "text/plain" });
        nodeResponse.end("Not Found");
        return;
      }

      res.headers.forEach((value, key) => {
        nodeResponse.setHeader(key, value);
      });
      nodeResponse.writeHead(res.status);

      if (!res.body) {
        nodeResponse.end();
        return;
      }

      const reader = res.body.getReader();
      reader.read().then(function processText({ done, value }): any {
        if (done) {
          nodeResponse.end();
          return;
        }
        nodeResponse.write(Buffer.from(value));
        return reader.read().then(processText);
      });
    } catch (err) {
      console.error("Error handling request:", err);
      nodeResponse.writeHead(500, { "Content-Type": "text/plain" });
      nodeResponse.end("Internal Server Error");
    }
  });
  return server;
}
