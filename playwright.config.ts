import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false, // shared SQLite DB — serialize
  workers: 1,
  reporter: [["html", { outputFolder: "/tmp/playwright-report-KAN-7" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    extraHTTPHeaders: { "Content-Type": "application/json" },
  },
  projects: [
    {
      name: "api",
      testMatch: /.*\.spec\.ts/,
    },
  ],
});