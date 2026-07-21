import { defineConfig, devices } from "@playwright/test";
import { BASE_URL } from "@constants/index";

export default defineConfig({
  timeout: 30_000,
  fullyParallel: true,
  workers: undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: BASE_URL,
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
    }
  ],
});