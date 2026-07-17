import { defineConfig } from "@playwright/test";
import { BASE_URL } from "@constants/index";

export default defineConfig({
  testDir: "./specs",
  testMatch: /.*-ui\.spec\.ts$/,
  timeout: 30_000,
  fullyParallel: true,
  workers: undefined,
  reporter: [["html", { outputFolder: "/tmp/playwright-report-ui" }], ["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});