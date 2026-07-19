import { test } from "@fixtures/ui-fixtures";

test.describe("Home Page UI — Consolidated verification", () => {
  test("TC-001 Home Page UI components, responsive layout, loading states, and live API integration", async ({ homeUi }) => {
    await homeUi.verifyAllHomePageFunctionality();
  });
});
