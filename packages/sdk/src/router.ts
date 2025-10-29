import type {
  AddonInterface,
  ContentType,
  DefaultConfig,
  Manifest,
  ShortManifestResource,
} from "./types.js";
import { match, type ParamData, type Path } from "path-to-regexp";

export function createRouter({ get, manifest }: AddonInterface) {
  return async function router(request: Request): Promise<Response | null> {
    const { pathname } = getUrl(request);
    const routePrefix = getRoutePrefix(manifest);
    const resourceHandlers = getResourceHandlers(manifest);
    const headers = { "Content-Type": "application/json; charset=utf-8" };

    // Match manifest route.
    const [manifestMatches, manifestMatch] = matchRoute<ManifestParams>(
      `${routePrefix}/manifest.json`,
      pathname,
    );
    if (manifestMatches) {
      const sanitizedManifest = sanitizeManifest(
        manifest,
        manifestMatch.params.config,
      );
      return new Response(sanitizedManifest, {
        headers,
      });
    }

    // Match resource route.
    const [resourceMatches, resourceMatch] = matchRoute<ResourceParams>(
      `${routePrefix}/:resource/:type/:id{/:extra}.json`,
      pathname,
    );
    if (resourceMatches) {
      const {
        resource,
        type,
        id,
        extra: rawExtra,
        config: rawConfig,
      } = resourceMatch.params;

      if (!resourceHandlers.has(resource)) {
        return new Response(JSON.stringify({ err: "resource not found" }), {
          status: 404,
          headers,
        });
      }

      const config = parseConfig<DefaultConfig>(rawConfig);
      const extra = parseExtra(rawExtra);

      try {
        const result = await get(
          resource as ShortManifestResource,
          type as ContentType,
          id,
          extra,
          config,
        );

        if (result.redirect) {
          return new Response(null, {
            status: 307,
            headers: { Location: result.redirect },
          });
        }

        const res = new Response(JSON.stringify(result), { headers });

        const cacheControlHeader = getCacheControlHeader(result);
        if (cacheControlHeader) {
          res.headers.set("Cache-Control", cacheControlHeader);
        }

        return res;
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ err: "handler error" }), {
          status: 500,
          headers,
        });
      }
    }

    // No match; the caller should handle this case.
    return null;
  };
}

function getUrl(req: Request) {
  if (req.url.includes("://")) {
    return new URL(req.url);
  }

  const host = req.headers.get("host");

  return new URL(`http://${host || "localhost"}${req.url}`);
}

function getRoutePrefix(manifest: Manifest) {
  const hasConfig = (manifest.config || []).length;
  return hasConfig ? "{/:config}" : "";
}

function getResourceHandlers(manifest: Manifest) {
  const handlers = new Set<string>();
  if (manifest.catalogs.length > 0) {
    handlers.add("catalog");
  }
  manifest.resources.forEach((r) =>
    handlers.add(typeof r === "string" ? r : r.name),
  );
  return handlers;
}

function getCacheControlHeader(result: any) {
  const cacheHeaders = {
    cacheMaxAge: "max-age",
    staleRevalidate: "stale-while-revalidate",
    staleError: "stale-if-error",
  };
  const cacheControl = Object.keys(cacheHeaders)
    .map((prop) => {
      const cacheKey = cacheHeaders[prop as keyof typeof cacheHeaders];
      const cacheValue = result[prop];
      if (!Number.isInteger(cacheValue)) return false;
      return cacheKey + "=" + cacheValue;
    })
    .filter((val) => !!val)
    .join(", ");

  return cacheControl ? `${cacheControl}, public` : null;
}

function sanitizeManifest(manifest: Manifest, config: string | undefined) {
  const manifestBuf = JSON.stringify(manifest);
  let sanitizedManifest = manifestBuf;
  if (
    config &&
    manifest.behaviorHints &&
    (manifest.behaviorHints.configurationRequired ||
      manifest.behaviorHints.configurable)
  ) {
    const manifestClone = JSON.parse(manifestBuf);
    // we remove configurationRequired so the addon is installable after configuration
    delete manifestClone.behaviorHints.configurationRequired;
    // we remove configuration page for installed addon too (could be added later to the router)
    delete manifestClone.behaviorHints.configurable;
    sanitizedManifest = JSON.stringify(manifestClone);
  }
  return sanitizedManifest;
}

function matchRoute<P extends ParamData>(
  path: Path | Path[],
  pathname: string,
) {
  const matcher = match<P>(path);
  const matches = matcher(pathname);
  // Explicitly return the results like this for better type narrowing.
  if (matches) {
    return [true, matches] as const;
  }
  return [false, null] as const;
}

function parseConfig<T extends DefaultConfig>(value: string | undefined): T {
  let config = {};

  if (value && value.length > 0) {
    try {
      config = JSON.parse(value);
    } catch (_) {
      // ignore
    }
  }

  return config as T;
}

function parseExtra(value: string | undefined) {
  return value ? Object.fromEntries(new URLSearchParams(value)) : {};
}

type ConfigParams = {
  config?: string;
};

type ManifestParams = ConfigParams;

type ResourceParams = ConfigParams & {
  resource: string;
  type: string;
  id: string;
  extra?: string;
};
