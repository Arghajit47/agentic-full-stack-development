import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { ApiHelper } from "@base/api-base";
import { HOMEPAGE_LOCATORS } from "@locators/homepage-locators";
import {
  UI_ROUTES,
  VIEWPORTS,
  FEATURED_GRID_COLS,
  TESTIMONIALS_GRID_COLS,
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
        if (item.propertyTitle) {
          await this.initializationPage.expectTextContains(
            HOMEPAGE_LOCATORS.reviewCards,
            item.propertyTitle,
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
}