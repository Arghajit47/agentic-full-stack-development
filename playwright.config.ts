import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/specs",
  timeout: 30_000,
  fullyParallel: false, // shared SQLite DB — serialize
  workers: 1,
  reporter: [["html", { outputFolder: "/tmp/playwright-report" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    extraHTTPHeaders: { "Content-Type": "application/json" },
  },
});