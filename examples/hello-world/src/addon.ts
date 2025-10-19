import { exampleStreams } from "./data.js";
import { manifest } from "./manifest.js";
import {
  AddonBuilder,
  type MetaPreviewSchema,
} from "@stremio-addon/validation-zod";

const builder = new AddonBuilder(manifest);

// Streams handler.
builder.defineStreamHandler(async ({ id }) => {
  // Look for the stream in our example dataset.
  const stream = exampleStreams[id];

  if (stream) {
    return { streams: [stream] };
  } else {
    return { streams: [] };
  }
});

// Catalog handler.
builder.defineCatalogHandler(async (args) => {
  const METAHUB_URL = "https://images.metahub.space";
  const metas = Object.entries(exampleStreams).map(
    ([key, value]) =>
      ({
        id: key,
        name: value.name ?? "Unknown Title",
        poster: METAHUB_URL + "/poster/medium/" + key + "/img",
        type: "movie",
      }) satisfies MetaPreviewSchema,
  );

  return { metas };
});

export const addonInterface = builder.getInterface();
