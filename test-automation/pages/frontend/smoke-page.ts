import { type Page, type APIRequestContext, type Response } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { SMOKE_LOCATORS } from "@locators/smoke-locators";
import { UI_ROUTES, VIEWPORTS, SMOKE_CONSTANTS, BASE_URL as DEPLOYED_BASE_URL } from "@constants/index";

const resolvedBaseUrl = process.env.BASE_URL || DEPLOYED_BASE_URL;

export class SmokeTestPage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  private async scrapeInternalUrls(): Promise<string[]> {
    const baseHostname = new URL(resolvedBaseUrl).hostname;
    const visited = new Set<string>();
    const queue: string[] = [resolvedBaseUrl];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const normalised = current.split("#")[0].replace(/\/$/, "") || resolvedBaseUrl;
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
              !clean.startsWith(`${resolvedBaseUrl}/api`) &&
              !clean.startsWith(`${resolvedBaseUrl}/test-harness`) &&
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
    const staticRoutes = [
      UI_ROUTES.HOME,
      UI_ROUTES.PROPERTIES,
      UI_ROUTES.SERVICES,
      UI_ROUTES.ABOUT_US,
      UI_ROUTES.CONTACT,
      UI_ROUTES.TERMS,
    ];
    for (const route of staticRoutes) {
      const url = `${resolvedBaseUrl}${route}`;
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
          failed.push(`[${route}] HTTP ${res.status()}: ${res.url()}`);
        }
      };
      this.initializationPage.page.on("response", listener);
      await this.initializationPage.goto(`${resolvedBaseUrl}${route}`);
      await this.initializationPage.page.waitForLoadState("networkidle", { timeout: 60000 });
      this.initializationPage.page.off("response", listener);

      const imgLocator = this.initializationPage.page.locator(SMOKE_LOCATORS.anyImage);
      const imgCount = await imgLocator.count();
      for (let i = 0; i < imgCount; i++) {
        const img = imgLocator.nth(i);
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        if (naturalWidth === 0) {
          const src = await img.getAttribute("src") ?? `img[${i}]`;
          failed.push(`[${route}] naturalWidth=0: ${src}`);
        }
      }

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
        await this.initializationPage.goto(`${resolvedBaseUrl}${route}`);
        await this.initializationPage.page.waitForLoadState("domcontentloaded");
        await this.initializationPage.expectVisibleWithTimeout(SMOKE_LOCATORS.navbar, 0, 20000);
        await this.initializationPage.expectVisibleWithTimeout(SMOKE_LOCATORS.footer, 0, 20000);
      }
    }
  }
}
