import { test } from "@fixtures/ui-fixtures";

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

  test("Services page loading skeleton renders", async ({ servicesPage }) => {
    await servicesPage.assertLoadingSkeletonVisible();
  });

  test("Services page empty state renders when API returns no services", async ({ servicesPage }) => {
    await servicesPage.assertEmptyState();
  });

  test("Services page error state renders with retry when API fails", async ({ servicesPage }) => {
    await servicesPage.assertErrorState();
  });

  test("Services page responsive layout at all breakpoints", async ({ servicesPage }) => {
    await servicesPage.assertResponsiveLayout();
  });

  test("Services page console error and image error handling", async ({ servicesPage }) => {
    await servicesPage.assertNoConsoleErrors();
    await servicesPage.assertNoImage404s();
  });
});
