import { type Page } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { runLighthouse } from "@lighthouse/lighthouse-runner";
import { LIGHTHOUSE_THRESHOLDS, PAGES_TO_TEST, RESOLUTIONS } from "@lighthouse/lighthouse-thresholds";

export class LighthouseAuditPage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  async assertScoresForPage(pageName: string, pagePath: string): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    for (const resolution of RESOLUTIONS) {
      const scores = await runLighthouse({
        url: `${baseUrl}${pagePath}`,
        config: {
          formFactor: resolution.mobile ? "mobile" : "desktop",
          screenEmulation: {
            mobile: resolution.mobile,
            disabled: false,
            width: resolution.width,
            height: resolution.height,
            deviceScaleFactor: resolution.mobile ? 2 : 1,
          },
        },
      });
      await this.initializationPage.expectNumberGreaterThan(scores.performance, LIGHTHOUSE_THRESHOLDS.performance - 1);
      await this.initializationPage.expectNumberGreaterThan(scores.accessibility, LIGHTHOUSE_THRESHOLDS.accessibility - 1);
      await this.initializationPage.expectNumberGreaterThan(scores.bestPractices, LIGHTHOUSE_THRESHOLDS.bestPractices - 1);
      await this.initializationPage.expectNumberGreaterThan(scores.seo, LIGHTHOUSE_THRESHOLDS.seo - 1);
    }
  }

  getPagesToTest() {
    return PAGES_TO_TEST;
  }
}
