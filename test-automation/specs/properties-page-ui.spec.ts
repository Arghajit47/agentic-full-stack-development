import { test } from "@fixtures/ui-fixtures";

test.describe("Properties Page UI — TC-050 to TC-064", () => {
  test.beforeEach(async ({ propertiesUiPage }) => {
    await propertiesUiPage.goto("/properties");
  });

  test("TC-050 renders heading and search inputs", async ({ propertiesUi }) => {
    await propertiesUi.assertHeadingAndInputs();
  });

  test("TC-051 shows loading skeletons then transitions to initial 6 cards", async ({ propertiesUi }) => {
    await propertiesUi.assertLoadingSkeletonsTransition();
  });

  test("TC-052 filtering by Mansion type renders expected results", async ({ propertiesUi }) => {
    await propertiesUi.filterByType("Mansion", 2, "Royal Oak Mansion", "Whispering Pines Mansion");
  });

  test("TC-053 searching for specific property returns matching card", async ({ propertiesUi }) => {
    await propertiesUi.searchFor("Malibu", 1, "Beachfront Estate");
  });

  test("TC-054 pagination navigates between pages", async ({ propertiesUi }) => {
    await propertiesUi.assertPagination("Page 1 of 2", "Page 2 of 2", 4);
  });

  test("TC-061 renders heading 'Find Your Dream Property'", async ({ propertiesUi }) => {
    await propertiesUi.assertHeading();
  });

  test("TC-062 search submit button text is 'Find Property'", async ({ propertiesUi }) => {
    await propertiesUi.assertSearchSubmitBtnText();
  });

  test("TC-063 no console errors on load", async ({ propertiesUi }) => {
    await propertiesUi.assertNoConsoleErrors();
  });

  test("TC-064 property cards render", async ({ propertiesUi }) => {
    await propertiesUi.assertPropertyCardsVisible();
  });
});
