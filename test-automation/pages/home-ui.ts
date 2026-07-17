import { expect, type Page, type Locator } from "@playwright/test";
import {
  UI_ROUTES,
  UI_TESTIDS,
  UI_TEXT,
  UI_COUNTS,
  VIEWPORTS,
  FEATURED_GRID_COLS,
  TESTIMONIALS_GRID_COLS,
  FEATURED_PROPERTY_MOCKS,
  TESTIMONIAL_MOCKS,
  STAR_ARIA_TEMPLATE,
  INTEGRATION_TEXT,
  INTEGRATION_TESTIDS,
  INTEGRATION_COUNTS,
  PRICE_FORMAT,
  STUB_IMAGE,
  API_PATHS,
} from "@constants/index";

type ViewportKey = keyof typeof VIEWPORTS;
type GridCols = typeof FEATURED_GRID_COLS | typeof TESTIMONIALS_GRID_COLS;

/**
 * Page object for the home-page UI components (FeaturedProperties + Testimonials).
 * Owns all Playwright locators, viewport switching, and assertions.
 * Specs call methods only — no Playwright primitives leak into spec files.
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
    this.featuredSection = page.getByTestId(UI_TESTIDS.FEATURED_SECTION);
    this.propertyCards = page.getByTestId(UI_TESTIDS.PROPERTY_CARD);
    this.exploreCta = page.getByTestId(UI_TESTIDS.EXPLORE_CTA);
    this.noProperties = page.getByTestId(UI_TESTIDS.NO_PROPERTIES);
    this.testimonialsSection = page.getByTestId(UI_TESTIDS.TESTIMONIALS_SECTION);
    this.reviewCards = page.getByTestId(UI_TESTIDS.REVIEW_CARD);
    this.noReviews = page.getByTestId(UI_TESTIDS.NO_REVIEWS);
    this.featuredHeading = page.getByTestId(INTEGRATION_TESTIDS.FEATURED_HEADING);
    this.featuredSubheading = page.getByTestId(INTEGRATION_TESTIDS.FEATURED_SUBHEADING);
    this.testimonialsHeading = page.getByTestId(INTEGRATION_TESTIDS.TESTIMONIALS_HEADING);
    this.testimonialsSubheading = page.getByTestId(INTEGRATION_TESTIDS.TESTIMONIALS_SUBHEADING);
    this.homeError = page.getByTestId(INTEGRATION_TESTIDS.HOME_ERROR);
  }

  async gotoHome(): Promise<void> {
    await this.page.goto(UI_ROUTES.HOME);
    // Home page has an 800ms setTimeout that flips loading→false.
    // Wait for property cards to appear, not just the section wrapper.
    await this.propertyCards.first().waitFor({ state: "visible" });
  }

  async gotoEmptyProperties(): Promise<void> {
    await this.page.goto(UI_ROUTES.EMPTY_PROPERTIES);
    await this.featuredSection.waitFor({ state: "visible" });
  }

  async gotoEmptyReviews(): Promise<void> {
    await this.page.goto(UI_ROUTES.EMPTY_REVIEWS);
    await this.testimonialsSection.waitFor({ state: "visible" });
  }

  async gotoLoading(): Promise<void> {
    await this.page.goto(UI_ROUTES.LOADING);
    await this.featuredSection.waitFor({ state: "visible" });
  }

  async setViewport(key: ViewportKey): Promise<void> {
    const vp = VIEWPORTS[key];
    await this.page.setViewportSize({ width: vp.width, height: vp.height });
  }

  // ── Featured Properties assertions ──────────────────────────────

  assertFeaturedHeading(): void {
    expect(this.featuredSection.getByRole("heading", { level: 2 })).toHaveText(
      UI_TEXT.FEATURED_HEADING,
    );
  }

  assertFeaturedSubheading(): void {
    expect(
      this.featuredSection.locator("p").first(),
      "featured subheading text",
    ).toHaveText(UI_TEXT.FEATURED_SUBHEADING);
  }

  async assertPropertyCardCount(): Promise<void> {
    await expect(this.propertyCards).toHaveCount(UI_COUNTS.PROPERTY_CARDS);
  }

  assertExploreCta(): void {
    expect(this.exploreCta).toBeVisible();
    expect(this.exploreCta).toContainText(UI_TEXT.CTA_LABEL);
  }

  async assertNoPropertiesEmptyState(): Promise<void> {
    await expect(this.noProperties).toBeVisible();
    await expect(this.noProperties).toHaveText(UI_TEXT.NO_PROPERTIES);
  }

  async assertPropertyCardsHaveImages(): Promise<void> {
    const imgs = this.propertyCards.locator("img");
    await expect(imgs).toHaveCount(UI_COUNTS.PROPERTY_CARDS);
    for (let i = 0; i < UI_COUNTS.PROPERTY_CARDS; i++) {
      await expect(imgs.nth(i)).toHaveAttribute("src", /.+/);
      await expect(imgs.nth(i)).toHaveAttribute("alt", /.+/);
    }
  }

  async assertPropertyCardsHaveTitles(): Promise<void> {
    for (let i = 0; i < FEATURED_PROPERTY_MOCKS.length; i++) {
      const card = this.propertyCards.nth(i);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(
        FEATURED_PROPERTY_MOCKS[i].title,
      );
    }
  }

  async assertPropertyCardsHavePrices(): Promise<void> {
    for (let i = 0; i < FEATURED_PROPERTY_MOCKS.length; i++) {
      const card = this.propertyCards.nth(i);
      await expect(card).toContainText(FEATURED_PROPERTY_MOCKS[i].priceFormatted);
    }
  }

  async assertPropertyCardsHaveLocations(): Promise<void> {
    for (let i = 0; i < FEATURED_PROPERTY_MOCKS.length; i++) {
      const card = this.propertyCards.nth(i);
      await expect(card).toContainText(FEATURED_PROPERTY_MOCKS[i].location);
    }
  }

  async assertPropertyCardsHaveSpecs(): Promise<void> {
    for (let i = 0; i < FEATURED_PROPERTY_MOCKS.length; i++) {
      const card = this.propertyCards.nth(i);
      const m = FEATURED_PROPERTY_MOCKS[i];
      await expect(card).toContainText(`${m.bedrooms} Beds`);
      await expect(card).toContainText(`${m.bathrooms} Baths`);
      await expect(card).toContainText(`${m.areaSqft.toLocaleString("en-US")} sqft`);
    }
  }

  async assertFeaturedGridColumns(key: ViewportKey): Promise<void> {
    const grid = this.featuredSection.locator(".grid").first();
    const expected = FEATURED_GRID_COLS[key];
    await assertGridTrackCount(grid, expected, `featured grid ${key}`);
  }

  // ── Testimonials assertions ─────────────────────────────────────

  assertTestimonialsHeading(): void {
    expect(
      this.testimonialsSection.getByRole("heading", { level: 2 }),
    ).toHaveText(UI_TEXT.TESTIMONIALS_HEADING);
  }

  assertTestimonialsSubheading(): void {
    expect(
      this.testimonialsSection.locator("p").first(),
      "testimonials subheading text",
    ).toHaveText(UI_TEXT.TESTIMONIALS_SUBHEADING);
  }

  async assertReviewCardCount(): Promise<void> {
    await expect(this.reviewCards).toHaveCount(UI_COUNTS.REVIEW_CARDS);
  }

  async assertNoReviewsEmptyState(): Promise<void> {
    await expect(this.noReviews).toBeVisible();
    await expect(this.noReviews).toHaveText(UI_TEXT.NO_REVIEWS);
  }

  async assertReviewCardsHaveAvatars(): Promise<void> {
    const imgs = this.reviewCards.locator("img");
    await expect(imgs).toHaveCount(UI_COUNTS.REVIEW_CARDS);
    for (let i = 0; i < UI_COUNTS.REVIEW_CARDS; i++) {
      await expect(imgs.nth(i)).toHaveAttribute("src", /.+/);
      await expect(imgs.nth(i)).toHaveAttribute("alt", /.+/);
    }
  }

  async assertReviewCardsHaveClientNames(): Promise<void> {
    for (let i = 0; i < TESTIMONIAL_MOCKS.length; i++) {
      const card = this.reviewCards.nth(i);
      await expect(card).toContainText(TESTIMONIAL_MOCKS[i].clientName);
    }
  }

  async assertReviewCardsHaveStarRatings(): Promise<void> {
    for (let i = 0; i < TESTIMONIAL_MOCKS.length; i++) {
      const card = this.reviewCards.nth(i);
      const rating = TESTIMONIAL_MOCKS[i].rating;
      const ariaLabel = STAR_ARIA_TEMPLATE.replace("{rating}", String(rating));
      const ratingEl = card.getByRole("img", { name: ariaLabel });
      await expect(ratingEl, `card ${i} rating=${rating}`).toBeVisible();
    }
  }

  async assertReviewCardsHaveReviewText(): Promise<void> {
    for (let i = 0; i < UI_COUNTS.REVIEW_CARDS; i++) {
      const card = this.reviewCards.nth(i);
      // Review text is wrapped in smart quotes — assert the card has a non-empty paragraph.
      const textP = card.locator("p").last();
      const text = await textP.textContent();
      expect(text, `card ${i} has review text`).toBeTruthy();
      expect(text!.trim().length, `card ${i} review text non-empty`).toBeGreaterThan(0);
    }
  }

  async assertReviewCardPropertyTitleVisibility(): Promise<void> {
    // One review (David Thompson) has propertyTitle=null → must NOT render the title span.
    // The other four must render their propertyTitle.
    for (let i = 0; i < TESTIMONIAL_MOCKS.length; i++) {
      const card = this.reviewCards.nth(i);
      const mock = TESTIMONIAL_MOCKS[i];
      if (mock.propertyTitle === null) {
        const nameSpan = card.locator("span").filter({ hasText: mock.clientName });
        // The clientName span should exist, but no sibling propertyTitle span.
        const sibling = nameSpan.locator(" + span");
        await expect(sibling, `card ${i} no propertyTitle`).toHaveCount(0);
      } else {
        await expect(card, `card ${i} shows propertyTitle`).toContainText(
          mock.propertyTitle,
        );
      }
    }
  }

  async assertTestimonialsGridColumns(key: ViewportKey): Promise<void> {
    const grid = this.testimonialsSection.locator(".grid").first();
    const expected = TESTIMONIALS_GRID_COLS[key];
    await assertGridTrackCount(grid, expected, `testimonials grid ${key}`);
  }

  // ── Loading skeleton assertions ─────────────────────────────────

  async assertFeaturedSkeletonsVisible(): Promise<void> {
    // Skeleton state: 6 skeleton divs, no property-card articles, no CTA, no empty state.
    await expect(this.propertyCards).toHaveCount(0);
    await expect(this.exploreCta).toHaveCount(0);
    await expect(this.noProperties).toHaveCount(0);
    const skeletons = this.featuredSection.locator(".animate-pulse");
    await expect(skeletons).toHaveCount(UI_COUNTS.SKELETON_PROPERTY);
  }

  async assertTestimonialsSkeletonsVisible(): Promise<void> {
    await expect(this.reviewCards).toHaveCount(0);
    await expect(this.noReviews).toHaveCount(0);
    const skeletons = this.testimonialsSection.locator(".animate-pulse");
    await expect(skeletons).toHaveCount(UI_COUNTS.SKELETON_REVIEW);
  }

  // ── Cross-cutting assertions ────────────────────────────────────

  async assertNoConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    this.page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });
    // Re-navigate to capture errors from a fresh load.
    await this.page.goto(UI_ROUTES.HOME);
    await this.featuredSection.waitFor({ state: "visible" });
    await this.page.waitForTimeout(500);
    expect(errors, "zero console/page errors").toEqual([]);
    return errors;
  }

  // ── KAN-8 integration helpers ─────────────────────────────────────

  async interceptFeaturedRoutes(): Promise<void> {
    await this.page.route(API_PATHS.PROPERTIES_FEATURED, (route) => route.continue());
    await this.page.route(API_PATHS.REVIEWS_FEATURED, (route) => route.continue());
    await this.page.route(API_PATHS.SETTINGS, (route) => route.continue());
  }

  async assertApiCalls(): Promise<void> {
    const responses: Record<string, boolean> = {};
    this.page.on("response", (res) => {
      const url = res.url();
      if (url.includes(API_PATHS.PROPERTIES_FEATURED)) responses[API_PATHS.PROPERTIES_FEATURED] = true;
      if (url.includes(API_PATHS.REVIEWS_FEATURED)) responses[API_PATHS.REVIEWS_FEATURED] = true;
      if (url.includes(API_PATHS.SETTINGS)) responses[API_PATHS.SETTINGS] = true;
    });
    await this.gotoHome();
    await expect.poll(() => responses[API_PATHS.PROPERTIES_FEATURED]).toBe(true);
    await expect.poll(() => responses[API_PATHS.REVIEWS_FEATURED]).toBe(true);
    await expect.poll(() => responses[API_PATHS.SETTINGS]).toBe(true);
  }

  async assertHeadingsFromSettings(): Promise<void> {
    await expect(this.featuredHeading).toHaveText(INTEGRATION_TEXT.SEED_PROPERTIES_HEADING);
    await expect(this.featuredSubheading).toHaveText(INTEGRATION_TEXT.SEED_PROPERTIES_SUBHEADING);
    await expect(this.testimonialsHeading).toHaveText(INTEGRATION_TEXT.SEED_REVIEWS_HEADING);
    await expect(this.testimonialsSubheading).toHaveText(INTEGRATION_TEXT.SEED_REVIEWS_SUBHEADING);
  }

  async assertLoadingSkeletons(): Promise<void> {
    // Delay API responses so the loading skeletons are visible on initial paint.
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
    // While API calls are delayed, cards should not yet be rendered.
    await expect(this.propertyCards).toHaveCount(0);
    await expect(this.reviewCards).toHaveCount(0);
    await expect(this.featuredSection.locator("[data-testid='property-skeleton']")).toHaveCount(
      INTEGRATION_COUNTS.VISIBLE_CARDS_DESKTOP,
    );
    await expect(this.testimonialsSection.locator("[data-testid='review-skeleton']")).toHaveCount(
      INTEGRATION_COUNTS.VISIBLE_CARDS_DESKTOP,
    );
    // Wait for delayed routes to finish fulfilling before cleanup so handlers don't error.
    await this.page.waitForTimeout(delay + 500);
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

  async assertCurrencyFormat(price: number, expected: string): Promise<void> {
    const formatter = new Intl.NumberFormat(PRICE_FORMAT.LOCALE, {
      style: "currency",
      currency: PRICE_FORMAT.CURRENCY,
      maximumFractionDigits: PRICE_FORMAT.MAX_FRACTION_DIGITS,
    });
    expect(formatter.format(price)).toBe(expected);
  }

  async assertFirstPropertyPriceFormatted(): Promise<void> {
    const firstCard = this.propertyCards.first();
    const priceContainer = firstCard.locator("[data-testid^='property-price-']");
    const priceText = await priceContainer.textContent();
    expect(priceText, "price text present").toBeTruthy();
    expect(priceText, "USD currency format").toMatch(/\$\d{1,3}(,\d{3})+/);
  }

  async assertStarRatingForFirstReview(): Promise<void> {
    const firstCard = this.reviewCards.first();
    const stars = firstCard.locator("[data-testid^='review-stars-']").locator("svg");
    await expect(stars).toHaveCount(INTEGRATION_COUNTS.STAR_TOTAL);
    const starClasses = await stars.evaluateAll((nodes: SVGSVGElement[]) =>
      nodes.map((n) => n.getAttribute("class") ?? ""),
    );
    const filledCount = starClasses.filter((c) => c.includes("fill-[#703BF7]")).length;
    const emptyCount = starClasses.filter((c) => c.includes("text-zinc-700")).length;
    expect(filledCount, "filled star count").toBe(TESTIMONIAL_MOCKS[0].rating);
    expect(emptyCount, "empty star count").toBe(
      INTEGRATION_COUNTS.STAR_TOTAL - TESTIMONIAL_MOCKS[0].rating,
    );
  }

  async assertAllImagesLoaded(): Promise<void> {
    await this.gotoHome();
    await this.page.route(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i, (route) =>
      route.fulfill({
        contentType: STUB_IMAGE.CONTENT_TYPE,
        body: Buffer.from(STUB_IMAGE.BASE64, "base64"),
      }),
    );
    // A reload is needed after route interception so the browser fetches the stubbed image.
    await this.page.goto(UI_ROUTES.HOME);
    await this.propertyCards.first().waitFor({ state: "visible" });
    const broken = await expect.poll(
      async () => {
        return await this.page.evaluate((): string[] => {
          return Array.from(document.querySelectorAll("img"))
            .map((el) => el as HTMLImageElement)
            .filter((img) => img.naturalWidth === 0)
            .map((img) => img.src);
        });
      },
      { message: "all images loaded", timeout: 10_000 },
    ).toEqual([]);
    await this.page.unrouteAll({ behavior: "ignoreErrors" });
  }

  async assertNoImage404s(): Promise<void> {
    const failed: string[] = [];
    this.page.on("response", (res) => {
      if (res.url().match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && res.status() >= 400) {
        failed.push(res.url());
      }
    });
    await this.gotoHome();
    await this.page.waitForLoadState("networkidle");
    expect(failed, "zero image 404s").toEqual([]);
  }

  async clickFirstPropertyCardAndCaptureSlug(): Promise<string> {
    const logs: string[] = [];
    this.page.on("console", (msg) => {
      if (msg.type() === "log") logs.push(msg.text());
    });
    const firstCard = this.propertyCards.first();
    const button = firstCard.getByRole("button", { name: "View property details" });
    await button.click();
    await expect.poll(() => logs.length).toBeGreaterThan(0);
    return logs[logs.length - 1];
  }
}

/**
 * Assert the effective CSS grid column count at the current viewport by reading
 * `getComputedStyle(grid).gridTemplateColumns` and counting the track definitions.
 * This is the only reliable way to verify responsive Tailwind grids — the class
 * string is static (e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3`)
 * and only the browser knows which breakpoint is active.
 */
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