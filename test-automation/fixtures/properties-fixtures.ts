import { test as base, expect, type Page } from "@playwright/test";
import { PropertiesUI } from "@pages/properties-ui";

type PropertiesFixtures = {
  propertiesUi: PropertiesUI;
  propertiesUiPage: Page;
};

/**
 * UI test fixtures for the Properties page.
 * Each fixture creates a fresh browser context with a PropertiesUI page object.
 */
export const test = base.extend<PropertiesFixtures>({
  propertiesUi: async ({ page }, use) => {
    const ui = new PropertiesUI(page);
    await use(ui);
  },
  propertiesUiPage: async ({ page }, use) => {
    await use(page);
  },
});

export { expect };
