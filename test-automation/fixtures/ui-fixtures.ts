import { test as base, expect, type Page } from "@playwright/test";
import { HomeUI } from "@pages/home-ui";
import { PropertiesUI } from "@pages/properties-ui";
import { PROPERTIES_LOCATORS } from "@locators/propertiespage-locators";
import {HOMEPAGE_LOCATORS} from "@locators/homepage-locators";

type UIFixtures = {
  homeUi: HomeUI;
  homeUiPage: Page;
  propertiesUi: PropertiesUI;
  propertiesUiPage: Page;
  propertiesLocators: typeof PROPERTIES_LOCATORS;
  homepageLocators: typeof HOMEPAGE_LOCATORS;
};

/**
 * UI test fixtures. Each fixture creates a fresh browser context with a HomeUI
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
  propertiesLocators: async ({ page: _page }, use) => {
    await use(PROPERTIES_LOCATORS);
  },
  homepageLocators: async ({ page: _page }, use) => {
    await use(HOMEPAGE_LOCATORS);
  },
});

export { expect };
