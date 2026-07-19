import { test } from "@fixtures/ui-fixtures";

test.describe("Properties Page UI — Consolidated verification", () => {
  test("TC-050 Properties Page listings, search inputs, filtering, pagination, and live API integration", async ({ propertiesUi }) => {
    await propertiesUi.verifyAllPropertiesPageFunctionality();
  });
});
