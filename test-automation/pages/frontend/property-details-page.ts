import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { ApiHelper } from "@base/api-base";
import { PROPERTY_DETAILS_LOCATORS } from "@locators/propertydetails-locators";
import {
  UI_ROUTES,
  VIEWPORTS,
  API_PATHS,
  PROPERTY_DETAILS,
} from "@constants/index";

type ViewportKey = keyof typeof VIEWPORTS;

export class PropertyDetailsPage {
  private initializationPage: InitializationPage;
  private apiHelper: ApiHelper;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
    this.apiHelper = new ApiHelper();
  }

  async assertLiveApiDataValidation(): Promise<void> {
    const apiData = (await this.apiHelper.getRequest(
      `${API_PATHS.PROPERTIES}/${PROPERTY_DETAILS.SLUG}`
    )) as { success: boolean; data: { title: string } | null };

    expect(apiData.success).toBe(true);
    expect(apiData.data).not.toBeNull();

    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG));
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyPageTitle);
    await this.initializationPage.expectText(
      PROPERTY_DETAILS_LOCATORS.propertyPageTitle,
      apiData.data!.title
    );
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyGallery);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyDetails);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyInquiryForm);
  }

  async assertInquiryFormSubmission(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG));
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.inputName);

    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputName, PROPERTY_DETAILS.INQUIRY_NAME);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputEmail, PROPERTY_DETAILS.INQUIRY_EMAIL);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputPhone, PROPERTY_DETAILS.INQUIRY_PHONE);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputMessage, PROPERTY_DETAILS.INQUIRY_MESSAGE);

    const responsePromise = this.initializationPage.page.waitForResponse(
      (res) => res.url().includes("/api/contact/property") && res.request().method() === "POST"
    );
    await this.initializationPage.click(PROPERTY_DETAILS_LOCATORS.submitButton);
    const response = await responsePromise;
    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.success).toBe(true);

    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.inquiryFormSuccess);
  }

  async assertResponsiveLayout(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG));
    for (const key of ["WIDE", "DESKTOP", "LAPTOP", "TABLET", "MOBILE"] as ViewportKey[]) {
      await this.initializationPage.setViewport(VIEWPORTS[key]);
      await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyPageTitle);
      await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyGallery);
      await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.propertyInquiryForm);
    }
  }

  async assertNoConsoleOrImageErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(
      UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG),
      PROPERTY_DETAILS_LOCATORS.propertyPageTitle
    );
    await this.initializationPage.assertNoImage404s();
  }
}
