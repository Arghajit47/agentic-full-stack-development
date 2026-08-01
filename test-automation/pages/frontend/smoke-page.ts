import { type Page, type APIRequestContext, type Response } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { SMOKE_LOCATORS } from "@locators/smoke-locators";
import { SMOKE_ROUTES, VIEWPORTS } from "@constants/index";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export class SmokeTestPage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  async assertAllUrlsReturn200(request: APIRequestContext): Promise<void> {
    for (const route of SMOKE_ROUTES) {
      const res = await request.get(`${BASE_URL}${route}`);
      await this.initializationPage.expectNumberEquals(res.status(), 200);
    }
  }

  async assertNoBrokenImages(): Promise<void> {
    const brokenImages: string[] = [];
    for (const route of SMOKE_ROUTES) {
      const failed: string[] = [];
      const listener = (res: Response) => {
        if (res.url().match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && res.status() >= 400) {
          failed.push(`[${route}] ${res.url()}`);
        }
      };
      this.initializationPage.page.on("response", listener);
      await this.initializationPage.goto(`${BASE_URL}${route}`);
      await this.initializationPage.waitOnlyForPageLoad();
      this.initializationPage.page.off("response", listener);
      brokenImages.push(...failed);
    }
    await this.initializationPage.expectEqual([], brokenImages, false);
  }

  async assertNoLayoutBreaks(): Promise<void> {
    const viewportEntries = Object.entries(VIEWPORTS) as [string, { width: number; height: number }][];
    for (const [, viewport] of viewportEntries) {
      await this.initializationPage.setViewport(viewport);
      for (const route of SMOKE_ROUTES) {
        await this.initializationPage.goto(`${BASE_URL}${route}`);
        await this.initializationPage.expectVisibleWithTimeout(SMOKE_LOCATORS.navbar, 0, 10000);
        await this.initializationPage.expectVisibleWithTimeout(SMOKE_LOCATORS.footer, 0, 10000);
      }
    }
  }
}
