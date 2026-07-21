import { test } from "@fixtures/api-fixtures";

test.describe("Backend API Schema & 200 Status Validation", () => {
  test("GET /api/properties/featured returns 200 and matches propertySchema", async ({ backendApi }) => {
    await backendApi.validateFeaturedPropertiesApi();
  });

  test("GET /api/reviews/featured returns 200 and matches reviewSchema", async ({ backendApi }) => {
    await backendApi.validateFeaturedReviewsApi();
  });

  test("GET /api/properties returns 200 and matches propertiesResponseSchema", async ({ backendApi }) => {
    await backendApi.validatePropertiesApi();
  });

  test("GET /api/settings returns 200 and matches settingsSchema", async ({ backendApi }) => {
    await backendApi.validateSettingsApi();
  });
});
