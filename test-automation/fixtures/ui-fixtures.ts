import { test as base, expect, type Page } from "@playwright/test";
import { HomeUI } from "@pages/home-ui";

type UIFixtures = {
  homeUi: HomeUI;
  homeUiPage: Page;
};

/**
 * UI test fixtures. Each fixture creates a fresh browser context with a HomeUI
 * page object. No reseed — UI tests hit the static-mock home page, not the API/DB.
 */
export const test = base.extend<UIFixtures>({
  homeUi: async ({ page }, use) => {
    const ui = new HomeUI(page);
    await use(ui);
  },
  homeUiPage: async ({ page }, use) => {
    await use(page);
  },
});

export { expect };