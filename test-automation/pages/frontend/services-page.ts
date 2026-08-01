import { ApiHelper } from "@base/api-base";
import {
  API_PATHS,
  SERVICES_TEXT,
  SERVICES_COUNTS,
  SERVICES_GRID_COLS,
  UI_ROUTES,
  VIEWPORTS,
  VIEWPORT_ORDER,
  type ServicesApiResponse,
} from "@constants/index";
import { SERVICES_LOCATORS } from "@locators/services-locators";
import { expect, type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";

type ViewportKey = (typeof VIEWPORT_ORDER)[number];

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

  async assertLoadingSkeletonVisible(): Promise<void> {
    await this.initializationPage.mockDelayRoute(API_PATHS.SERVICES, 3000);
    await this.navigateToServices();
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.skeleton);
    await this.initializationPage.validateElementsCount(SERVICES_LOCATORS.skeleton, 2);
    await this.initializationPage.expectHidden(SERVICES_LOCATORS.skeleton);
    await this.initializationPage.clearNetworkLogs();
  }

  async assertEmptyState(): Promise<void> {
    await this.initializationPage.mockJsonResponse(API_PATHS.SERVICES, {
      success: true,
      data: { intro: null, quickLinks: [], services: [], bottomCta: null },
      error: null,
    });
    await this.navigateToServices();
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.empty);
    await this.initializationPage.expectTextContains(SERVICES_LOCATORS.empty, SERVICES_TEXT.EMPTY_MESSAGE);
    await this.initializationPage.clearNetworkLogs();
  }

  async assertErrorState(): Promise<void> {
    await this.initializationPage.mockAbortRoute(API_PATHS.SERVICES, "failed");
    await this.navigateToServices();
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.error);
    await this.initializationPage.expectTextContains(SERVICES_LOCATORS.error, SERVICES_TEXT.ERROR_MESSAGE);
    await this.initializationPage.expectVisible(SERVICES_LOCATORS.errorRetry);
    await this.initializationPage.clearNetworkLogs();
    await this.initializationPage.click(SERVICES_LOCATORS.errorRetry);
    await this.initializationPage.expectHidden(SERVICES_LOCATORS.error);
  }

  async assertResponsiveLayout(): Promise<void> {
    for (const key of VIEWPORT_ORDER as unknown as ViewportKey[]) {
      await this.initializationPage.setViewport(VIEWPORTS[key]);
      await this.navigateToServices();
      await this.initializationPage.expectVisible(SERVICES_LOCATORS.introSection);
      await this.initializationPage.assertGridTrackCount(
        SERVICES_LOCATORS.propertySellingGrid,
        SERVICES_GRID_COLS[key],
        `property-selling grid at ${key}`
      );
      await this.initializationPage.assertGridTrackCount(
        SERVICES_LOCATORS.propertyManagementGrid,
        SERVICES_GRID_COLS[key],
        `property-management grid at ${key}`
      );
    }
  }

  async assertCtaHeadingIsLink(): Promise<void> {
    for (const locator of [
      SERVICES_LOCATORS.propertySellingCtaLink,
      SERVICES_LOCATORS.propertyManagementCtaLink,
      SERVICES_LOCATORS.investmentAdvisoryCtaLink,
    ]) {
      const link = this.initializationPage.page.locator(locator).first();
      await expect(link).toBeVisible();
      // Tag must be <a>, not <h3>
      const tag = await link.evaluate((el) => el.tagName.toLowerCase());
      expect(tag).toBe("a");
      // Must contain an SVG (ArrowUpRight icon)
      const svgCount = await link.locator("svg").count();
      expect(svgCount).toBeGreaterThan(0);
    }
  }

  async assertLearnMoreIsGhostButton(): Promise<void> {
    for (const locator of [
      SERVICES_LOCATORS.propertySellingCtaButton,
      SERVICES_LOCATORS.propertyManagementCtaButton,
      SERVICES_LOCATORS.investmentAdvisoryCtaButton,
    ]) {
      const btn = this.initializationPage.page.locator(locator).first();
      await expect(btn).toBeVisible();
      const cls = await btn.getAttribute("class");
      // Ghost: transparent background + border
      expect(cls).toContain("bg-transparent");
      expect(cls).toContain("border");
      // Must NOT be filled purple
      expect(cls).not.toContain("bg-[#703BF7]");
    }
  }

  async assertServiceGridColumnsAtDesktop(): Promise<void> {
    await this.initializationPage.setViewport({ width: 1920, height: 1080 });
    await this.navigateToServices();
    await this.initializationPage.assertGridTrackCount(
      SERVICES_LOCATORS.propertySellingGrid,
      SERVICES_GRID_COLS.WIDE,
      "property-selling grid at 1920px"
    );
    await this.initializationPage.assertGridTrackCount(
      SERVICES_LOCATORS.propertyManagementGrid,
      SERVICES_GRID_COLS.WIDE,
      "property-management grid at 1920px"
    );
  }

  async assertNoConsoleErrors(): Promise<void> {
    await this.initializationPage.assertNoConsoleErrors(UI_ROUTES.SERVICES);
  }

  async assertNoImage404s(): Promise<void> {
    await this.initializationPage.assertNoImage404s(UI_ROUTES.SERVICES);
  }
}
