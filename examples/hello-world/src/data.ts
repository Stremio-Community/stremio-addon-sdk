import type { StreamSchema } from "@stremio-addon/zod";
import { fromMagnet } from "./utils.js";

/**
 * Example streams dataset.
 */
export const exampleStreams: Record<string, StreamSchema> = {
  // fileIdx is the index of the file within the torrent ; if not passed, the largest file will be selected
  tt0032138: {
    name: "The Wizard of Oz",
    infoHash: "24c8802e2624e17d46cd555f364debd949f2c81e",
    fileIdx: 0,
  },
  tt0017136: {
    name: "Metropolis",
    infoHash: "dca926c0328bb54d209d82dc8a2f391617b47d7a",
    fileIdx: 1,
  },

  // night of the living dead, example from magnet
  tt0063350: fromMagnet(
    "Night of the Living Dead",
    "movie",
    "magnet:?xt=urn:btih:A7CFBB7840A8B67FD735AC73A373302D14A7CDC9&dn=night+of+the+living+dead+1968+remastered+bdrip+1080p+ita+eng+x265+nahom&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce",
  ),
  tt0051744: {
    name: "House on Haunted Hill",
    infoHash: "9f86563ce2ed86bbfedd5d3e9f4e55aedd660960",
  },

  tt1254207: {
    name: "Big Buck Bunny",
    url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
  }, // HTTP stream
  tt0031051: { name: "The Arizona Kid", ytId: "m3BKVSpP80s" }, // YouTube stream

  tt0137523: {
    name: "Fight Club",
    externalUrl: "https://www.netflix.com/watch/26004747",
  }, // redirects to Netflix
};
