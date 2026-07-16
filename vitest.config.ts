import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: [
      "src/__tests__/**/*.test.ts",
      "src/components/**/__tests__/*.test.tsx",
    ],
    environmentMatchGlobs: [
      ["src/components/**/__tests__/*.test.tsx", "happy-dom"],
    ],
  },
});