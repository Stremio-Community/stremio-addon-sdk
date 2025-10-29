import { IncomingMessage } from "http";
import { Readable } from "stream";

/**
 * Take a nodejs http IncomingMessage and convert it to an web standard Fetch API Request object.
 *
 * @param req - The incoming message
 * @param baseUrl - The base URL of the server
 * @returns The request and url
 */
export function toRequest(req: IncomingMessage) {
  const baseUrl = `http://${req.headers.host || "localhost"}`;
  const url = new URL(req.url || "/", baseUrl);
  const headers = new Headers();
  for (const key in req.headers) {
    const value = req.headers[key];
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.append(key, value);
      }
    }
  }
  let body: ReadableStream | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = Readable.toWeb(req) as ReadableStream;
  }
  return new Request(url.toString(), {
    method: req.method,
    headers: headers,
    body: body,
  });
}
