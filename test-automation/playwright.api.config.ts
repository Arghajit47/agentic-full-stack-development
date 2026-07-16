import { defineConfig } from "@playwright/test";
import { BASE_URL } from "@constants/index";

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["html", { outputFolder: "/tmp/playwright-report-api" }], ["list"]],
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: { "Content-Type": "application/json" },
  },
});