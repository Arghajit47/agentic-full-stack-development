import { test, expect } from "@playwright/test";
import { VIEWPORTS } from "@constants/index";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const ALL_ROUTES = ["/", "/properties", "/services", "/about-us", "/contact"];

test("All page URLs return 200", async ({ request }) => {
  for (const route of ALL_ROUTES) {
    const res = await request.get(`${BASE_URL}${route}`);
    expect(res.status(), `Route ${route} should return 200`).toBe(200);
  }
});

test("No broken images on any page", async ({ page }) => {
  const brokenImages: string[] = [];
  for (const route of ALL_ROUTES) {
    const failed: string[] = [];
    const listener = (res: import("@playwright/test").Response) => {
      if (res.url().match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) && res.status() >= 400) {
        failed.push(`[${route}] ${res.url()}`);
      }
    };
    page.on("response", listener);
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    page.off("response", listener);
    brokenImages.push(...failed);
  }
  expect(brokenImages, "No broken images across all pages").toEqual([]);
});

test("No broken layouts — navbar and footer visible at all viewports", async ({ page }) => {
  const viewportEntries = Object.entries(VIEWPORTS) as [string, { width: number; height: number }][];
  for (const [vpName, viewport] of viewportEntries) {
    await page.setViewportSize(viewport);
    for (const route of ALL_ROUTES) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
      const navbar = page.locator('[data-testid="navbar"]');
      const footer = page.locator('[data-testid="footer"]');
      await expect(navbar, `Navbar visible on ${route} @ ${vpName}`).toBeVisible({ timeout: 10000 });
      await expect(footer, `Footer visible on ${route} @ ${vpName}`).toBeVisible({ timeout: 10000 });
    }
  }
});
