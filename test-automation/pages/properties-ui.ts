import { expect, type Page, type Locator } from "@playwright/test";
import { PROPERTIES_LOCATORS } from "@locators/propertiespage-locators";
import { UI_ROUTES, UI_TEXT } from "@constants/index";

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

export interface PropertiesResponse {
  items: Property[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Page object for the /properties page.
 * Owns all Playwright locators and encapsulates all actions and assertions.
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

  async verifyAllPropertiesPageFunctionality(): Promise<void> {
    const requestContext = this.page.request;

    // 1. Fetch live settings and check page header elements
    const settingsRes = await requestContext.get("/api/settings");
    expect(settingsRes.status()).toBe(200);
    const settings: Record<string, string> = await settingsRes.json();

    const expectedHeading = settings.properties_heading ?? UI_TEXT.PROPERTIES_PAGE_HEADING;
    const expectedSubmitBtnText = settings.search_submit_btn_text ?? UI_TEXT.SEARCH_SUBMIT_BTN;

    await this.page.goto(UI_ROUTES.PROPERTIES);
    await this.propertyCards.first().waitFor({ state: "visible" });

    // Assert headers and search controls
    await expect(this.heading).toHaveText(expectedHeading);
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toHaveAttribute("placeholder", "Search For A Property");
    await expect(this.propertyTypeFilter).toBeVisible();
    await expect(this.searchSubmitBtn).toHaveText(expectedSubmitBtnText);

    // 2. Fetch live initial page 1 properties (limit=6)
    const initialRes = await requestContext.get("/api/properties?page=1&limit=6");
    expect(initialRes.status()).toBe(200);
    const initialData: PropertiesResponse = await initialRes.json();

    await expect(this.propertyGrid).toBeVisible();
    await expect(this.propertyCards).toHaveCount(initialData.items.length);

    for (let i = 0; i < initialData.items.length; i++) {
      const card = this.propertyCards.nth(i);
      const expectedTitle = initialData.items[i].title;
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(expectedTitle);
    }

    // 3. Verify Filtering (Live Mansion fetch)
    const filterRes = await requestContext.get("/api/properties?type=Mansion&page=1&limit=6");
    expect(filterRes.status()).toBe(200);
    const filterData: PropertiesResponse = await filterRes.json();

    await this.propertyTypeFilter.selectOption("Mansion");
    // Wait for transition skeleton to resolve
    await this.page.waitForTimeout(700);

    await expect(this.propertyCards).toHaveCount(filterData.items.length);
    for (let i = 0; i < filterData.items.length; i++) {
      const card = this.propertyCards.nth(i);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(filterData.items[i].title);
    }

    // Reset filter to All
    await this.propertyTypeFilter.selectOption("All");
    await this.page.waitForTimeout(700);

    // 4. Verify Searching (Live "Malibu" fetch)
    const searchRes = await requestContext.get("/api/properties?search=Malibu&page=1&limit=6");
    expect(searchRes.status()).toBe(200);
    const searchData: PropertiesResponse = await searchRes.json();

    await this.searchInput.fill("Malibu");
    await this.searchSubmitBtn.click();
    await this.page.waitForTimeout(700);

    await expect(this.propertyCards).toHaveCount(searchData.items.length);
    for (let i = 0; i < searchData.items.length; i++) {
      const card = this.propertyCards.nth(i);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(searchData.items[i].title);
    }

    // Clear search
    await this.searchInput.fill("");
    await this.searchSubmitBtn.click();
    await this.page.waitForTimeout(700);

    // 5. Verify Pagination
    const page1Res = await requestContext.get("/api/properties?page=1&limit=6");
    const page2Res = await requestContext.get("/api/properties?page=2&limit=6");
    expect(page1Res.status()).toBe(200);
    expect(page2Res.status()).toBe(200);
    const page1Data: PropertiesResponse = await page1Res.json();
    const page2Data: PropertiesResponse = await page2Res.json();

    const totalPages = Math.ceil(page1Data.total / 6);
    const expectedPage1Text = `Page 1 of ${totalPages}`;
    const expectedPage2Text = `Page 2 of ${totalPages}`;

    await expect(this.paginationIndicator).toHaveText(expectedPage1Text);
    await this.nextPageBtn.click();
    await this.page.waitForTimeout(700);

    await expect(this.paginationIndicator).toHaveText(expectedPage2Text);
    await expect(this.propertyCards).toHaveCount(page2Data.items.length);
    for (let i = 0; i < page2Data.items.length; i++) {
      const card = this.propertyCards.nth(i);
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(page2Data.items[i].title);
    }

    // 6. Verify zero console/page errors
    await this.assertNoConsoleErrors();
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
