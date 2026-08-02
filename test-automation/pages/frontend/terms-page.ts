import { UI_ROUTES } from "@constants/index";
import { TERMS_LOCATORS } from "@locators/terms-locators";
import { type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

export class TermsPage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  async navigateToTerms(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.TERMS);
  }

  async assertPageRenders(): Promise<void> {
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsPage);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsHeader);
    await this.initializationPage.expectText(TERMS_LOCATORS.termsHeading, "Terms of Use");
  }

  async assertAllSectionsVisible(): Promise<void> {
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionAcceptance);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionServices);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionUserConduct);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionData);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionLiability);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionChanges);
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsSectionContact);
  }

  async assertSectionHeadings(): Promise<void> {
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionAcceptance,
      "Acceptance of Terms"
    );
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionServices,
      "Our Services"
    );
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionUserConduct,
      "User Conduct"
    );
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionData,
      "Privacy and Data"
    );
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionLiability,
      "Limitation of Liability"
    );
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionChanges,
      "Changes to These Terms"
    );
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionContact,
      "Contact Us"
    );
  }

  async assertContactSectionHasEmail(): Promise<void> {
    await this.initializationPage.expectTextContains(
      TERMS_LOCATORS.termsSectionContact,
      "info@estatein.com"
    );
  }

  async assertLastUpdatedVisible(): Promise<void> {
    await this.initializationPage.expectVisible(TERMS_LOCATORS.termsLastUpdated);
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors();
  }
}
