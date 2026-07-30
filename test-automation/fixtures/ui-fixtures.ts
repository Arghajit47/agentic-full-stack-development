import { test as base, type Page } from "@playwright/test";
import { HomePage } from "@pages/frontend/home-page";
import { PropertiesPage } from "@pages/frontend/properties-page";
import { ServicesPage } from "@pages/frontend/services-page";
import { AboutUsPage } from "@pages/frontend/about-us-page";
import { ContactPage } from "@pages/frontend/contact-page";
import { PropertyDetailsPage } from "@pages/frontend/property-details-page";

type MyFixtures = {
  homepage: HomePage;
  propertiesPage: PropertiesPage;
  servicesPage: ServicesPage;
  aboutUsPage: AboutUsPage;
  contactPage: ContactPage;
  propertyDetailsPage: PropertyDetailsPage;
};

export const test = base.extend<MyFixtures>({
  homepage: async ({ page }: { page: Page }, use) => {
    await use(new HomePage(page));
  },

  propertiesPage: async ({ page }: { page: Page }, use) => {
    await use(new PropertiesPage(page));
  },

  servicesPage: async ({ page }: { page: Page }, use) => {
    await use(new ServicesPage(page));
  },

  aboutUsPage: async ({ page }: { page: Page }, use) => {
    await use(new AboutUsPage(page));
  },

  contactPage: async ({ page }: { page: Page }, use) => {
    await use(new ContactPage(page));
  },

  propertyDetailsPage: async ({ page }: { page: Page }, use) => {
    await use(new PropertyDetailsPage(page));
  },
});

export { expect } from "@playwright/test";
