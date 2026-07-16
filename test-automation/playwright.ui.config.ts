import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  fullyParallel: true,
  workers: undefined,
  reporter: [["html", { outputFolder: "/tmp/playwright-report-ui" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
  },
});