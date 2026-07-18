import { test, expect } from "@playwright/test";

test.describe("Properties Listings Page E2E — TC-050 to TC-060", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to /properties
    await page.goto("http://localhost:3000/properties");
  });

  test("TC-050 renders heading and search inputs", async ({ page }) => {
    const heading = page.locator('[data-testid="properties-page-heading"]');
    await expect(heading).toHaveText("Discover a World of Possibilities");
    
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search For A Property");

    const filter = page.locator('[data-testid="property-type-filter"]');
    await expect(filter).toBeVisible();
  });

  test("TC-051 shows loading skeletons then transitions to initial 6 cards", async ({ page }) => {
    const grid = page.locator('[data-testid="property-grid"]');
    await expect(grid).toBeVisible({ timeout: 2000 });
    
    const cards = page.locator('[data-testid="property-card"]');
    await expect(cards).toHaveCount(6);
  });

  test("TC-052 filtering by Mansion type renders expected results", async ({ page }) => {
    await expect(page.locator('[data-testid="property-grid"]')).toBeVisible();

    const select = page.locator('[data-testid="property-type-filter"]');
    await select.selectOption("Mansion");

    // Wait for loading skeleton to resolve
    await page.waitForTimeout(700);

    const cards = page.locator('[data-testid="property-card"]');
    await expect(cards).toHaveCount(2);

    await expect(page.locator('[data-testid="property-title-2"]')).toHaveText("Royal Oak Mansion");
    await expect(page.locator('[data-testid="property-title-7"]')).toHaveText("Whispering Pines Mansion");
  });

  test("TC-053 searching for specific property returns matching card", async ({ page }) => {
    await expect(page.locator('[data-testid="property-grid"]')).toBeVisible();

    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("Malibu");
    
    const submitBtn = page.locator('[data-testid="search-submit-btn"]');
    await submitBtn.click();

    await page.waitForTimeout(700);

    const cards = page.locator('[data-testid="property-card"]');
    await expect(cards).toHaveCount(1);
    await expect(page.locator('[data-testid="property-title-4"]')).toHaveText("Beachfront Estate");
  });

  test("TC-054 pagination navigates between pages", async ({ page }) => {
    await expect(page.locator('[data-testid="property-grid"]')).toBeVisible();

    const indicator = page.locator('[data-testid="pagination-indicator"]');
    await expect(indicator).toHaveText("Page 1 of 2");

    const nextBtn = page.locator('[data-testid="next-page-btn"]');
    await nextBtn.click();

    await page.waitForTimeout(700);

    await expect(indicator).toHaveText("Page 2 of 2");
    
    const cards = page.locator('[data-testid="property-card"]');
    await expect(cards).toHaveCount(4);
  });
});
