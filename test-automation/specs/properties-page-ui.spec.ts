import { test } from "@fixtures/ui-fixtures";

test.describe("Properties Page — KAN-58 visual fixes", () => {
  test.beforeEach(async ({ propertiesUiPage }) => {
    await propertiesUiPage.goto("/properties");
  });

  test("TC-061 renders heading 'Find Your Dream Property'", async ({
    propertiesUi,
  }) => {
    await propertiesUi.assertHeading();
  });

  test("TC-062 search submit button text is 'Find Property'", async ({
    propertiesUi,
  }) => {
    await propertiesUi.assertSearchSubmitBtnText();
  });

  test("TC-063 no console errors on load", async ({ propertiesUi }) => {
    await propertiesUi.assertNoConsoleErrors();
  });

  test("TC-064 property cards render", async ({ propertiesUi }) => {
    await propertiesUi.assertPropertyCardsVisible();
  });
});
