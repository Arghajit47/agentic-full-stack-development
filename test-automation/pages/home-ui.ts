import { expect, type Page, type Locator } from "@playwright/test";
import { HOMEPAGE_LOCATORS } from "@locators/homepage-locators";
import {
  UI_ROUTES,
  UI_TEXT,
  VIEWPORTS,
  FEATURED_GRID_COLS,
  TESTIMONIALS_GRID_COLS,
  STAR_ARIA_TEMPLATE,
  INTEGRATION_TEXT,
  INTEGRATION_COUNTS,
  API_PATHS,
} from "@constants/index";

export interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  imageUrl: string;
}

export interface Review {
  id: number;
  clientName: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  propertyTitle: string | null;
}

type ViewportKey = keyof typeof VIEWPORTS;

/**
 * Page object for the Home page UI components.
 * Owns all Playwright locators and encapsulates all actions and assertions.
 */
export class HomeUI {
  readonly page: Page;
  readonly featuredSection: Locator;
  readonly propertyCards: Locator;
  readonly exploreCta: Locator;
  readonly noProperties: Locator;
  readonly testimonialsSection: Locator;
  readonly reviewCards: Locator;
  readonly noReviews: Locator;
  readonly featuredHeading: Locator;
  readonly featuredSubheading: Locator;
  readonly testimonialsHeading: Locator;
  readonly testimonialsSubheading: Locator;
  readonly homeError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.featuredSection = page.getByTestId(HOMEPAGE_LOCATORS.featuredSection);
    this.propertyCards = page.getByTestId(HOMEPAGE_LOCATORS.propertyCards);
    this.exploreCta = page.getByTestId(HOMEPAGE_LOCATORS.exploreCta);
    this.noProperties = page.getByTestId(HOMEPAGE_LOCATORS.noProperties);
    this.testimonialsSection = page.getByTestId(HOMEPAGE_LOCATORS.testimonialsSection);
    this.reviewCards = page.getByTestId(HOMEPAGE_LOCATORS.reviewCards);
    this.noReviews = page.getByTestId(HOMEPAGE_LOCATORS.noReviews);
    this.featuredHeading = page.getByTestId(HOMEPAGE_LOCATORS.featuredHeading);
    this.featuredSubheading = page.getByTestId(HOMEPAGE_LOCATORS.featuredSubheading);
    this.testimonialsHeading = page.getByTestId(HOMEPAGE_LOCATORS.testimonialsHeading);
    this.testimonialsSubheading = page.getByTestId(HOMEPAGE_LOCATORS.testimonialsSubheading);
    this.homeError = page.getByTestId(HOMEPAGE_LOCATORS.homeError);
  }

  async verifyAllHomePageFunctionality(): Promise<void> {
    // 1. Fetch live API data to use for dynamic expectations (No hardcoding)
    const requestContext = this.page.request;
    const [settingsRes, propertiesRes, reviewsRes] = await Promise.all([
      requestContext.get(API_PATHS.SETTINGS),
      requestContext.get(API_PATHS.PROPERTIES_FEATURED),
      requestContext.get(API_PATHS.REVIEWS_FEATURED),
    ]);

    expect(settingsRes.status()).toBe(200);
    expect(propertiesRes.status()).toBe(200);
    expect(reviewsRes.status()).toBe(200);

    const settings: Record<string, string> = await settingsRes.json();
    const properties: Property[] = await propertiesRes.json();
    const reviews: Review[] = await reviewsRes.json();

    // 2. Navigate and verify content against live API responses
    await this.page.goto(UI_ROUTES.HOME);
    await this.propertyCards.first().waitFor({ state: "visible" });

    // Assert headings match settings response or fallbacks
    const expectedPropHeading = settings.properties_heading ?? "Featured Properties";
    const expectedPropSubheading = settings.properties_subheading ?? "Explore our handpicked selection of featured properties";
    const expectedReviewHeading = settings.reviews_heading ?? "What Our Clients Say";
    const expectedReviewSubheading = settings.reviews_subheading ?? "Real stories from happy homeowners";

    await expect(this.featuredHeading).toHaveText(expectedPropHeading);
    await expect(this.featuredSubheading).toHaveText(expectedPropSubheading);
    await expect(this.testimonialsHeading).toHaveText(expectedReviewHeading);
    await expect(this.testimonialsSubheading).toHaveText(expectedReviewSubheading);

    // Assert property cards count and content
    const visibleCards = await this.propertyCards.count();
    expect(visibleCards).toBeGreaterThan(0);
    expect(visibleCards).toBeLessThanOrEqual(properties.length);

    for (let i = 0; i < visibleCards; i++) {
      const card = this.propertyCards.nth(i);
      const title = await card.getByRole("heading", { level: 3 }).textContent();
      const match = properties.find((p) => p.title === title);
      expect(match, `Property "${title}" exists in live API`).toBeDefined();

      if (match) {
        await expect(card).toContainText(match.location);
        await expect(card).toContainText(`${match.bedrooms} Beds`);
        await expect(card).toContainText(`${match.bathrooms} Baths`);
        await expect(card).toContainText(`${match.areaSqft.toLocaleString("en-US")} sqft`);
        await expect(card.locator("img")).toHaveAttribute("src", match.imageUrl);
      }
    }

    // Assert reviews cards count and content
    const visibleReviews = await this.reviewCards.count();
    expect(visibleReviews).toBeGreaterThan(0);
    expect(visibleReviews).toBeLessThanOrEqual(reviews.length);

    for (let i = 0; i < visibleReviews; i++) {
      const card = this.reviewCards.nth(i);
      const clientName = await card.locator("h3").first().textContent();
      const match = reviews.find((r) => r.clientName === clientName);
      expect(match, `Review from "${clientName}" exists in live API`).toBeDefined();

      if (match) {
        await expect(card).toContainText(match.reviewText);
        const ariaLabel = STAR_ARIA_TEMPLATE.replace("{rating}", String(match.rating));
        await expect(card.getByRole("img", { name: ariaLabel })).toBeVisible();
        if (match.propertyTitle) {
          await expect(card).toContainText(match.propertyTitle);
        }
      }
    }

    // Verify grid responsive columns
    await this.setViewport("WIDE");
    await this.assertFeaturedGridColumns("WIDE");
    await this.assertTestimonialsGridColumns("WIDE");

    await this.setViewport("DESKTOP");
    await this.assertFeaturedGridColumns("DESKTOP");
    await this.assertTestimonialsGridColumns("DESKTOP");

    await this.setViewport("LAPTOP");
    await this.assertFeaturedGridColumns("LAPTOP");
    await this.assertTestimonialsGridColumns("LAPTOP");

    await this.setViewport("TABLET");
    await this.assertFeaturedGridColumns("TABLET");
    await this.assertTestimonialsGridColumns("TABLET");

    await this.setViewport("MOBILE");
    await this.assertFeaturedGridColumns("MOBILE");
    await this.assertTestimonialsGridColumns("MOBILE");

    // Reset viewport back to desktop
    await this.setViewport("DESKTOP");

    // Assert CTA exists
    await expect(this.exploreCta).toBeVisible();
    await expect(this.exploreCta).toContainText(UI_TEXT.CTA_LABEL);

    // Verify no console errors
    await this.assertNoConsoleErrors();

    // Verify no image 404s
    await this.assertNoImage404s();

    // 3. Verify simulated loading state (with delay)
    await this.assertLoadingSkeletons();

    // 4. Verify simulated empty state
    await this.assertEmptyStates();

    // 5. Verify simulated error state
    await this.assertErrorFallback();
  }

  async setViewport(key: ViewportKey): Promise<void> {
    const vp = VIEWPORTS[key];
    await this.page.setViewportSize({ width: vp.width, height: vp.height });
  }

  async assertFeaturedGridColumns(key: ViewportKey): Promise<void> {
    const grid = this.featuredSection.locator(".grid").first();
    const expected = FEATURED_GRID_COLS[key];
    await assertGridTrackCount(grid, expected, `featured grid ${key}`);
  }

  async assertTestimonialsGridColumns(key: ViewportKey): Promise<void> {
    const grid = this.testimonialsSection.locator(".grid").first();
    const expected = TESTIMONIALS_GRID_COLS[key];
    await assertGridTrackCount(grid, expected, `testimonials grid ${key}`);
  }

  async assertLoadingSkeletons(): Promise<void> {
    const delay = 1000;
    await this.page.route(API_PATHS.PROPERTIES_FEATURED, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const response = await route.fetch();
      await route.fulfill({ response });
    });
    await this.page.route(API_PATHS.REVIEWS_FEATURED, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const response = await route.fetch();
      await route.fulfill({ response });
    });
    await this.page.route(API_PATHS.SETTINGS, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      const response = await route.fetch();
      await route.fulfill({ response });
    });

    await this.page.goto(UI_ROUTES.HOME);
    await expect(this.propertyCards).toHaveCount(0);
    await expect(this.reviewCards).toHaveCount(0);
    await expect(this.featuredSection.locator("[data-testid='property-skeleton']")).toHaveCount(
      INTEGRATION_COUNTS.VISIBLE_CARDS_DESKTOP,
    );
    await expect(this.testimonialsSection.locator("[data-testid='review-skeleton']")).toHaveCount(
      INTEGRATION_COUNTS.VISIBLE_CARDS_DESKTOP,
    );

    await this.page.waitForTimeout(delay + 500);
    await this.page.unrouteAll({ behavior: "ignoreErrors" });
  }

  async assertEmptyStates(): Promise<void> {
    await this.page.route(API_PATHS.PROPERTIES_FEATURED, (route) => route.fulfill({ json: [] }));
    await this.page.route(API_PATHS.REVIEWS_FEATURED, (route) => route.fulfill({ json: [] }));
    await this.page.route(API_PATHS.SETTINGS, (route) => route.fulfill({ json: {} }));

    await this.page.goto(UI_ROUTES.HOME);
    await expect(this.noProperties).toBeVisible();
    await expect(this.noProperties).toHaveText("No properties found");
    await expect(this.noReviews).toBeVisible();
    await expect(this.noReviews).toHaveText("No reviews yet");

    await this.page.unrouteAll({ behavior: "ignoreErrors" });
  }

  async assertErrorFallback(): Promise<void> {
    await this.page.route(API_PATHS.PROPERTIES_FEATURED, (route) => route.abort("failed"));
    await this.page.route(API_PATHS.REVIEWS_FEATURED, (route) => route.abort("failed"));
    await this.page.route(API_PATHS.SETTINGS, (route) => route.abort("failed"));

    await this.page.goto(UI_ROUTES.HOME);
    await this.homeError.waitFor({ state: "visible" });
    await expect(this.homeError).toHaveText(INTEGRATION_TEXT.ERROR_FALLBACK);

    await this.page.unrouteAll({ behavior: "ignoreErrors" });
  }

  async assertNoImage404s(): Promise<void> {
    const failed: string[] = [];
    const listener = (res: import("@playwright/test").Response) => {
      if (res.url().match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && res.status() >= 400) {
        failed.push(res.url());
      }
    };
    this.page.on("response", listener);
    await this.page.goto(UI_ROUTES.HOME);
    await this.page.waitForLoadState("networkidle");
    this.page.off("response", listener);
    expect(failed, "zero image 404s").toEqual([]);
  }

  async assertNoConsoleErrors(): Promise<void> {
    const errors: string[] = [];
    const listener = (e: Error) => errors.push(`pageerror: ${e.message}`);
    const consoleListener = (msg: import("@playwright/test").ConsoleMessage) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    };
    this.page.on("pageerror", listener);
    this.page.on("console", consoleListener);
    await this.page.goto(UI_ROUTES.HOME);
    await this.propertyCards.first().waitFor({ state: "visible" });
    await this.page.waitForTimeout(500);
    this.page.off("pageerror", listener);
    this.page.off("console", consoleListener);
    expect(errors, "zero console/page errors").toEqual([]);
  }
}

async function assertGridTrackCount(
  grid: Locator,
  expectedCols: number,
  label: string,
): Promise<void> {
  const tracks = await grid.evaluate((el: HTMLElement) => {
    const cols = (globalThis as unknown as { getComputedStyle: (e: Element) => { gridTemplateColumns: string } }).getComputedStyle(el).gridTemplateColumns;
    return cols.split(/\s+/).filter((t: string) => t.length > 0).length;
  });
  expect(tracks, `${label} effective cols=${tracks}, expected=${expectedCols}`).toBe(
    expectedCols,
  );
}