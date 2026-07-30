import { ApiHelper } from "@base/api-base";
import { API_PATHS, SERVICES_TEXT, SERVICES_COUNTS, UI_ROUTES, type ServicesApiResponse } from "@constants/index";
import { SERVICES_LOCATORS } from "@locators/services-locators";
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

export class ServicesPage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async navigateToServices(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.SERVICES);
  }

  async assertPageRenders(): Promise<void> {
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.introSection);
    await this.initializationPage.expectText(
      SERVICES_LOCATORS.introHeading,
      SERVICES_TEXT.DEFAULT_INTRO_HEADING
    );
  }

  async assertSectionsVisible(): Promise<void> {
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.quickLinksSection);
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.propertySellingSection);
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.propertyManagementSection);
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.investmentAdvisorySection);
    // Bottom CTA section removed - now provided by Footer component
  }

  async assertHeadingsMatchApi(): Promise<void> {
    const response = (await this.apiHelper.getRequest(API_PATHS.SERVICES)) as ServicesApiResponse;
    const { intro, services } = response.data;

    await this.initializationPage.expectText(SERVICES_LOCATORS.introHeading, intro.heading);
    await this.initializationPage.expectText(SERVICES_LOCATORS.introSubheading, intro.subheading);

    const expectedHeadings = [services[0]?.heading, services[1]?.heading, services[2]?.heading];
    await this.initializationPage.expectText(
      SERVICES_LOCATORS.propertySellingHeading,
      expectedHeadings[0] ?? SERVICES_TEXT.DEFAULT_PROPERTY_SELLING_HEADING
    );
    await this.initializationPage.expectText(
      SERVICES_LOCATORS.propertyManagementHeading,
      expectedHeadings[1] ?? SERVICES_TEXT.DEFAULT_PROPERTY_MANAGEMENT_HEADING
    );
    await this.initializationPage.expectText(
      SERVICES_LOCATORS.investmentAdvisoryHeading,
      expectedHeadings[2] ?? SERVICES_TEXT.DEFAULT_INVESTMENT_ADVISORY_HEADING
    );

    // Bottom CTA validation removed - Footer CTA is tested separately via footer tests

    await this.initializationPage.validateElementsCount(
      SERVICES_LOCATORS.quickLink,
      SERVICES_COUNTS.QUICK_LINKS
    );
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(UI_ROUTES.SERVICES);
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.SERVICES);
  }
}
