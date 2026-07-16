import { test, expect } from "@fixtures/api-fixtures";
import { BaseAPI, propertySchema } from "@base/api-base";
import { execSync } from "node:child_process";

test.describe("Featured Properties API", () => {
  test("returns 200 with featured properties", async ({ propertiesApi }) => {
    const res = await propertiesApi.fetchFeatured();
    BaseAPI.assertStatus(res, 200);
    const props = propertiesApi.getProperties(res);
    expect(props.length, "5 featured in seed").toBe(5);
  });

  test("all returned properties have isFeatured=true", async ({ propertiesApi }) => {
    const res = await propertiesApi.fetchFeatured();
    const props = propertiesApi.getProperties(res);
    propertiesApi.assertAllFeatured(props);
  });

  test("returns at most 6 featured properties", async ({ propertiesApi }) => {
    const res = await propertiesApi.fetchFeatured();
    const props = propertiesApi.getProperties(res);
    BaseAPI.assertMaxCount(props, 6);
  });

  test("galleryUrls and features are arrays, not JSON text", async ({ propertiesApi }) => {
    const res = await propertiesApi.fetchFeatured();
    const props = propertiesApi.getProperties(res);
    propertiesApi.assertArraysParsed(props);
    propertiesApi.assertHasGalleryImages(props);
  });

  test("properties match propertySchema", async ({ propertiesApi }) => {
    const res = await propertiesApi.fetchFeatured();
    const props = propertiesApi.getProperties(res);
    BaseAPI.assertSchemaEach(props, propertySchema);
  });

  test("empty DB returns [] not error", async ({ propertiesApi }) => {
    BaseAPI.clearTables(["Property"]);
    const res = await propertiesApi.fetchFeatured();
    BaseAPI.assertEmptyArray(res);
  });

  test("returns 500 with { error: string } on DB failure", async () => {
    const vitestOut = execSync("npx vitest run src/__tests__/api.test.ts 2>&1", {
      cwd: "..",
      encoding: "utf-8",
      timeout: 60_000,
    });
    expect(vitestOut, "vitest 500-path tests pass").toContain("passed");
    expect(vitestOut, "no failures").not.toContain("failed");
  });
});