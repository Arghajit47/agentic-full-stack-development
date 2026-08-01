import { type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { ApiHelper } from "@base/api-base";
import { PROPERTY_DETAILS_LOCATORS } from "@locators/propertydetails-locators";
import {
  UI_ROUTES,
  VIEWPORTS,
  API_PATHS,
  PROPERTY_DETAILS,
  propertyPricingSchema,
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

    this.apiHelper.assertSchemaValid({ success: apiData.success }, "property detail API");
    this.apiHelper.assertNotNull(apiData.data, "property data");

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

  async assertPricingBreakdownFromApi(): Promise<void> {
    const pricingData = await this.apiHelper.getRequest(API_PATHS.PROPERTY_PRICING(PROPERTY_DETAILS.SLUG));
    const parsed = propertyPricingSchema.safeParse(pricingData);
    this.apiHelper.assertSchemaValid(parsed, "pricing schema");

    const { additionalFees, monthlyCosts, totalInitialCosts } = parsed.data!.data;
    const formatCurrency = (n: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG));
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingBreakdown);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingNoteCard);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingAdditionalFees);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingMonthlyCosts);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingTotalInitialCosts);
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingMonthlyExpenses);

    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingAdditionalFees,
      formatCurrency(additionalFees.propertyTransferTax)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingAdditionalFees,
      formatCurrency(additionalFees.legalFees)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingAdditionalFees,
      formatCurrency(additionalFees.homeInspection)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingAdditionalFees,
      formatCurrency(additionalFees.propertyInsurance)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingAdditionalFees,
      additionalFees.mortgageFees
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingMonthlyCosts,
      formatCurrency(monthlyCosts.propertyTaxesMonthly)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingMonthlyCosts,
      formatCurrency(monthlyCosts.hoaFeeMonthly)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingTotalInitialCosts,
      formatCurrency(totalInitialCosts.downPayment)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingTotalInitialCosts,
      formatCurrency(totalInitialCosts.mortgageAmount)
    );
  }

  async assertInquiryFormSubmission(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG));
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.inputFirstName);

    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputFirstName, PROPERTY_DETAILS.INQUIRY_FIRST_NAME);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputLastName, PROPERTY_DETAILS.INQUIRY_LAST_NAME);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputEmail, PROPERTY_DETAILS.INQUIRY_EMAIL);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputPhone, PROPERTY_DETAILS.INQUIRY_PHONE);
    await this.initializationPage.fill(PROPERTY_DETAILS_LOCATORS.inputMessage, PROPERTY_DETAILS.INQUIRY_MESSAGE);
    await this.initializationPage.page.check('[data-testid="input-agree-terms"]');

    const responsePromise = this.initializationPage.page.waitForResponse(
      (res) => res.url().includes("/api/contact/property") && res.request().method() === "POST"
    );
    await this.initializationPage.click(PROPERTY_DETAILS_LOCATORS.submitButton);
    const response = await responsePromise;
    const body = await response.json();
    this.apiHelper.assertResponseStatus(response.status(), 201, "inquiry POST");
    this.apiHelper.assertSchemaValid({ success: body.success }, "inquiry response");

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
