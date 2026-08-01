import { expect, type Page, type APIRequestContext } from "@playwright/test";
import InitializationPage from "@base/ui-base";
import { UI_ROUTES } from "@constants/index";

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
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/User-[Aa]gent:/);
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Allow: /");
  }

  async assertSitemapXml(request: APIRequestContext): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const res = await request.get(`${baseUrl}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    for (const route of ["/services", "/about-us", "/contact", "/properties"]) {
      expect(body).toContain(route);
    }
  }

  async assertSkipToContentLink(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    const skipLink = this.page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
    const cls = await skipLink.getAttribute("class");
    expect(cls).toContain("sr-only");
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
      expect(title).toContain(route.expect);
      titles.add(title);
    }
    expect(titles.size).toBe(routes.length);
  }

  async assertPropertyDetailTitle(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS("seawide-serenity-villa"));
    await this.page.waitForSelector('[data-testid="property-page-title"]');
    const title = await this.page.title();
    expect(title.toLowerCase()).toContain("seawide");
  }

  async assertLoadingSkeletonAriaRole(): Promise<void> {
    await this.page.route("**/api/properties/seawide-serenity-villa", async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.continue();
    });
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS("seawide-serenity-villa"));
    await expect(this.page.locator('[role="status"]').first()).toBeVisible();
  }

  async assertSecurityHeaders(request: APIRequestContext): Promise<void> {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const res = await request.get(`${baseUrl}/`);
    const headers = res.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  }

  async assertGalleryAriaLabels(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.PROPERTY_DETAILS("seawide-serenity-villa"));
    await this.page.waitForSelector('[data-testid="property-gallery"]');
    const dots = this.page.locator('[role="tablist"] button');
    const count = await dots.count();
    expect(count).toBeGreaterThan(0);
    const firstDot = dots.first();
    await expect(firstDot).toHaveAttribute("aria-label", /Image 1 of/);
    await expect(firstDot).toHaveAttribute("aria-current", "true");
    if (count > 1) {
      await expect(dots.nth(1)).not.toHaveAttribute("aria-current");
    }
  }

  async assertJsonLdStructuredData(): Promise<void> {
    await this.initializationPage.goto(UI_ROUTES.HOME);
    const jsonLdScript = this.page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toHaveCount(1);
    const content = await jsonLdScript.textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed["@type"]).toBe("RealEstateAgent");
  }
}
