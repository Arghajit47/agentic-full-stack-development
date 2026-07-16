import { test, expect } from "../fixtures/api-fixtures";
import { BaseAPI, reviewSchema } from "../base/api-base";

test.describe("Featured Reviews API", () => {
  test("returns 200 with reviews", async ({ reviewsApi }) => {
    const res = await reviewsApi.fetchFeatured();
    BaseAPI.assertStatus(res, 200);
    const reviews = reviewsApi.getReviews(res);
    expect(reviews.length, "5 reviews in seed").toBe(5);
  });

  test("returns at most 5 reviews", async ({ reviewsApi }) => {
    const res = await reviewsApi.fetchFeatured();
    const reviews = reviewsApi.getReviews(res);
    BaseAPI.assertMaxCount(reviews, 5);
  });

  test("reviews match reviewSchema", async ({ reviewsApi }) => {
    const res = await reviewsApi.fetchFeatured();
    const reviews = reviewsApi.getReviews(res);
    BaseAPI.assertSchemaEach(reviews, reviewSchema);
  });

  test("handles nullable propertyTitle", async ({ reviewsApi }) => {
    const res = await reviewsApi.fetchFeatured();
    const reviews = reviewsApi.getReviews(res);
    reviewsApi.assertHasNullablePropertyTitle(reviews);
  });

  test("ratings are within 1-5", async ({ reviewsApi }) => {
    const res = await reviewsApi.fetchFeatured();
    const reviews = reviewsApi.getReviews(res);
    reviewsApi.assertRatingRange(reviews);
  });

  test("empty DB returns [] not error", async ({ reviewsApi }) => {
    BaseAPI.clearTables(["Review"]);
    const res = await reviewsApi.fetchFeatured();
    BaseAPI.assertEmptyArray(res);
  });
});