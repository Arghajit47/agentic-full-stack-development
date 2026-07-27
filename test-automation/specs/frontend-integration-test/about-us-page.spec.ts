import { test } from "@fixtures/ui-fixtures";

test.describe("About Us Page Suite", () => {
  test("About Us page initial render and default content", async ({ aboutUsPage }) => {
    await aboutUsPage.navigateToAboutUs();
    await aboutUsPage.assertPageRenders();
  });

  test("About Us page section visibility", async ({ aboutUsPage }) => {
    await aboutUsPage.navigateToAboutUs();
    await aboutUsPage.assertSectionsVisible();
  });

  test("About Us page content counts", async ({ aboutUsPage }) => {
    await aboutUsPage.navigateToAboutUs();
    await aboutUsPage.assertContentCounts();
  });

  test("About Us page console error and image error handling", async ({ aboutUsPage }) => {
    await aboutUsPage.assertNoConsoleErrors();
    await aboutUsPage.assertNoImage404s();
  });
});
