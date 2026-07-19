import { expect, type Page, type Locator } from "@playwright/test";
import { PROPERTIES_LOCATORS } from "@locators/propertiespage-locators";
import { UI_ROUTES, UI_TEXT } from "@constants/index";

/**
 * Page object for the /properties page.
 * Owns all Playwright locators and assertions for the Properties page SearchFilterBar.
 * Specs call methods only — no Playwright primitives leak into spec files.
 */
export class PropertiesUI {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitBtn: Locator;
  readonly propertyGrid: Locator;
  readonly propertyCards: Locator;
  readonly propertyTypeFilter: Locator;
  readonly paginationIndicator: Locator;
  readonly nextPageBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId(PROPERTIES_LOCATORS.heading);
    this.searchInput = page.getByTestId(PROPERTIES_LOCATORS.searchInput);
    this.searchSubmitBtn = page.getByTestId(PROPERTIES_LOCATORS.searchSubmitBtn);
    this.propertyGrid = page.getByTestId(PROPERTIES_LOCATORS.propertyGrid);
    this.propertyCards = page.getByTestId(PROPERTIES_LOCATORS.propertyCard);
    this.propertyTypeFilter = page.getByTestId(PROPERTIES_LOCATORS.propertyTypeFilter);
    this.paginationIndicator = page.getByTestId(PROPERTIES_LOCATORS.paginationIndicator);
    this.nextPageBtn = page.getByTestId(PROPERTIES_LOCATORS.nextPageBtn);
  }

  async gotoProperties(): Promise<void> {
    await this.page.goto(UI_ROUTES.PROPERTIES);
    await this.propertyCards.first().waitFor({ state: "visible" });
  }

  async assertHeading(): Promise<void> {
    await expect(this.heading).toHaveText(UI_TEXT.PROPERTIES_PAGE_HEADING);
  }

  async assertSearchSubmitBtnText(): Promise<void> {
    await expect(this.searchSubmitBtn).toHaveText(UI_TEXT.SEARCH_SUBMIT_BTN);
  }

  async assertPropertyCardsVisible(): Promise<void> {
    await expect(this.propertyCards.first()).toBeVisible();
  }

  async assertHeadingAndInputs(): Promise<void> {
    await expect(this.heading).toHaveText(UI_TEXT.PROPERTIES_PAGE_HEADING);
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toHaveAttribute("placeholder", "Search For A Property");
    await expect(this.propertyTypeFilter).toBeVisible();
  }

  async assertLoadingSkeletonsTransition(): Promise<void> {
    await expect(this.propertyGrid).toBeVisible({ timeout: 2000 });
    await expect(this.propertyCards).toHaveCount(6);
  }

  async filterByType(type: string, expectedCount: number, title1: string, title2: string): Promise<void> {
    await expect(this.propertyGrid).toBeVisible();
    await this.propertyTypeFilter.selectOption(type);
    // Wait for loading skeleton to resolve
    await this.page.waitForTimeout(700);

    await expect(this.propertyCards).toHaveCount(expectedCount);
    await expect(this.page.locator('[data-testid="property-title-2"]')).toHaveText(title1);
    await expect(this.page.locator('[data-testid="property-title-7"]')).toHaveText(title2);
  }

  async searchFor(query: string, expectedCount: number, expectedTitle: string): Promise<void> {
    await expect(this.propertyGrid).toBeVisible();
    await this.searchInput.fill(query);
    await this.searchSubmitBtn.click();
    // Wait for search response and rendering
    await this.page.waitForTimeout(700);

    await expect(this.propertyCards).toHaveCount(expectedCount);
    await expect(this.page.locator('[data-testid="property-title-4"]')).toHaveText(expectedTitle);
  }

  async assertPagination(expectedPage1: string, expectedPage2: string, expectedCardsPage2: number): Promise<void> {
    await expect(this.propertyGrid).toBeVisible();
    await expect(this.paginationIndicator).toHaveText(expectedPage1);
    await this.nextPageBtn.click();
    // Wait for transition
    await this.page.waitForTimeout(700);

    await expect(this.paginationIndicator).toHaveText(expectedPage2);
    await expect(this.propertyCards).toHaveCount(expectedCardsPage2);
  }

  async assertNoConsoleErrors(): Promise<void> {
    const errors: string[] = [];
    const listener = (e: Error) => errors.push(`pageerror: ${e.message}`);
    const consoleListener = (msg: import("@playwright/test").ConsoleMessage) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    };
    this.page.on("pageerror", listener);
    this.page.on("console", consoleListener);
    await this.page.goto(UI_ROUTES.PROPERTIES);
    await this.propertyCards.first().waitFor({ state: "visible" });
    await this.page.waitForTimeout(500);
    this.page.off("pageerror", listener);
    this.page.off("console", consoleListener);
    expect(errors, "zero console/page errors on /properties load").toEqual([]);
  }
}
