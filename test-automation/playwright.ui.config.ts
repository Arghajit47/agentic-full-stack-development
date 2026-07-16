import { defineConfig } from "@playwright/test";
import { BASE_URL } from "@constants/index";

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  fullyParallel: true,
  workers: undefined,
  reporter: [["html", { outputFolder: "/tmp/playwright-report-ui" }], ["list"]],
  use: {
    baseURL: BASE_URL,
  },
});