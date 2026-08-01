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

    const data = parsed.data!;
    const formatCurrency = (n: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS(PROPERTY_DETAILS.SLUG));
    await this.initializationPage.expectVisible(PROPERTY_DETAILS_LOCATORS.pricingBreakdown);

    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingListing,
      data.breakdown.listing.label
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingListing,
      formatCurrency(data.breakdown.listing.amount)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingPlatformFee,
      formatCurrency(data.breakdown.fees.platformFee.amount)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingProcessingFee,
      formatCurrency(data.breakdown.fees.processingFee.amount)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingInspectionCost,
      formatCurrency(data.breakdown.costs.inspectionCost.amount)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingLegalFee,
      formatCurrency(data.breakdown.costs.legalFee.amount)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingInsuranceCost,
      formatCurrency(data.breakdown.costs.insuranceCost.amount)
    );
    await this.initializationPage.expectTextContains(
      PROPERTY_DETAILS_LOCATORS.pricingTotal,
      formatCurrency(data.totalPrice)
    );
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
