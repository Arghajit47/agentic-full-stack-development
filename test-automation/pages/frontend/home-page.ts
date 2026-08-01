import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { ApiHelper } from "@base/api-base";
import { HOMEPAGE_LOCATORS } from "@locators/homepage-locators";
import {
  UI_ROUTES,
  VIEWPORTS,
  FEATURED_GRID_COLS,
  TESTIMONIALS_GRID_COLS,
  HERO_GRID_COLS,
  ERROR_MESSAGES,
  INTEGRATION_COUNTS,
  API_PATHS,
  HOMEPAGE_CONSTANTS,
  UI_TEXT,
  type Property,
  type Review,
} from "@constants/index";

type ViewportKey = keyof typeof VIEWPORTS;

/**
 * Page object for the Home page UI components.
 * Strictly uses InitializationPage methods and HOMEPAGE_LOCATORS.
 */
export class HomePage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async navigateHomePage() {
    await this.initializationPage.goto(UI_ROUTES.HOME);
  }

  async setViewport(key: ViewportKey): Promise<void> {
    const vp = VIEWPORTS[key];
    await this.initializationPage.setViewport(vp);
  }

  async assertFeaturedGridColumns(key: ViewportKey): Promise<void> {
    const expected = FEATURED_GRID_COLS[key];
    await this.initializationPage.assertGridTrackCount(
      HOMEPAGE_LOCATORS.featuredGrid,
      expected,
      `featured grid ${key}`
    );
  }

  async assertTestimonialsGridColumns(key: ViewportKey): Promise<void> {
    const expected = TESTIMONIALS_GRID_COLS[key];
    await this.initializationPage.assertGridTrackCount(
      HOMEPAGE_LOCATORS.testimonialsGrid,
      expected,
      `testimonials grid ${key}`
    );
  }

  async assertHeroGridColumns(key: ViewportKey): Promise<void> {
    const expected = HERO_GRID_COLS[key];
    await this.initializationPage.assertGridTrackCount(
      HOMEPAGE_LOCATORS.heroGrid,
      expected,
      `hero grid ${key}`
    );
  }

  async assertLiveApiDataValidation(): Promise<void> {
    const [properties, reviews] = await Promise.all([
      this.apiHelper.getRequest(API_PATHS.PROPERTIES_FEATURED) as Promise<Property[]>,
      this.apiHelper.getRequest(API_PATHS.REVIEWS_FEATURED) as Promise<Review[]>,
    ]);

    await this.initializationPage.goto(UI_ROUTES.HOME);

    // Validate headings using constants from homepage-constants.ts
    await this.initializationPage.expectText(
      HOMEPAGE_LOCATORS.featuredHeading,
      UI_TEXT.FEATURED_HEADING
    );
    await this.initializationPage.expectText(
      HOMEPAGE_LOCATORS.testimonialsHeading,
      UI_TEXT.TESTIMONIALS_HEADING
    );

    // Modular card validation for Properties
    await this.initializationPage.validateCardsDataAgainstApi<Property>(
      HOMEPAGE_LOCATORS.propertyCards,
      HOMEPAGE_LOCATORS.noProperties,
      properties,
      HOMEPAGE_LOCATORS.propertyTitles,
      (item, title) => item.title === title,
      async (cardIndex, item) => {
        await this.initializationPage.expectTextContains(
          HOMEPAGE_LOCATORS.propertyCards,
          `${item.bedrooms}`,
          cardIndex
        );
        await this.initializationPage.expectTextContains(
          HOMEPAGE_LOCATORS.propertyCards,
          `${item.bathrooms}`,
          cardIndex
        );
        await this.initializationPage.expectAttribute(
          HOMEPAGE_LOCATORS.propertyImages,
          "src",
          item.imageUrl,
          cardIndex
        );
      }
    );

    // Modular card validation for Reviews
    await this.initializationPage.validateCardsDataAgainstApi<Review>(
      HOMEPAGE_LOCATORS.reviewCards,
      HOMEPAGE_LOCATORS.noReviews,
      reviews,
      HOMEPAGE_LOCATORS.reviewTitles,
      (item, title) => item.clientName === title,
      async (cardIndex, item) => {
        await this.initializationPage.expectTextContains(
          HOMEPAGE_LOCATORS.reviewCards,
          item.reviewText,
          cardIndex
        );
        await this.initializationPage.expectTextContains(
          HOMEPAGE_LOCATORS.reviewCards,
          item.clientLocation,
          cardIndex
        );
        if (item.reviewTitle) {
          await this.initializationPage.expectTextContains(
            HOMEPAGE_LOCATORS.reviewCards,
            item.reviewTitle,
            cardIndex
          );
        }
      }
    );
  }

  async assertLoadingSkeletons(): Promise<void> {
    const delay = 1000;
    await this.initializationPage.mockDelayRoute(API_PATHS.PROPERTIES_FEATURED, delay);
    await this.initializationPage.mockDelayRoute(API_PATHS.REVIEWS_FEATURED, delay);

    await this.initializationPage.goto(UI_ROUTES.HOME);
    await this.initializationPage.expectCount(HOMEPAGE_LOCATORS.propertyCards, 0);
    await this.initializationPage.expectCount(HOMEPAGE_LOCATORS.reviewCards, 0);

    await this.initializationPage.expectCount(
      HOMEPAGE_LOCATORS.propertySkeleton,
      INTEGRATION_COUNTS.VISIBLE_CARDS_DESKTOP
    );
    await this.initializationPage.expectCount(
      HOMEPAGE_LOCATORS.reviewSkeleton,
      INTEGRATION_COUNTS.VISIBLE_CARDS_DESKTOP
    );

    await this.initializationPage.waitForSomeTime(delay);
    await this.initializationPage.clearNetworkLogs();
  }

  async assertEmptyStates(): Promise<void> {
    await this.initializationPage.mockJsonResponse(API_PATHS.PROPERTIES_FEATURED, []);
    await this.initializationPage.mockJsonResponse(API_PATHS.REVIEWS_FEATURED, []);

    await this.initializationPage.goto(UI_ROUTES.HOME);
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.noProperties);
    await this.initializationPage.expectText(
      HOMEPAGE_LOCATORS.noProperties,
      HOMEPAGE_CONSTANTS.NO_PROPERTIES_TEXT
    );
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.noReviews);
    await this.initializationPage.expectText(
      HOMEPAGE_LOCATORS.noReviews,
      HOMEPAGE_CONSTANTS.NO_REVIEWS_TEXT
    );

    await this.initializationPage.clearNetworkLogs();
  }

  async assertErrorFallback(): Promise<void> {
    await this.initializationPage.mockAbortRoute(API_PATHS.PROPERTIES_FEATURED, "failed");
    await this.initializationPage.mockAbortRoute(API_PATHS.REVIEWS_FEATURED, "failed");

    await this.initializationPage.goto(UI_ROUTES.HOME);
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.homeError);
    await this.initializationPage.expectText(
      HOMEPAGE_LOCATORS.homeError,
      ERROR_MESSAGES.ERROR_FALLBACK
    );

    await this.initializationPage.clearNetworkLogs();
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.HOME);
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(
      UI_ROUTES.HOME,
      HOMEPAGE_LOCATORS.propertyCards
    );
  }

  async assertNavbarBannerAbstractDesign(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    const banner = this.initializationPage.page.locator('[data-testid="navbar"] > div').first();
    await expect(banner).toBeVisible();
    const bgImage = await banner.evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bgImage).toContain("abstract-design.png");
  }

  async assertFooterCtaAbstractDesign(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    const ctaSection = this.initializationPage.page.locator('[data-testid="footer"] > div').first();
    await expect(ctaSection).toBeVisible();
    const leftImg = ctaSection.locator('img[src*="abstract-design-left"]');
    const rightImg = ctaSection.locator('img[src*="abstract-design-right"]');
    await expect(leftImg).toBeAttached();
    await expect(rightImg).toBeAttached();
    const leftSrc = await leftImg.getAttribute("src");
    const rightSrc = await rightImg.getAttribute("src");
    expect(leftSrc).toContain("abstract-design-left");
    expect(rightSrc).toContain("abstract-design-right");
  }

  async assertDiscoverBadgePosition(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);

    // Mobile (375px): badge must be on the LEFT side of the hero image
    await this.initializationPage.setViewport({ width: 375, height: 812 });
    const badge375 = this.initializationPage.page.locator(HOMEPAGE_LOCATORS.discoverBadge);
    const image375 = this.initializationPage.page.locator(HOMEPAGE_LOCATORS.heroImage);
    await expect(badge375).toBeVisible();
    const badgeBox375 = await badge375.boundingBox();
    const imageBox375 = await image375.boundingBox();
    expect(badgeBox375).not.toBeNull();
    expect(imageBox375).not.toBeNull();
    // Badge should be in the left half of the image
    expect(badgeBox375!.x).toBeLessThan(imageBox375!.x + imageBox375!.width / 2);

    // Desktop (1440px): badge must be on the RIGHT side of the hero image
    await this.initializationPage.setViewport({ width: 1440, height: 900 });
    const badge1440 = this.initializationPage.page.locator(HOMEPAGE_LOCATORS.discoverBadge);
    const image1440 = this.initializationPage.page.locator(HOMEPAGE_LOCATORS.heroImage);
    await expect(badge1440).toBeVisible();
    const badgeBox1440 = await badge1440.boundingBox();
    const imageBox1440 = await image1440.boundingBox();
    expect(badgeBox1440).not.toBeNull();
    expect(imageBox1440).not.toBeNull();
    // Badge should be in the right half of the image
    expect(badgeBox1440!.x).toBeGreaterThan(imageBox1440!.x + imageBox1440!.width / 2);
  }

  async assertFeaturedNavDots(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    await this.initializationPage.setViewport({ width: 375, height: 812 });
    // Wait for SWR data to load
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.featuredSection);
    await this.initializationPage.expectCount(HOMEPAGE_LOCATORS.propertyCards, 1);
    // Navigation dots must be present
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.navDots);
    // Prev arrow must be visible and below the card (not overlaid on image)
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.prevArrow);
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.nextArrow);
    // Mobile-only "View All Properties" CTA must be visible at 375px
    await this.initializationPage.expectVisible(HOMEPAGE_LOCATORS.viewAllMobileCta);
    // First dot must be active (bg-[#703BF7])
    const activeDot = await this.initializationPage.page.locator('[data-testid="nav-dot-0"]');
    await expect(activeDot).toHaveClass(/bg-\[#703BF7\]/);
  }
}