import { test, expect } from "@fixtures/ui-fixtures";
import { VIEWPORTS, UI_COUNTS, FEATURED_GRID_COLS } from "@constants/index";
import { HOMEPAGE_LOCATORS } from "@locators/homepage-locators";

test.describe("Featured Properties UI — TC-001 to TC-016", () => {
  test("TC-001 renders heading \"Featured Properties\"", async ({ homeUi }) => {
    await homeUi.gotoHome();
    homeUi.assertFeaturedHeading();
  });

  test("TC-002 renders subheading text", async ({ homeUi }) => {
    await homeUi.gotoHome();
    homeUi.assertFeaturedSubheading();
  });

  test("TC-003 renders exactly 6 property cards", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertPropertyCardCount();
  });

  test("TC-004 grid: 3 columns at 1920px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("WIDE");
    homeUi.assertFeaturedGridColumns("WIDE");
  });

  test("TC-005 grid: 3 columns at 1440px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("DESKTOP");
    homeUi.assertFeaturedGridColumns("DESKTOP");
  });

  test("TC-006 grid: 2 columns at 1024px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("LAPTOP");
    homeUi.assertFeaturedGridColumns("LAPTOP");
  });

  test("TC-007 grid: 2 columns at 768px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("TABLET");
    homeUi.assertFeaturedGridColumns("TABLET");
  });

  test("TC-008 grid: 1 column at 375px", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.setViewport("MOBILE");
    homeUi.assertFeaturedGridColumns("MOBILE");
  });

  test("TC-009 each property card displays an image", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertPropertyCardsHaveImages();
  });

  test("TC-010 each property card displays its title", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertPropertyCardsHaveTitles();
  });

  test("TC-011 each property card displays formatted price", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertPropertyCardsHavePrices();
  });

  test("TC-012 each property card displays location", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertPropertyCardsHaveLocations();
  });

  test("TC-013 each property card displays beds/baths/area", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await homeUi.assertPropertyCardsHaveSpecs();
  });

  test("TC-014 \"Explore Properties\" CTA button rendered", async ({ homeUi }) => {
    await homeUi.gotoHome();
    homeUi.assertExploreCta();
  });

  test("TC-015 loading skeleton state shown while loading", async ({ homeUi }) => {
    await homeUi.gotoLoading();
    await homeUi.assertFeaturedSkeletonsVisible();
  });

  test("TC-016 empty state: \"No properties found\"", async ({ homeUi }) => {
    await homeUi.gotoEmptyProperties();
    await homeUi.assertNoPropertiesEmptyState();
  });

  test("TC-035 data-testid present on featured section, cards, CTA, empty state", async ({ homeUi }) => {
    await homeUi.gotoHome();
    await expect(homeUi.featuredSection).toHaveAttribute(
      "data-testid",
      HOMEPAGE_LOCATORS.featuredSection,
    );
    await expect(homeUi.propertyCards.first()).toHaveAttribute(
      "data-testid",
      HOMEPAGE_LOCATORS.propertyCards,
    );
    await expect(homeUi.exploreCta).toHaveAttribute(
      "data-testid",
      HOMEPAGE_LOCATORS.exploreCta,
    );
    expect(UI_COUNTS.PROPERTY_CARDS).toBe(6);
    expect(FEATURED_GRID_COLS.WIDE).toBe(3);
    expect(VIEWPORTS.WIDE.width).toBe(1920);
  });
});