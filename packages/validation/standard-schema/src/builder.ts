import type {
  AddonInterface,
  CatalogHandlerArgs,
  DefaultConfig,
  HandlerArgs,
  Manifest,
  ManifestSchema,
  MetaDetail,
  MetaHandlerArgs,
  MetaPreview,
  ShortManifestResource,
  Stream,
  StreamHandlerArgs,
  Subtitle,
  SubtitlesHandlerArgs,
  WithCache,
} from "./types.js";
import { validate } from "./validator.js";

type Handler = (args: HandlerArgs) => Promise<unknown>;

export class AddonBuilder {
  private readonly handlers = new Map<ShortManifestResource, Handler>();
  private readonly manifest: Manifest;

  constructor(schema: ManifestSchema, data: Manifest) {
    try {
      this.manifest = validate(schema, data);
    } catch (err) {
      throw new Error(`Invalid manifest: ${err}`);
    }
  }

  defineResourceHandler(
    resource: ShortManifestResource,
    handler: Handler,
  ): this {
    if (this.handlers.has(resource)) {
      throw new Error(`Handler for resource "${resource}" is already defined`);
    }
    this.handlers.set(resource, handler);
    return this;
  }

  defineStreamHandler<Config = DefaultConfig>(
    handler: (
      args: StreamHandlerArgs<Config>,
    ) => Promise<WithCache<{ streams: Stream[] }>>,
  ): this {
    return this.defineResourceHandler("stream", handler as Handler);
  }

  defineMetaHandler<Config = DefaultConfig>(
    handler: (
      args: MetaHandlerArgs<Config>,
    ) => Promise<WithCache<{ meta: MetaDetail }>>,
  ): this {
    return this.defineResourceHandler("meta", handler as Handler);
  }

  defineCatalogHandler<Config = DefaultConfig>(
    handler: (
      args: CatalogHandlerArgs<Config>,
    ) => Promise<WithCache<{ metas: MetaPreview[] }>>,
  ): this {
    return this.defineResourceHandler("catalog", handler as Handler);
  }

  defineSubtitlesHandler<Config = DefaultConfig>(
    handler: (
      args: SubtitlesHandlerArgs<Config>,
    ) => Promise<WithCache<{ subtitles: Subtitle[] }>>,
  ): this {
    return this.defineResourceHandler("subtitles", handler as Handler);
  }

  build(): AddonInterface {
    return {
      manifest: this.manifest,
      get: (resource, type, id, extra = {}, config = {}) => {
        const handler = this.handlers.get(resource);
        if (!handler) {
          return Promise.reject(`No handler for ${resource}`);
        }
        return handler({ type, id, extra, config });
      },
    };
  }
}
