import { test, expect } from "@fixtures/ui-fixtures";

test.describe("Services Page Suite", () => {
  test("Services page initial render and default content", async ({ servicesPage }) => {
    await servicesPage.navigateToServices();
    await servicesPage.assertPageRenders();
  });

  test("Services page section visibility", async ({ servicesPage }) => {
    await servicesPage.navigateToServices();
    await servicesPage.assertSectionsVisible();
  });

  test("Services page live API data vs UI validation", async ({ servicesPage }) => {
    await servicesPage.navigateToServices();
    await servicesPage.assertHeadingsMatchApi();
  });

  test("Services page console error and image error handling", async ({ servicesPage }) => {
    await servicesPage.assertNoConsoleErrors();
    await servicesPage.assertNoImage404s();
  });
});
