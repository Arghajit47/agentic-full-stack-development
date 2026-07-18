import { test, expect } from "@fixtures/properties-fixtures";

test.describe("Properties Page — KAN-58 visual fixes", () => {
  test.beforeEach(async ({ propertiesUiPage }) => {
    await propertiesUiPage.goto("http://localhost:3000/properties");
  });

  test("TC-061 renders heading 'Find Your Dream Property'", async ({
    propertiesUi,
  }) => {
    propertiesUi.assertHeading();
  });

  test("TC-062 search submit button text is 'Find Property'", async ({
    propertiesUi,
  }) => {
    propertiesUi.assertSearchSubmitBtnText();
  });

  test("TC-063 no console errors on load", async ({ propertiesUi }) => {
    await propertiesUi.assertNoConsoleErrors();
  });

  test("TC-064 property cards render", async ({ propertiesUi }) => {
    await propertiesUi.assertPropertyCardsVisible();
  });
});
