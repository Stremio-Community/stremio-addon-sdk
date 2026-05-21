import type { AddonInterface, Manifest } from "./types.js";

// Mirrors the basic example from https://github.com/Stremio/stremio-addon-sdk/blob/2728da3ee853207cd5ee200aabe15a08cc1d01d1/docs/api/responses/manifest.md
export const basicManifest: Manifest = {
  id: "org.stremio.example",
  version: "0.0.1",
  name: "Example Addon",
  description: "Example Stremio Addon",
  resources: ["catalog", "stream"],
  types: ["movie", "series"],
  catalogs: [{ type: "movie", id: "moviecatalog", name: "Movies" }],
  idPrefixes: ["tt"],
};

// Mirrors the configurable example from https://github.com/Stremio/stremio-addon-sdk/blob/2728da3ee853207cd5ee200aabe15a08cc1d01d1/docs/api/responses/manifest.md
export const configurableManifest: Manifest = {
  id: "com.example.configurable",
  version: "1.0.0",
  name: "Configurable Addon",
  description: "Addon requiring user configuration",
  resources: ["stream", "catalog"],
  types: ["movie"],
  catalogs: [{ type: "movie", id: "main", name: "Main" }],
  behaviorHints: { configurable: true, configurationRequired: false },
  config: [
    { key: "apiKey", type: "password", title: "API Key", required: true },
    {
      key: "quality",
      type: "select",
      title: "Quality",
      options: ["720p", "1080p", "4K"],
      default: "1080p",
    },
  ],
};

// Mirrors the configurationRequired example from https://github.com/Stremio/stremio-addon-sdk/blob/2728da3ee853207cd5ee200aabe15a08cc1d01d1/docs/api/responses/manifest.md
export const configurationRequiredManifest: Manifest = {
  id: "com.example.required",
  version: "2.0.0",
  name: "Premium Service",
  description: "Requires configuration before use",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
  behaviorHints: {
    configurable: true,
    configurationRequired: true,
    adult: false,
    p2p: false,
  },
  config: [
    { key: "username", type: "text", title: "Username", required: true },
    { key: "password", type: "password", title: "Password", required: true },
  ],
};

// Catalog response from https://github.com/Stremio/stremio-addon-sdk/blob/2728da3ee853207cd5ee200aabe15a08cc1d01d1/docs/api/requests/defineCatalogHandler.md
export const bigBuckBunnyCatalog = {
  metas: [
    {
      id: "tt1254207",
      name: "Big Buck Bunny",
      releaseInfo: "2008",
      poster:
        "https://image.tmdb.org/t/p/w600_and_h900_bestv2/uVEFQvFMMsg4e6yb03xOfVsDz4o.jpg",
      posterShape: "poster" as const,
      type: "movie" as const,
    },
  ],
  cacheMaxAge: 3600,
};

// Stream response from https://github.com/Stremio/stremio-addon-sdk/blob/2728da3ee853207cd5ee200aabe15a08cc1d01d1/docs/api/requests/defineStreamHandler.md
export const bigBuckBunnyStream = {
  streams: [
    {
      url: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4",
    },
  ],
  cacheMaxAge: 3600,
};

export function makeAddon(
  manifest: Manifest,
  get: AddonInterface["get"] = async () => ({}),
): AddonInterface {
  return { manifest, get };
}
