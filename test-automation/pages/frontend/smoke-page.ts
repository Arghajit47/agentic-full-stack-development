import { type Page, type APIRequestContext, type Response } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { SMOKE_LOCATORS } from "@locators/smoke-locators";
import { UI_ROUTES, VIEWPORTS, SMOKE_CONSTANTS } from "@constants/index";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export class SmokeTestPage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  private async scrapeInternalUrls(): Promise<string[]> {
    const baseHostname = new URL(BASE_URL).hostname;
    const visited = new Set<string>();
    const queue: string[] = [BASE_URL];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const normalised = current.split("#")[0].replace(/\/$/, "") || BASE_URL;
      if (visited.has(normalised)) continue;
      visited.add(normalised);

      try {
        await this.initializationPage.goto(normalised);
        const selector = SMOKE_LOCATORS.anchorWithHref;
        const hrefs: string[] = await this.initializationPage.page.evaluate((sel) =>
          Array.from(document.querySelectorAll(sel)).map(
            (a) => (a as HTMLAnchorElement).href
          ),
          selector
        );
        for (const href of hrefs) {
          try {
            const parsed = new URL(href);
            const clean = parsed.href.split("#")[0].replace(/\/$/, "");
            if (
              parsed.hostname === baseHostname &&
              parsed.protocol.startsWith(SMOKE_CONSTANTS.HTTP_PROTOCOL) &&
              !clean.startsWith(`${BASE_URL}/api`) &&
              !clean.startsWith(`${BASE_URL}/test-harness`) &&
              !visited.has(clean) &&
              !queue.includes(clean)
            ) {
              queue.push(clean);
            }
          } catch {
            // skip malformed hrefs
          }
        }
      } catch {
        // skip pages that fail to load during crawl
      }
    }

    return [...visited];
  }

  async assertAllUrlsReturn200(request: APIRequestContext): Promise<void> {
    const urls = await this.scrapeInternalUrls();
    for (const url of urls) {
      const res = await request.get(url);
      await this.initializationPage.expectNumberEquals(res.status(), 200);
    }
  }

  async assertNoBrokenImages(): Promise<void> {
    const publicRoutes = [
      UI_ROUTES.HOME,
      UI_ROUTES.PROPERTIES,
      UI_ROUTES.SERVICES,
      UI_ROUTES.ABOUT_US,
      UI_ROUTES.CONTACT,
    ] as const;
    const brokenImages: string[] = [];

    for (const route of publicRoutes) {
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
    const publicRoutes = [
      UI_ROUTES.HOME,
      UI_ROUTES.PROPERTIES,
      UI_ROUTES.SERVICES,
      UI_ROUTES.ABOUT_US,
      UI_ROUTES.CONTACT,
    ] as const;
    const viewportEntries = Object.entries(VIEWPORTS) as [string, { width: number; height: number }][];

    for (const [, viewport] of viewportEntries) {
      await this.initializationPage.setViewport(viewport);
      for (const route of publicRoutes) {
        await this.initializationPage.goto(`${BASE_URL}${route}`);
        await this.initializationPage.expectVisibleWithTimeout(SMOKE_LOCATORS.navbar, 0, 10000);
        await this.initializationPage.expectVisibleWithTimeout(SMOKE_LOCATORS.footer, 0, 10000);
      }
    }
  }
}
