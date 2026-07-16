import { test as base } from "@playwright/test";
import { PropertiesAPI } from "@pages/properties-api";
import { ReviewsAPI } from "@pages/reviews-api";
import { SettingsAPI } from "@pages/settings-api";
import { SchemaAPI } from "@pages/schema-api";
import { BaseAPI } from "@base/api-base";

type Fixtures = {
  propertiesApi: PropertiesAPI;
  reviewsApi: ReviewsAPI;
  settingsApi: SettingsAPI;
  schemaApi: SchemaAPI;
};

export const test = base.extend<Fixtures>({
  propertiesApi: async ({}, use) => {
    BaseAPI.reseed();
    const api = new PropertiesAPI();
    await api.init();
    await use(api);
    await api.dispose();
  },
  reviewsApi: async ({}, use) => {
    BaseAPI.reseed();
    const api = new ReviewsAPI();
    await api.init();
    await use(api);
    await api.dispose();
  },
  settingsApi: async ({}, use) => {
    BaseAPI.reseed();
    const api = new SettingsAPI();
    await api.init();
    await use(api);
    await api.dispose();
  },
  schemaApi: async ({}, use) => {
    const api = new SchemaAPI();
    await api.init();
    await use(api);
    await api.dispose();
  },
});

export { expect } from "@playwright/test";