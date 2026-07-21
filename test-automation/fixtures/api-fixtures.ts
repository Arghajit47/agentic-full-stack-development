import { test as base } from "@playwright/test";
import { BackendApi } from "@pages/backend/api";

type Fixtures = {
  backendApi: BackendApi;
};

export const test = base.extend<Fixtures>({
  backendApi: async ({}, use) => {
    const api = new BackendApi();
    await use(api);
  },
});

export { expect } from "@playwright/test";