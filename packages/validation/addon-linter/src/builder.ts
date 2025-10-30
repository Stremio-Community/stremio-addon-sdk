import {
  AddonBuilder as BaseAddonBuilder,
  type AddonInterface,
  type Manifest,
} from "@stremio-addon/sdk";
import { manifestSchema } from "./manifest.js";

export class AddonBuilder extends BaseAddonBuilder {
  constructor(manifest: Manifest) {
    super(manifest, manifestSchema);
  }

  private validate() {
    const errors: Error[] = [];

    const handlersInManifest: string[] = [];
    if (this.manifest.catalogs.length > 0) {
      handlersInManifest.push("catalog");
    }
    this.manifest.resources.forEach((r) =>
      handlersInManifest.push(typeof r === "string" ? r : r.name),
    );

    const handlersDefined: string[] = Array.from(this.handlers.keys());
    handlersDefined.forEach((defined) => {
      if (!handlersInManifest.includes(defined)) {
        if (defined == "catalog") {
          errors.push(
            new Error(
              "manifest.catalogs is empty, catalog handler will never be called",
            ),
          );
        } else {
          errors.push(
            new Error("manifest.resources does not contain: " + defined),
          );
        }
      }
    });
    handlersInManifest.forEach((defined) => {
      if (!handlersDefined.includes(defined)) {
        const capitalized = defined[0].toUpperCase() + defined.slice(1);
        errors.push(
          new Error(
            `manifest definition requires handler for ${defined},` +
              ` but it is not provided (use .define${capitalized}Handler())`,
          ),
        );
      }
    });

    return errors;
  }

  getInterface(): AddonInterface {
    const errors = this.validate();
    if (errors.length) {
      throw errors[0];
    }
    return super.getInterface();
  }
}
