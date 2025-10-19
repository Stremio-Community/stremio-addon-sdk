import { type ManifestSchema } from "@stremio-addon/validation-zod";

export const manifest: ManifestSchema = {
  id: "community.stremio.helloworld",
  version: "1.0.0",
  name: "Hello World Addon",
  description: "Sample addon providing a few public domain movies",
  resources: ["catalog", "stream"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      name: "Hello World",
      id: "helloworldmovies",
    },
  ],
  idPrefixes: ["tt"],
};
