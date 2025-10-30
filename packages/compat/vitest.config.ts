import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "compat",
    root: __dirname,
    globals: false,
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
