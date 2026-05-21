import { describe, it, expect } from "vitest";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { AddonBuilder } from "./builder.js";
import { ValidationError } from "./validator.js";
import {
  basicManifest,
  bigBuckBunnyCatalog,
  bigBuckBunnyStream,
} from "./__fixtures__.js";
import type { Manifest, ManifestSchema } from "./types.js";

const passthroughSchema: ManifestSchema = {
  "~standard": {
    version: 1,
    vendor: "test",
    validate: (value) => ({ value: value as Manifest }),
  },
};

const rejectingSchema: ManifestSchema = {
  "~standard": {
    version: 1,
    vendor: "test",
    validate: () => ({
      issues: [
        { message: "bad manifest" },
      ] as readonly StandardSchemaV1.Issue[],
    }),
  },
};

describe("AddonBuilder", () => {
  describe("construction", () => {
    it("freezes the manifest", () => {
      const builder = new AddonBuilder(basicManifest);
      const { manifest } = builder.getInterface();

      expect(Object.isFrozen(manifest)).toBe(true);
      expect(() => {
        "use strict";
        (manifest as any).name = "Mutated";
      }).toThrow();
    });

    it("accepts a manifest without schema", () => {
      const builder = new AddonBuilder(basicManifest);
      expect(builder.getInterface().manifest).toEqual(basicManifest);
    });

    it("passes manifest through schema when provided", () => {
      const builder = new AddonBuilder(basicManifest, passthroughSchema);
      expect(builder.getInterface().manifest).toEqual(basicManifest);
    });

    it("throws ValidationError when schema rejects", () => {
      expect(() => new AddonBuilder(basicManifest, rejectingSchema)).toThrow(
        ValidationError,
      );
    });
  });

  describe("defineResourceHandler", () => {
    it("returns this (chainable)", () => {
      const builder = new AddonBuilder(basicManifest);
      const ret = builder.defineStreamHandler(async () => ({ streams: [] }));
      expect(ret).toBe(builder);
    });

    it("throws when the same resource is defined twice", () => {
      const builder = new AddonBuilder(basicManifest).defineStreamHandler(
        async () => ({ streams: [] }),
      );

      expect(() =>
        builder.defineStreamHandler(async () => ({ streams: [] })),
      ).toThrow('Handler for resource "stream" is already defined');
    });
  });

  describe("sugar methods route to the right resource", () => {
    it("defineStreamHandler responds to get('stream', ...)", async () => {
      const builder = new AddonBuilder(basicManifest).defineStreamHandler(
        async () => bigBuckBunnyStream,
      );

      const result = await builder
        .getInterface()
        .get("stream", "movie", "tt1254207");
      expect(result).toEqual(bigBuckBunnyStream);
    });

    it("defineCatalogHandler responds to get('catalog', ...)", async () => {
      const builder = new AddonBuilder(basicManifest).defineCatalogHandler(
        async () => bigBuckBunnyCatalog,
      );

      const result = await builder
        .getInterface()
        .get("catalog", "movie", "moviecatalog");
      expect(result).toEqual(bigBuckBunnyCatalog);
    });

    it("defineMetaHandler responds to get('meta', ...)", async () => {
      const meta = { meta: { id: "tt1254207", type: "movie", name: "BBB" } };
      const builder = new AddonBuilder(basicManifest).defineMetaHandler(
        async () => meta as any,
      );

      const result = await builder
        .getInterface()
        .get("meta", "movie", "tt1254207");
      expect(result).toEqual(meta);
    });

    it("defineSubtitlesHandler responds to get('subtitles', ...)", async () => {
      const subs = { subtitles: [] };
      const builder = new AddonBuilder(basicManifest).defineSubtitlesHandler(
        async () => subs,
      );

      const result = await builder
        .getInterface()
        .get("subtitles", "movie", "tt1254207");
      expect(result).toEqual(subs);
    });
  });

  describe("getInterface().get", () => {
    it("rejects when no handler is registered for the resource", async () => {
      const builder = new AddonBuilder(basicManifest);

      await expect(
        builder.getInterface().get("addon_catalog", "movie", "x"),
      ).rejects.toBe("No handler for addon_catalog");
    });

    it("passes default extra and config when omitted", async () => {
      let captured: any;
      const builder = new AddonBuilder(basicManifest).defineStreamHandler(
        async (args) => {
          captured = args;
          return { streams: [] };
        },
      );

      await builder.getInterface().get("stream", "movie", "tt1254207");

      expect(captured).toEqual({
        type: "movie",
        id: "tt1254207",
        extra: {},
        config: {},
      });
    });

    it("passes through extra and config when provided", async () => {
      let captured: any;
      const builder = new AddonBuilder(basicManifest).defineStreamHandler(
        async (args) => {
          captured = args;
          return { streams: [] };
        },
      );

      await builder
        .getInterface()
        .get(
          "stream",
          "series",
          "tt0898266:9:17",
          { search: "foo" },
          { apiKey: "x" },
        );

      expect(captured).toEqual({
        type: "series",
        id: "tt0898266:9:17",
        extra: { search: "foo" },
        config: { apiKey: "x" },
      });
    });
  });
});
