import { ABOUT_US_TEXT, ABOUT_US_COUNTS, UI_ROUTES } from "@constants/index";
import { ABOUT_US_LOCATORS } from "@locators/about-us-locators";
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

export class AboutUsPage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  async navigateToAboutUs(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.ABOUT_US);
  }

  async assertPageRenders(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.aboutUsPage);
    await this.initializationPage.expectText(ABOUT_US_LOCATORS.journeyHeading, ABOUT_US_TEXT.JOURNEY_HEADING);
  }

  async assertSectionsVisible(): Promise<void> {
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.valuesHeading);
    await this.initializationPage.expectVisible(ABOUT_US_LOCATORS.achievementsHeading);
  }

  async assertContentCounts(): Promise<void> {
    await this.initializationPage.validateElementsCount(ABOUT_US_LOCATORS.journeyStat, ABOUT_US_COUNTS.JOURNEY_STATS);
    await this.initializationPage.validateElementsCount(ABOUT_US_LOCATORS.valuesCard, ABOUT_US_COUNTS.VALUE_CARDS);
    await this.initializationPage.validateElementsCount(ABOUT_US_LOCATORS.achievementsCard, ABOUT_US_COUNTS.ACHIEVEMENT_CARDS);
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(UI_ROUTES.ABOUT_US);
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.ABOUT_US);
  }
}
