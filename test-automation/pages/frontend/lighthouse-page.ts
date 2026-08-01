import { type Page, type APIRequestContext } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { UI_ROUTES, LIGHTHOUSE_CONSTANTS } from "@constants/index";

export class LighthousePage {
  private initializationPage: InitializationPage;

  constructor(page: Page) {
    this.initializationPage = new InitializationPage(page);
  }

  get page(): Page {
    return this.initializationPage.page;
  }

  async assertRobotsTxt(request: APIRequestContext): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const res = await request.get(`${baseUrl}/robots.txt`);
    await this.initializationPage.expectNumberEquals(res.status(), LIGHTHOUSE_CONSTANTS.HTTP_OK);
    const body = await res.text();
    await this.initializationPage.expectStringMatchesRegex(body, LIGHTHOUSE_CONSTANTS.ROBOTS_USER_AGENT_REGEX);
    await this.initializationPage.expectStringContains(body, LIGHTHOUSE_CONSTANTS.ROBOTS_DISALLOW_API);
    await this.initializationPage.expectStringContains(body, LIGHTHOUSE_CONSTANTS.ROBOTS_ALLOW_ROOT);
  }

  async assertSitemapXml(request: APIRequestContext): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const res = await request.get(`${baseUrl}/sitemap.xml`);
    await this.initializationPage.expectNumberEquals(res.status(), LIGHTHOUSE_CONSTANTS.HTTP_OK);
    const body = await res.text();
    for (const route of LIGHTHOUSE_CONSTANTS.SITEMAP_ROUTES) {
      await this.initializationPage.expectStringContains(body, route);
    }
  }

  async assertSkipToContentLink(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    const skipLink = this.page.locator(LIGHTHOUSE_CONSTANTS.SKIP_LINK_SELECTOR);
    await this.initializationPage.expectCount(skipLink, 1);
    const cls = await skipLink.getAttribute("class");
    await this.initializationPage.expectStringContains(cls, LIGHTHOUSE_CONSTANTS.SKIP_LINK_CLASS);
  }

  async assertPerRoutePageTitles(): Promise<void> {
    const routes: Array<{ path: string; expect: string }> = [
      { path: UI_ROUTES.HOME, expect: "Estatein" },
      { path: UI_ROUTES.SERVICES, expect: "Services" },
      { path: UI_ROUTES.ABOUT_US, expect: "About" },
      { path: UI_ROUTES.CONTACT, expect: "Contact" },
      { path: UI_ROUTES.PROPERTIES, expect: "Properties" },
    ];
    const titles = new Set<string>();
    for (const route of routes) {
      await this.initializationPage.goto(route.path);
      const title = await this.page.title();
      await this.initializationPage.expectStringContains(title, route.expect);
      titles.add(title);
    }
    await this.initializationPage.expectNumberEquals(titles.size, routes.length);
  }

  async assertPropertyDetailTitle(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS("seawide-serenity-villa"));
    await this.page.waitForSelector('[data-testid="property-page-title"]');
    const title = await this.page.title();
    await this.initializationPage.expectStringContains(title.toLowerCase(), LIGHTHOUSE_CONSTANTS.PROPERTY_DETAIL_SLUG_FRAGMENT);
  }

  async assertLoadingSkeletonAriaRole(): Promise<void> {
    await this.page.route("**/api/properties/seawide-serenity-villa", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS("seawide-serenity-villa"));
    await this.initializationPage.expectVisible(this.page.locator('[role="status"]').first());
  }

  async assertSecurityHeaders(request: APIRequestContext): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const res = await request.get(`${baseUrl}/`);
    const headers = res.headers();
    await this.initializationPage.expectStringEquals(headers["x-frame-options"], LIGHTHOUSE_CONSTANTS.SECURITY_HEADERS.X_FRAME_OPTIONS);
    await this.initializationPage.expectStringEquals(headers["x-content-type-options"], LIGHTHOUSE_CONSTANTS.SECURITY_HEADERS.X_CONTENT_TYPE_OPTIONS);
    await this.initializationPage.expectStringEquals(headers["referrer-policy"], LIGHTHOUSE_CONSTANTS.SECURITY_HEADERS.REFERRER_POLICY);
  }

  async assertGalleryAriaLabels(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS("seawide-serenity-villa"));
    await this.page.waitForSelector('[data-testid="property-gallery"]');
    const dots = this.page.locator('[role="tablist"] button');
    const count = await dots.count();
    await this.initializationPage.expectNumberGreaterThan(count, 0);
    const firstDot = dots.first();
    await this.initializationPage.expectAttributeMatchesRegex(firstDot, "aria-label", /Image 1 of/);
    await this.initializationPage.expectAttribute(firstDot, "aria-current", "true");
    if (count > 1) {
      await this.initializationPage.expectHasNotAttribute(dots.nth(1), "aria-current");
    }
  }

  async assertJsonLdStructuredData(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    const jsonLdScript = this.page.locator('script[type="application/ld+json"]');
    await this.initializationPage.expectCount(jsonLdScript, 1);
    const content = await jsonLdScript.textContent();
    await this.initializationPage.expectValueTruthy(content);
    const parsed = JSON.parse(content!);
    await this.initializationPage.expectStringEquals(parsed["@type"], LIGHTHOUSE_CONSTANTS.JSON_LD_TYPE);
  }
}
