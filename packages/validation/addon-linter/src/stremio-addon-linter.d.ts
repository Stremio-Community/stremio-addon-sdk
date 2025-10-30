declare module "stremio-addon-linter" {
  export function lintManifest(manifest: any): {
    valid: boolean;
    errors: Error[];
    warnings: Error[];
  };
  export function lintCollection(col: any): {
    valid: boolean;
    errors: Error[];
    warnings: Error[];
  };
}
