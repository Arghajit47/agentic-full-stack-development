import { test } from "@fixtures/ui-fixtures";

test("Properties page live API data vs UI validation", async ({ propertiesPage }) => {
  await propertiesPage.assertLiveApiDataValidation();
});

test("Properties page header and search controls validation", async ({ propertiesPage }) => {
  await propertiesPage.assertPageHeaderAndSearchControls();
});

test("Properties page responsive grid layout", async ({ propertiesPage }) => {
  await propertiesPage.navigatePropertiesPage();
  await test.step("Set viewport to WIDE and assert grid columns", async () => {
    await propertiesPage.setViewport("WIDE");
    await propertiesPage.assertGridColumns("WIDE");
  });
  await test.step("Set viewport to DESKTOP and assert grid columns", async () => {
    await propertiesPage.setViewport("DESKTOP");
    await propertiesPage.assertGridColumns("DESKTOP");
  });
  await test.step("Set viewport to LAPTOP and assert grid columns", async () => {
    await propertiesPage.setViewport("LAPTOP");
    await propertiesPage.assertGridColumns("LAPTOP");
  });
  await test.step("Set viewport to TABLET and assert grid columns", async () => {
    await propertiesPage.setViewport("TABLET");
    await propertiesPage.assertGridColumns("TABLET");
  });
  await test.step("Set viewport to MOBILE and assert grid columns", async () => {
    await propertiesPage.setViewport("MOBILE");
    await propertiesPage.assertGridColumns("MOBILE");
  });
});

test("Properties page filtering and searching functionality", async ({ propertiesPage }) => {
  await propertiesPage.assertFilterAndSearchFunctionality();
});

test("Properties page pagination functionality", async ({ propertiesPage }) => {
  await propertiesPage.assertPaginationFunctionality();
});

test("Properties page console error and image error handling", async ({ propertiesPage }) => {
  await propertiesPage.assertNoConsoleErrors();
  await propertiesPage.assertNoImage404s();
});
