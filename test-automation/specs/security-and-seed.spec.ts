import { test } from "@fixtures/api-fixtures";

test.describe("Security & Seed Validation", () => {
  test("npm audit — zero high/critical vulnerabilities", ({ schemaApi }) => {
    schemaApi.assertNoHighCriticalVulns();
  });

  test("Prisma schema has Property, Review, SiteSetting with correct fields", ({ schemaApi }) => {
    schemaApi.assertSchemaModels();
  });

  test("seed script creates correct data counts", ({ schemaApi }) => {
    schemaApi.assertSeedCounts();
  });
});