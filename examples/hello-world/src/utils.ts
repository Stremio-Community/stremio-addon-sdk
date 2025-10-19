import { decode as decodeMagnetURL } from "magnet-uri";

/**
 * Utility function to add from magnet.
 */
export function fromMagnet(name: string, type: string, uri: string) {
  const parsed = decodeMagnetURL(uri);
  if (!parsed.infoHash) {
    throw new Error("Invalid magnet URI: " + uri);
  }
  const infoHash = parsed.infoHash.toLowerCase();
  const tags = [];
  if (uri.match(/720p/i)) tags.push("720p");
  if (uri.match(/1080p/i)) tags.push("1080p");
  return {
    name: name,
    type: type,
    infoHash: infoHash,
    sources: (parsed.announce || [])
      .map(function (x) {
        return "tracker:" + x;
      })
      .concat(["dht:" + infoHash]),
    tag: tags,
    title: tags[0], // show quality in the UI
  };
}
