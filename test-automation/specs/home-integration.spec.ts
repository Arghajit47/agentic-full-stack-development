import { test, expect } from "@fixtures/ui-fixtures";
import { UI_COUNTS, FEATURED_PROPERTY_MOCKS, TESTIMONIAL_MOCKS, UI_TEXT } from "@constants/index";

test.describe("Home page integration — TC-001 to TC-010", () => {
  test("TC-001 home page fetches featured properties and renders cards", async ({ homeUi }) => {
    await homeUi.assertApiCalls();
    await expect(homeUi.propertyCards.first()).toBeVisible();
  });

  test("TC-002 home page fetches featured reviews and renders testimonials", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await expect(homeUi.reviewCards.first()).toBeVisible();
  });

  test("TC-003 settings headings override defaults in both sections", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertHeadingsFromSettings();
  });

  test("TC-004 loading skeleton visible before data loads", async ({ homeUi }) => {
    await homeUi.assertLoadingSkeletons();
  });

  test("TC-005 empty state renders when APIs return empty arrays", async ({ homeUi }) => {
    await homeUi.gotoEmptyProperties();
    await homeUi.assertNoPropertiesEmptyState();
    await homeUi.gotoEmptyReviews();
    await homeUi.assertNoReviewsEmptyState();
  });

  test("TC-006 error state renders fallback message on fetch failure", async ({ homeUi }) => {
    await homeUi.assertErrorFallback();
  });

  test("TC-007 property card click logs slug to console", async ({ homeUi }) => {
    await homeUi.gotoHome();
    const slug = await homeUi.clickFirstPropertyCardAndCaptureSlug();
    expect(slug.length).toBeGreaterThan(0);
  });

  test("TC-008 currency formatting displays price as $1,250,000", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertFirstPropertyPriceFormatted();
  });

  test("TC-009 star rating renders filled and empty icons", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertStarRatingForFirstReview();
  });

  test("TC-010 all images load successfully with no 404s", async ({ homeUi }) => {
    await homeUi.assertNoImage404s();
  });
});
