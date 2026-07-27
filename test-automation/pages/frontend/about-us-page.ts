import { ApiHelper } from "@base/api-base";
import {
  ABOUT_US_TEXT,
  ABOUT_US_COUNTS,
  ABOUT_US_ERROR_MESSAGES,
  UI_ROUTES,
  API_PATHS,
} from "@constants/index";
import { ABOUT_US_LOCATORS } from "@locators/about-us-locators";
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

export interface AboutUsApiData {
  journey: {
    heading: string;
    body: string;
    imageUrl: string;
    stats: { value: string; label: string; icon: string }[];
  };
  values: {
    heading: string;
    body: string;
    cards: { title: string; description: string; icon: string }[];
  };
  achievements: {
    heading: string;
    body: string;
    cards: { title: string; description: string }[];
  };
}

export interface AboutUsApiResponse {
  success: boolean;
  data: AboutUsApiData | null;
  error?: string | null;
}

export class AboutUsPage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async navigateToAboutUs(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.ABOUT_US);
  }

  async assertPageRenders(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsPage);
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.journeyHeading,
      ABOUT_US_TEXT.JOURNEY_HEADING
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.valuesHeading,
      ABOUT_US_TEXT.VALUES_HEADING
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.achievementsHeading,
      ABOUT_US_TEXT.ACHIEVEMENTS_HEADING
    );
  }

  async assertSectionsVisible(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.valuesHeading);
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.achievementsHeading);
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.journeyImage);
  }

  async assertHeadingsAndCountsMatchApi(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.ABOUT_US)) as AboutUsApiResponse;
    const data = response.data;
    if (!data) {
      throw new Error("About Us API returned null data");
    }
    const { journey, values, achievements } = data;

    await this.navigateToAboutUs();

    await this.initializationPage.expectText(ABOUT_US_LOCATORS.journeyHeading, journey.heading);
    await this.initializationPage.expectText(ABOUT_US_LOCATORS.journeyBody, journey.body);
    await this.initializationPage.expectAttributeContains(
      ABOUT_US_LOCATORS.journeyImage,
      "src",
      encodeURIComponent(journey.imageUrl)
    );

    await this.initializationPage.expectText(ABOUT_US_LOCATORS.valuesHeading, values.heading);
    await this.initializationPage.expectText(ABOUT_US_LOCATORS.valuesBody, values.body);

    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.achievementsHeading,
      achievements.heading
    );
    await this.initializationPage.expectText(
      ABOUT_US_LOCATORS.achievementsBody,
      achievements.body
    );

    const page = this.initializationPage.page;
    await expect(page.locator(ABOUT_US_LOCATORS.journeyStat)).toHaveCount(journey.stats.length);
    await expect(page.locator(ABOUT_US_LOCATORS.valuesCard)).toHaveCount(values.cards.length);
    await expect(page.locator(ABOUT_US_LOCATORS.achievementsCard)).toHaveCount(
      achievements.cards.length
    );
  }

  async assertLoadingSkeleton(): Promise<void> {
    await this.initializationPage.mockDelayRoute(API_PATHS.ABOUT_US, 1000);
    await this.navigateToAboutUs();
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsLoading);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.journeyStat, 0);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.valuesCard, 0);
    await this.initializationPage.expectCount(ABOUT_US_LOCATORS.achievementsCard, 0);
    await this.initializationPage.waitForSomeTime(1000);
    await this.initializationPage.clearNetworkLogs();
  }

  async assertEmptyState(): Promise<void> {
    await this.initializationPage.mockJsonResponse(API_PATHS.ABOUT_US, {
      success: true,
      data: null,
      error: null,
    });
    await this.navigateToAboutUs();
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsEmpty);
    await this.initializationPage.expectTextContains(
      ABOUT_US_LOCATORS.aboutUsEmpty,
      ABOUT_US_ERROR_MESSAGES.EMPTY_FALLBACK
    );
    await this.initializationPage.clearNetworkLogs();
  }

  async assertErrorState(): Promise<void> {
    await this.initializationPage.mockAbortRoute(API_PATHS.ABOUT_US, "failed");
    await this.navigateToAboutUs();
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsError);
    await this.initializationPage.expectTextContains(
      ABOUT_US_LOCATORS.aboutUsError,
      ABOUT_US_ERROR_MESSAGES.ERROR_FALLBACK
    );
    await this.initializationPage.clearNetworkLogs();
  }

  async assertResponsiveCardCounts(): Promise<void> {
    await this.navigateToAboutUs();
    const page = this.initializationPage.page;

    await this.initializationPage.setViewport({ width: 375, height: 667 });
    await expect(page.locator(ABOUT_US_LOCATORS.valuesCard)).toHaveCount(
      ABOUT_US_COUNTS.VALUE_CARDS
    );

    await this.initializationPage.setViewport({ width: 768, height: 1024 });
    await expect(page.locator(ABOUT_US_LOCATORS.achievementsCard)).toHaveCount(
      ABOUT_US_COUNTS.ACHIEVEMENT_CARDS
    );
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(
      UI_ROUTES.ABOUT_US,
      ABOUT_US_LOCATORS.aboutUsPage
    );
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.ABOUT_US);
  }
}
