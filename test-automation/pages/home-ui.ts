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

  constructor(page: Page) {
    this.page = page;
    this.featuredSection = page.getByTestId(UI_TESTIDS.FEATURED_SECTION);
    this.propertyCards = page.getByTestId(UI_TESTIDS.PROPERTY_CARD);
    this.exploreCta = page.getByTestId(UI_TESTIDS.EXPLORE_CTA);
    this.noProperties = page.getByTestId(UI_TESTIDS.NO_PROPERTIES);
    this.testimonialsSection = page.getByTestId(UI_TESTIDS.TESTIMONIALS_SECTION);
    this.reviewCards = page.getByTestId(UI_TESTIDS.REVIEW_CARD);
    this.noReviews = page.getByTestId(UI_TESTIDS.NO_REVIEWS);
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