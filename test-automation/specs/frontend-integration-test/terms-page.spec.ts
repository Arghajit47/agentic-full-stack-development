import { test } from "@fixtures/ui-fixtures";

test.describe("Terms Page Suite", () => {
  test("Terms page initial render and heading", async ({ termsPage }) => {
    await termsPage.navigateToTerms();
    await termsPage.assertPageRenders();
  });

  test("Terms page all sections visible", async ({ termsPage }) => {
    await termsPage.navigateToTerms();
    await termsPage.assertAllSectionsVisible();
  });

  test("Terms page section headings correct", async ({ termsPage }) => {
    await termsPage.navigateToTerms();
    await termsPage.assertSectionHeadings();
  });

  test("Terms page contact section has email link", async ({ termsPage }) => {
    await termsPage.navigateToTerms();
    await termsPage.assertContactSectionHasEmail();
  });

  test("Terms page last updated text visible", async ({ termsPage }) => {
    await termsPage.navigateToTerms();
    await termsPage.assertLastUpdatedVisible();
  });

  test("Terms page no console errors", async ({ termsPage }) => {
    await termsPage.assertNoConsoleErrors();
  });
});
