import { AddonBuilder } from "@stremio-addon/sdk";
import { getRouter } from "@stremio-addon/runtime-node";

const builder = new AddonBuilder({
  id: "org.myexampleaddon",
  version: "1.0.0",
  name: "simple example",
  catalogs: [],
  resources: ["stream"],
  types: ["movie"],
});

builder.defineStreamHandler(function (args) {
  if (args.type === "movie" && args.id === "tt1254207") {
    // serve one stream to big buck bunny
    const stream = {
      url: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4",
    };
    return Promise.resolve({ streams: [stream] });
  } else {
    // otherwise return no streams
    return Promise.resolve({ streams: [] });
  }
});

const addonInterface = builder.getInterface();
const server = getRouter(addonInterface);
const port = process.env.PORT || 43001;

server.listen(port, () => {
  console.log(`Addon listening on http://localhost:${port}/`);
});
