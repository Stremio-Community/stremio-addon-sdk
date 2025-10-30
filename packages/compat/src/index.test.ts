import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import type { Server } from "http";
import { AddonBuilder } from "@stremio-addon/validation-addon-linter";
import { getRouter } from "@stremio-addon/runtime-node-express";
import { serveHTTP } from "./serve-http.js";
import { publishToCentral } from "./publish-to-central.js";
import type { Manifest } from "@stremio-addon/sdk";
import AddonClient from "stremio-addon-client";

const PORT = 5000;

let addonUrl: string;
let addonServer: Server;

const manifest: Manifest = {
  id: "org.myexampleaddon",
  version: "1.0.0",
  description: "not so simple",
  name: "simple example",
  logo: `http://localhost:${PORT}/static/imgs/logo.png`,
  background: `http://localhost:${PORT}/static/imgs/background.jpg`,
  resources: ["stream"],
  types: ["movie"],
  catalogs: [{ type: "movie", id: "test", name: "Test Catalog" }],
};

afterAll(() => {
  // Close the server after all tests
  if (addonServer) {
    addonServer.close();
  }
});

describe("AddonBuilder validation", () => {
  it("should reject addon creation with null manifest", () => {
    expect(() => {
      // @ts-expect-error - Testing invalid input
      new AddonBuilder(null);
    }).toThrow("manifest must be an object");
  });

  it("should reject addon creation with partial manifest", () => {
    expect(() => {
      // @ts-expect-error - Testing invalid input
      new AddonBuilder({ name: "something" });
    }).toThrow("manifest.id must be a string");
  });

  it("should reject requests for undefined resource at runtime", () => {
    expect(() =>
      new AddonBuilder(manifest)
        .defineStreamHandler(() => Promise.resolve({ streams: [] }))
        .getInterface(),
    ).toThrow(
      "manifest definition requires handler for catalog, but it is not provided (use .defineCatalogHandler())",
    );
  });
});

describe("getRouter", () => {
  it("should create a router for addon with all handlers defined", () => {
    const addon = new AddonBuilder(manifest)
      .defineCatalogHandler(() => Promise.resolve({ metas: [] }))
      .defineStreamHandler(() => Promise.resolve({ streams: [] }));

    const router = getRouter(addon.getInterface());
    expect(router).toBeDefined();
  });
});

describe("serveHTTP", () => {
  it("should create HTTP server and serve manifest", async () => {
    const builder = new AddonBuilder(manifest)
      .defineCatalogHandler(() => Promise.resolve({ metas: [] }))
      .defineStreamHandler((args) => Promise.resolve({ streams: [], args }));

    const h = (await serveHTTP(builder.getInterface(), {
      port: PORT,
      cacheMaxAge: 3600,
    })) as { url: string; server: Server };

    expect(h.url).toBeDefined();
    expect(h.url.endsWith("manifest.json")).toBe(true);
    expect(h.server).toBeDefined();

    addonUrl = h.url;
    addonServer = h.server;

    const res = await request(addonServer).get("/manifest.json").expect(200);

    expect(res.error).toBeFalsy();
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toBe("max-age=3600, public");
  });

  it("should throw error when serving non-existent directory", () => {
    const addon = new AddonBuilder(manifest)
      .defineCatalogHandler(() => Promise.resolve({ metas: [] }))
      .defineStreamHandler(() => Promise.resolve({ streams: [] }));

    expect(() => {
      serveHTTP(addon.getInterface(), { static: "/notexist" });
    }).toThrow("directory to serve does not exist");
  });

  it("should serve static directory", async () => {
    const addon = new AddonBuilder(manifest)
      .defineCatalogHandler(() => Promise.resolve({ metas: [] }))
      .defineStreamHandler(() => Promise.resolve({ streams: [] }));

    // The static path is relative to process.cwd()
    // When running from workspace root, cwd is different than package root
    // Use a relative path that works in both scenarios
    const relativeSrcPath = process.cwd().endsWith("packages/compat")
      ? "/src"
      : "/packages/compat/src";

    const h = (await serveHTTP(addon.getInterface(), {
      static: relativeSrcPath,
    })) as {
      url: string;
      server: Server;
    };

    // Request a file from the src directory
    const res = await request(h.server)
      .get(`${relativeSrcPath}/index.ts`)
      .expect(200);

    h.server.close();

    expect(res.error).toBeFalsy();
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    // Express serves .ts files, just verify we got a response with body content
    expect(res.body || res.text).toBeTruthy();
  });
});

describe("Landing page", () => {
  it("should return a valid HTML document", async () => {
    const res = await request(addonServer).get("/").expect(200);

    expect(res.error).toBeFalsy();
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.text).toBeDefined();
    expect(res.type).toBe("text/html");
  });
});

describe("AddonClient integration", () => {
  it("should initialize addon client and test handlers", async () => {
    const resp = await AddonClient.detectFromURL(addonUrl);

    expect(resp.addon).toBeDefined();
    expect(resp.addon.manifest).toBeDefined();
    expect(resp.addon.manifest).toEqual(manifest);

    const addonClient = resp.addon;

    // Test stream handler with basic args
    const streamResp1 = await addonClient.get("stream", "channel", "11");
    expect(streamResp1.streams).toBeDefined();
    expect(streamResp1.args).toEqual({
      type: "channel",
      id: "11",
      extra: {},
      config: {},
    });

    // Test stream handler with extra params
    const streamResp2 = await addonClient.get("stream", "channel", "11", {
      search: "foobar",
    });
    expect(streamResp2.streams).toBeDefined();
    expect(streamResp2.args).toEqual({
      type: "channel",
      id: "11",
      extra: { search: "foobar" },
      config: {},
    });
  });
});

describe("getInterface", () => {
  it("should define stream handler and test it", async () => {
    const addon = new AddonBuilder(manifest)
      .defineCatalogHandler(() => Promise.resolve({ metas: [] }))
      .defineStreamHandler((args) => {
        expect(args.type).toBe("channel");
        expect(args.id).toBe("11");
        expect(args.extra).toEqual({});
        return Promise.resolve({ streams: [] });
      });

    const addonInterface = addon.getInterface();

    expect(addonInterface.manifest).toBeDefined();

    // Test that interface returns the manifest
    expect(addonInterface.manifest.name).toBe(manifest.name);

    const r = await addonInterface.get("stream", "channel", "11");
    expect(r.streams).toBeDefined();
  });

  it("should throw error when defining the same handler twice", () => {
    const addon = new AddonBuilder(manifest)
      .defineCatalogHandler(() => Promise.resolve({ metas: [] }))
      .defineStreamHandler(() => Promise.resolve({ streams: [] }));

    expect(() => {
      addon.defineStreamHandler(() => Promise.resolve({ streams: [] }));
    }).toThrow('Handler for resource "stream" is already defined');
  });
});

describe("publishToCentral", () => {
  it("should publish to central API or handle rate limits", async () => {
    try {
      const resp = await publishToCentral(
        "https://v3-cinemeta.strem.io/manifest.json",
      );
      expect(resp.success).toBe(true);
    } catch (error: any) {
      // Handle rate limiting error from the API
      // The error is an object with a message property
      const errorMessage =
        error.message || error.toString() || JSON.stringify(error);
      expect(errorMessage).toContain("too many addons published");
    }
  });
});
