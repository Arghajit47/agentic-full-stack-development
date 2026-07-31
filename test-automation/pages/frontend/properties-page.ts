import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { ApiHelper } from "@base/api-base";
import { PROPERTIESPAGE_LOCATORS } from "@locators/propertiespage-locators";
import {
  UI_ROUTES,
  VIEWPORTS,
  PROPERTIES_GRID_COLS,
  API_PATHS,
  PROPERTIES_TEXT,
  PROPERTIES_PAGE_ONE_CARD_COUNT,
  PROPERTIES_CARD_STYLES,
  PROPERTIES_BANNER_STYLES,
  type Property,
  type PropertiesResponse,
} from "@constants/index";

type ViewportKey = keyof typeof VIEWPORTS;

/**
 * Page object for the Properties page UI components.
 * Strictly uses InitializationPage methods, ApiHelper, and PROPERTIESPAGE_LOCATORS.
 */
export class PropertiesPage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async navigatePropertiesPage(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
  }

  async setViewport(key: ViewportKey): Promise<void> {
    const vp = VIEWPORTS[key];
    await this.initializationPage.setViewport(vp);
  }

  async assertGridColumns(key: ViewportKey): Promise<void> {
    const expected = PROPERTIES_GRID_COLS[key];
    await this.initializationPage.assertGridTrackCount(
      PROPERTIESPAGE_LOCATORS.propertyGrid,
      expected,
      `properties grid ${key}`
    );
  }

  async assertPageHeaderAndSearchControls(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectText(
      PROPERTIESPAGE_LOCATORS.heading,
      PROPERTIES_TEXT.HEADING
    );
    await this.initializationPage.expectText(
      PROPERTIESPAGE_LOCATORS.subheading,
      PROPERTIES_TEXT.SUBHEADING
    );
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.searchInput);
    await this.initializationPage.expectAttribute(
      PROPERTIESPAGE_LOCATORS.searchInput,
      "placeholder",
      PROPERTIES_TEXT.SEARCH_PLACEHOLDER
    );
    await this.initializationPage.expectText(
      PROPERTIESPAGE_LOCATORS.searchSubmitBtn,
      PROPERTIES_TEXT.SEARCH_SUBMIT_TEXT
    );
  }

  async assertLiveApiDataValidation(): Promise<void> {
    const apiData = (await this.apiHelper.getRequest(
      API_PATHS.PROPERTIES
    )) as PropertiesResponse;

    expect(apiData).toBeDefined();
    expect(Array.isArray(apiData.items)).toBe(true);
    expect(apiData.items.length).toBeGreaterThan(0);

    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.propertyCard, 0);

    const cardCount = await this.initializationPage.getElementsCount(
      PROPERTIESPAGE_LOCATORS.propertyCard
    );
    expect(cardCount).toBeGreaterThan(0);
  }

  async assertFilterAndSearchFunctionality(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.propertyCard, 0);

    // Search for "Seawide" — should return Seawide Serenity Villa (first property per Figma order)
    await this.initializationPage.fill(
      PROPERTIESPAGE_LOCATORS.searchInput,
      PROPERTIES_TEXT.SEARCH_TEST_QUERY
    );
    await this.initializationPage.click(PROPERTIESPAGE_LOCATORS.searchSubmitBtn);
    await this.initializationPage.waitForSomeTime(2000);

    const searchCount = await this.initializationPage.getElementsCount(
      PROPERTIESPAGE_LOCATORS.propertyCard
    );
    expect(searchCount).toBeGreaterThan(0);
    await this.initializationPage.expectTextContains(
      PROPERTIESPAGE_LOCATORS.propertyCard,
      PROPERTIES_TEXT.SEARCH_TEST_QUERY,
      0
    );

    // Reset search input
    await this.initializationPage.fill(
      PROPERTIESPAGE_LOCATORS.searchInput,
      ""
    );
    await this.initializationPage.click(PROPERTIESPAGE_LOCATORS.searchSubmitBtn);
    await this.initializationPage.waitForSomeTime(2000);
  }

  async assertPaginationFunctionality(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.propertyCard, 0);

    await this.initializationPage.expectTextContains(
      PROPERTIESPAGE_LOCATORS.paginationIndicator,
      "Page 1 of"
    );

    await this.initializationPage.click(PROPERTIESPAGE_LOCATORS.nextPageBtn);
    await this.initializationPage.waitForSomeTime(2000);

    await this.initializationPage.expectTextContains(
      PROPERTIESPAGE_LOCATORS.paginationIndicator,
      "Page 2 of"
    );

    const page2CardCount = await this.initializationPage.getElementsCount(
      PROPERTIESPAGE_LOCATORS.propertyCard
    );
    expect(page2CardCount).toBeGreaterThan(0);
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(
      UI_ROUTES.PROPERTIES,
      PROPERTIESPAGE_LOCATORS.propertyCard
    );
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.PROPERTIES);
  }

  async assertPropertyOrder(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.propertyCard, 0);
    await this.initializationPage.expectTextContains(
      PROPERTIESPAGE_LOCATORS.propertyTitles,
      PROPERTIES_TEXT.FIRST_PROPERTY_TITLE,
      0
    );
    await this.initializationPage.expectTextContains(
      PROPERTIESPAGE_LOCATORS.propertyTitles,
      PROPERTIES_TEXT.SECOND_PROPERTY_TITLE,
      1
    );
  }

  async assertPageOneCardCount(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.propertyCard, 0);
    const count = await this.initializationPage.getElementsCount(
      PROPERTIESPAGE_LOCATORS.propertyCard
    );
    expect(count).toBe(PROPERTIES_PAGE_ONE_CARD_COUNT);
  }

  async assertCardStyling(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.propertyCard, 0);
    const page = this.initializationPage.page;

    const cardBg = await page.locator(PROPERTIESPAGE_LOCATORS.propertyCard).first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(cardBg).toBe(PROPERTIES_CARD_STYLES.BG_COLOR);

    const cardBorder = await page.locator(PROPERTIESPAGE_LOCATORS.propertyCard).first()
      .evaluate((el) => getComputedStyle(el).borderColor);
    expect(cardBorder).toBe(PROPERTIES_CARD_STYLES.BORDER_COLOR);

    const imageHeight = await page.locator(PROPERTIESPAGE_LOCATORS.propertyCardImage).first()
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(imageHeight).toBeCloseTo(PROPERTIES_CARD_STYLES.IMAGE_HEIGHT_PX, -1);
  }

  async assertBannerBackground(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    const page = this.initializationPage.page;
    const bannerBg = await page.locator(PROPERTIESPAGE_LOCATORS.searchBanner)
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bannerBg).toBe(PROPERTIES_BANNER_STYLES.BG_COLOR);
  }

  async assertNoPropertyTypeFilter(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    const page = this.initializationPage.page;
    const count = await page.locator(PROPERTIESPAGE_LOCATORS.propertyTypeFilter).count();
    expect(count).toBe(0);
  }

  async assertDiscoverSection(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTIES);
    await this.initializationPage.expectVisible(PROPERTIESPAGE_LOCATORS.discoverSection);
    await this.initializationPage.expectTextContains(
      PROPERTIESPAGE_LOCATORS.discoverSection,
      PROPERTIES_TEXT.DISCOVER_HEADING
    );
  }
}
