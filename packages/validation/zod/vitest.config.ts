import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "zod",
    root: __dirname,
    globals: false,
    environment: "node",
  },
});
