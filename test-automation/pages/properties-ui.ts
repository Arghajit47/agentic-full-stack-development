import { expect, type Page, type Locator } from "@playwright/test";
import {
  UI_ROUTES,
  UI_TESTIDS,
  UI_TEXT,
} from "@constants/index";

/**
 * Page object for the /properties page (KAN-58).
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

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId(UI_TESTIDS.PROPERTIES_PAGE_HEADING);
    this.searchInput = page.getByTestId(UI_TESTIDS.SEARCH_INPUT);
    this.searchSubmitBtn = page.getByTestId(UI_TESTIDS.SEARCH_SUBMIT_BTN);
    this.propertyGrid = page.getByTestId(UI_TESTIDS.PROPERTY_GRID);
    this.propertyCards = page.getByTestId(UI_TESTIDS.PROPERTY_CARD);
    this.propertyTypeFilter = page.getByTestId(UI_TESTIDS.PROPERTY_TYPE_FILTER);
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
