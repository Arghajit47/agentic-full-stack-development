import { test as base, expect, type Page } from "@playwright/test";
import { HomeUI } from "@pages/home-ui";
import { PropertiesUI } from "@pages/properties-ui";

type UIFixtures = {
  homeUi: HomeUI;
  homeUiPage: Page;
  propertiesUi: PropertiesUI;
  propertiesUiPage: Page;
};

/**
 * UI test fixtures. Each fixture creates a fresh browser context with a HomeUI/PropertiesUI
 * page object. Integration specs hit the real API/DB, so reseed before each test.
 */
export const test = base.extend<UIFixtures>({
  homeUi: async ({ page }, use) => {
    const ui = new HomeUI(page);
    await use(ui);
  },
  homeUiPage: async ({ page }, use) => {
    await use(page);
  },
  propertiesUi: async ({ page }, use) => {
    const ui = new PropertiesUI(page);
    await use(ui);
  },
  propertiesUiPage: async ({ page }, use) => {
    await use(page);
  },
});

export { expect };
