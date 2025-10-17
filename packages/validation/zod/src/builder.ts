import { AddonBuilder as BaseAddonBuilder } from "@stremio-addon/standard-schema";
import type z from "zod";
import { manifestSchema } from "./manifest.js";

export class AddonBuilder extends BaseAddonBuilder {
  constructor(manifest: z.infer<typeof manifestSchema>) {
    super(manifestSchema, manifest);
  }
}
