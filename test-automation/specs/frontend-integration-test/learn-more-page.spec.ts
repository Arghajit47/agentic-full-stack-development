import { test, expect } from "@playwright/test";
import { UI_ROUTES } from "@constants/index";

test.describe("Learn More page", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto(UI_ROUTES.LEARN_MORE);
    await expect(page).toHaveTitle(/Learn More/);
  });

  test("renders header section", async ({ page }) => {
    await page.goto(UI_ROUTES.LEARN_MORE);
    await expect(page.getByTestId("learn-more-header")).toBeVisible();
    await expect(page.getByTestId("learn-more-title")).toHaveText("Learn More About Estatein");
    await expect(page.getByTestId("learn-more-eyebrow")).toBeVisible();
  });

  test("renders Who We Are section", async ({ page }) => {
    await page.goto(UI_ROUTES.LEARN_MORE);
    await expect(page.getByTestId("learn-more-who-we-are")).toBeVisible();
  });

  test("renders 3 stat cards", async ({ page }) => {
    await page.goto(UI_ROUTES.LEARN_MORE);
    await expect(page.getByTestId("stat-card-0")).toBeVisible();
    await expect(page.getByTestId("stat-card-1")).toBeVisible();
    await expect(page.getByTestId("stat-card-2")).toBeVisible();
  });

  test("renders 3 info cards", async ({ page }) => {
    await page.goto(UI_ROUTES.LEARN_MORE);
    await expect(page.getByTestId("info-card-0")).toBeVisible();
    await expect(page.getByTestId("info-card-1")).toBeVisible();
    await expect(page.getByTestId("info-card-2")).toBeVisible();
  });

  test("CTA links to /properties", async ({ page }) => {
    await page.goto(UI_ROUTES.LEARN_MORE);
    const cta = page.getByTestId("browse-properties-btn");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /\/properties/);
  });

  test("Hero CTA links to /learn-more", async ({ page }) => {
    await page.goto(UI_ROUTES.HOME);
    const learnMoreBtn = page.getByTestId("hero-learn-more");
    await expect(learnMoreBtn).toHaveAttribute("href", "/learn-more");
  });
});
