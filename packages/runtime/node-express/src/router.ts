import { Router } from "express";
import cors from "cors";
import type {
  AddonInterface,
  ContentType,
  DefaultConfig,
  ShortManifestResource,
} from "@stremio-addon/standard-schema";

export function getRouter({ manifest, get }: AddonInterface): Router {
  const router = Router();
  router.use(cors());

  const hasConfig = (manifest.config || []).length;
  const configPrefix = hasConfig ? "/:config?" : "";

  router.get(`${configPrefix}/manifest.json`, (req, res) => {
    const manifestBuf = JSON.stringify(manifest);
    let manifestRespBuf = manifestBuf;
    if (
      "config" in req.params &&
      req.params.config &&
      manifest.behaviorHints &&
      (manifest.behaviorHints.configurationRequired ||
        manifest.behaviorHints.configurable)
    ) {
      const manifestClone = JSON.parse(manifestBuf);
      // we remove configurationRequired so the addon is installable after configuration
      delete manifestClone.behaviorHints.configurationRequired;
      // we remove configuration page for installed addon too (could be added later to the router)
      delete manifestClone.behaviorHints.configurable;
      manifestRespBuf = JSON.stringify(manifestClone);
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(manifestRespBuf);
  });

  // Extract resource handlers from manifest.
  const handlersInManifest = [];
  if (manifest.catalogs.length > 0) handlersInManifest.push("catalog");
  manifest.resources.forEach((r) =>
    handlersInManifest.push(typeof r === "string" ? r : r.name),
  );

  // Convert the resources array to a regular expression.
  // This will be used to match the resource in the express route.
  const ResourcesRegex =
    handlersInManifest && handlersInManifest.length
      ? "(" + handlersInManifest.join("|") + ")"
      : "";

  // Handle all resources
  router.get(
    `${configPrefix}/:resource${ResourcesRegex}/:type/:id/:extra?.json`,
    (req, res, next) => {
      const { resource, type, id } = req.params;
      const configString =
        "config" in req.params ? req.params.config : undefined;
      let config: DefaultConfig = {};
      // we get `extra` from `req.url` because `req.params.extra` decodes the characters
      // and breaks dividing querystring parameters with `&`, in case `&` is one of the
      // encoded characters of a parameter value
      const extra = req.params.extra
        ? Object.fromEntries(
            new URLSearchParams((req.url.split("/").pop() ?? "").slice(0, -5)),
          )
        : {};
      if (configString && (configString || "").length) {
        try {
          config = JSON.parse(configString);
        } catch (_) {
          // ignore
        }
      }
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      get(
        resource as ShortManifestResource,
        type as ContentType,
        id,
        extra,
        config,
      )
        .then((resp) => {
          let cacheHeaders = {
            cacheMaxAge: "max-age",
            staleRevalidate: "stale-while-revalidate",
            staleError: "stale-if-error",
          };

          const cacheControl = Object.keys(cacheHeaders)
            .map((prop) => {
              const cacheProp = cacheHeaders[prop as keyof typeof cacheHeaders];
              const cacheValue = resp[prop];
              if (!Number.isInteger(cacheValue)) return false;
              return cacheProp + "=" + cacheValue;
            })
            .filter((val) => !!val)
            .join(", ");

          if (cacheControl)
            res.setHeader("Cache-Control", `${cacheControl}, public`);

          if (resp.redirect) {
            res.redirect(307, resp.redirect);
            return;
          }

          res.setHeader("Content-Type", "application/json; charset=utf-8");

          res.end(JSON.stringify(resp));
        })
        .catch((err) => {
          if (err.noHandler) {
            if (next) next();
            else {
              res.writeHead(404);
              res.end(JSON.stringify({ err: "not found" }));
            }
          } else {
            console.error(err);
            res.writeHead(500);
            res.end(JSON.stringify({ err: "handler error" }));
          }
        });
    },
  );

  return router;
}
