import { test, expect } from "@fixtures/ui-fixtures";
import { VIEWPORTS, UI_TESTIDS, UI_COUNTS, TESTIMONIALS_GRID_COLS } from "@constants/index";

test.describe("Testimonials UI — TC-017 to TC-031, TC-034", () => {
  test("TC-017 renders heading \"What Our Clients Say\"", async ({ homeUi }) => {
    await homeUi.gotoHome();
    homeUi.assertTestimonialsHeading();
  });

  test("TC-018 renders subheading text", async ({ homeUi }) => {
    await homeUi.gotoHome();
    homeUi.assertTestimonialsSubheading();
  });

  test("TC-019 renders up to 5 review cards", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertReviewCardCount();
  });

  test("TC-020 grid: 3 columns at 1920px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("WIDE");
    homeUi.assertTestimonialsGridColumns("WIDE");
  });

  test("TC-021 grid: 3 columns at 1440px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("DESKTOP");
    homeUi.assertTestimonialsGridColumns("DESKTOP");
  });

  test("TC-022 grid: 2 columns at 1024px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("LAPTOP");
    homeUi.assertTestimonialsGridColumns("LAPTOP");
  });

  test("TC-023 grid: 1 column at 768px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("TABLET");
    homeUi.assertTestimonialsGridColumns("TABLET");
  });

  test("TC-024 grid: 1 column at 375px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("MOBILE");
    homeUi.assertTestimonialsGridColumns("MOBILE");
  });

  test("TC-025 each review card displays avatar image", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertReviewCardsHaveAvatars();
  });

  test("TC-026 each review card displays client name", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertReviewCardsHaveClientNames();
  });

  test("TC-027 each review card displays star rating (role=\"img\")", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertReviewCardsHaveStarRatings();
  });

  test("TC-028 each review card displays review text", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertReviewCardsHaveReviewText();
  });

  test("TC-029 propertyTitle shown when present, hidden when absent", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertReviewCardPropertyTitleVisibility();
  });

  test("TC-030 loading skeleton state shown while loading", async ({ homeUi }) => {
    await homeUi.gotoLoading();
    await homeUi.assertTestimonialsSkeletonsVisible();
  });

  test("TC-031 empty state: \"No reviews yet\"", async ({ homeUi }) => {
    await homeUi.gotoEmptyReviews();
    await homeUi.assertNoReviewsEmptyState();
  });

  test("TC-034 no console errors on page load", async ({ homeUi }) => {
    await homeUi.assertNoConsoleErrors();
  });

  test("TC-035 data-testid present on testimonials section, cards, empty state", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await expect(homeUi.testimonialsSection).toHaveAttribute(
      "data-testid",
      UI_TESTIDS.TESTIMONIALS_SECTION,
    );
    await expect(homeUi.reviewCards.first()).toHaveAttribute(
      "data-testid",
      UI_TESTIDS.REVIEW_CARD,
    );
    expect(UI_COUNTS.REVIEW_CARDS).toBe(5);
    expect(TESTIMONIALS_GRID_COLS.WIDE).toBe(3);
    expect(VIEWPORTS.WIDE.width).toBe(1920);
  });
});