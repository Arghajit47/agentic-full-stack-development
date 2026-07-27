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

  test("About Us page live API data vs UI validation", async ({ aboutUsPage }) => {
    await aboutUsPage.assertHeadingsAndCountsMatchApi();
  });

  test("About Us page loading skeleton", async ({ aboutUsPage }) => {
    await aboutUsPage.assertLoadingSkeleton();
  });

  test("About Us page empty state", async ({ aboutUsPage }) => {
    await aboutUsPage.assertEmptyState();
  });

  test("About Us page error state", async ({ aboutUsPage }) => {
    await aboutUsPage.assertErrorState();
  });

  test("About Us page responsive card counts", async ({ aboutUsPage }) => {
    await aboutUsPage.assertResponsiveCardCounts();
  });

  test("About Us page console error and image error handling", async ({ aboutUsPage }) => {
    await aboutUsPage.assertNoConsoleErrors();
    await aboutUsPage.assertNoImage404s();
  });
});
