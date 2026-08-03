import { defineConfig, devices } from "@playwright/test";
import { BASE_URL } from "@constants/index";

export default defineConfig({
  timeout: 30_000,
  fullyParallel: true,
  workers: undefined,
  reporter: [["@arghajit/playwright-pulse-report", { outputDir: process.env.PULSE_REPORT_DIR ?? "pulse-report" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || BASE_URL,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: 'frontend-integration-test',
      testDir: "./specs/frontend-integration-test",
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'backend-test',
      testDir: "./specs/backend-test",
      testMatch: /.*\.spec\.ts$/,
    },
    {
      name: 'lighthouse-test',
      testDir: "./specs/lighthouse-test",
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 300_000,
      workers: 1,
      fullyParallel: false,
    },
    {
      name: 'smoke-test',
      testDir: "./specs/smoke-test",
      testMatch: /.*\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 120_000,
    },
  ],
});