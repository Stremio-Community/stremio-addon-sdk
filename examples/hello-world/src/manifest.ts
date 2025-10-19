import { type ManifestSchema } from "@stremio-addon/validation-zod";

export const manifest: ManifestSchema = {
  id: "org.stremio.helloworld",
  version: "1.0.0",

  name: "Hello World Addon",
  description: "Sample addon providing a few public domain movies",

  // set what type of resources we will return
  resources: ["catalog", "stream"],

  types: ["movie", "series"], // your add-on will be preferred for those content types

  // set catalogs, we'll be making 2 catalogs in this case, 1 for movies and 1 for series
  catalogs: [
    {
      type: "movie",
      name: "Hello World Movies",
      id: "helloworldmovies",
    },
    {
      type: "series",
      name: "Hello World Series",
      id: "helloworldseries",
    },
  ],

  // prefix of item IDs (ie: "tt0032138")
  idPrefixes: ["tt"],
};
