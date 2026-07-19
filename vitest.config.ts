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
    fileParallelism: false,
    include: [
      "src/__tests__/**/*.test.ts",
      "src/components/**/__tests__/*.test.tsx",
      "src/app/**/__tests__/*.test.tsx",
    ],
    environmentMatchGlobs: [
      ["src/components/**/__tests__/*.test.tsx", "happy-dom"],
      ["src/app/**/__tests__/*.test.tsx", "happy-dom"],
      ["src/app/page.test.tsx", "happy-dom"],
    ],
  },
});
