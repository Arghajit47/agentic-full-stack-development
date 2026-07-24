import { test as base, type Page } from "@playwright/test";
import { HomePage } from "@pages/frontend/home-page";
import { PropertiesPage } from "@pages/frontend/properties-page";
import { ServicesPage } from "@pages/frontend/services-page";

/**
 * Defines the custom fixtures available in the test suite.
 * Each property represents an instance of a page object that will be
 * automatically initialized and made available to every test.
 */
type MyFixtures = {
  homepage: HomePage;
  propertiesPage: PropertiesPage;
  servicesPage: ServicesPage;
};

export const test = base.extend<MyFixtures>({
  /**
   * Provides a HomePage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  homepage: async ({ page }: { page: Page }, use) => {
    await use(new HomePage(page));
  },

  /**
   * Provides a PropertiesPage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  propertiesPage: async ({ page }: { page: Page }, use) => {
    await use(new PropertiesPage(page));
  },

  /**
   * Provides a ServicesPage instance to tests.
   * @param page - The Playwright Page object supplied by the test runner.
   * @param use - Function to signal that the fixture is ready for consumption.
   */
  servicesPage: async ({ page }: { page: Page }, use) => {
    await use(new ServicesPage(page));
  },
});

export { expect } from "@playwright/test";