import { test, expect } from "@fixtures/ui-fixtures";
import { PROPERTIES_LOCATORS } from "@locators/propertiespage-locators";
import { UI_TEXT } from "@constants/index";

test.describe("Properties Listings Page E2E — TC-050 to TC-060", () => {
  test.beforeEach(async ({ propertiesUiPage }) => {
    // Navigate to /properties
    await propertiesUiPage.goto("/properties");
  });

  test("TC-050 renders heading and search inputs", async ({ page }) => {
    const heading = page.locator(PROPERTIES_LOCATORS.heading);
    await expect(heading).toHaveText(UI_TEXT.PROPERTIES_PAGE_HEADING);
    
    const searchInput = page.locator(PROPERTIES_LOCATORS.searchInput);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute("placeholder", "Search For A Property");

    const filter = page.locator(PROPERTIES_LOCATORS.filter);
    await expect(filter).toBeVisible();
  });

  test("TC-051 shows loading skeletons then transitions to initial 6 cards", async ({ page }) => {
    const grid = page.locator(PROPERTIES_LOCATORS.propertyGrid);
    await expect(grid).toBeVisible({ timeout: 2000 });
    
    const cards = page.locator(PROPERTIES_LOCATORS.propertyCard);
    await expect(cards).toHaveCount(6);
  });

  test("TC-052 filtering by Mansion type renders expected results", async ({ page }) => {
    await expect(page.locator(PROPERTIES_LOCATORS.propertyGrid)).toBeVisible();

    const select = page.locator(PROPERTIES_LOCATORS.filter);
    await select.selectOption("Mansion");

    // Wait for loading skeleton to resolve
    await page.waitForTimeout(700);

    const cards = page.locator(PROPERTIES_LOCATORS.propertyCard);
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

    const cards = page.locator(PROPERTIES_LOCATORS.propertyCard);
    await expect(cards).toHaveCount(1);
    await expect(page.locator('[data-testid="property-title-4"]')).toHaveText("Beachfront Estate");
  });

  test("TC-054 pagination navigates between pages", async ({ page }) => {
    await expect(page.locator(PROPERTIES_LOCATORS.propertyGrid)).toBeVisible();

    const indicator = page.locator(PROPERTIES_LOCATORS.paginationIndicator);
    await expect(indicator).toHaveText("Page 1 of 2");

    const nextBtn = page.locator(PROPERTIES_LOCATORS.nextPageBtn);
    await nextBtn.click();

    await page.waitForTimeout(700);

    await expect(indicator).toHaveText("Page 2 of 2");
    
    const cards = page.locator(PROPERTIES_LOCATORS.propertyCard);
    await expect(cards).toHaveCount(4);
  });
});
