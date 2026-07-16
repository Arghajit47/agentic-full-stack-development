import { test, expect } from "@playwright/test";
import { ReviewsAPI } from "../pages/reviews-api";
import { BaseAPI, reviewSchema } from "../base/api-base";

test.describe("Featured Reviews API", () => {
  let api: ReviewsAPI;

  test.beforeEach(async () => {
    BaseAPI.reseed();
    api = new ReviewsAPI();
    await api.init();
  });

  test.afterEach(async () => {
    await api.dispose();
  });

  test("returns 200 with reviews", async () => {
    const res = await api.fetchFeatured();
    BaseAPI.assertStatus(res, 200);
    const reviews = api.getReviews(res);
    expect(reviews.length, "5 reviews in seed").toBe(5);
  });

  test("returns at most 5 reviews", async () => {
    const res = await api.fetchFeatured();
    const reviews = api.getReviews(res);
    BaseAPI.assertMaxCount(reviews, 5);
  });

  test("reviews match reviewSchema", async () => {
    const res = await api.fetchFeatured();
    const reviews = api.getReviews(res);
    BaseAPI.assertSchemaEach(reviews, reviewSchema);
  });

  test("handles nullable propertyTitle", async () => {
    const res = await api.fetchFeatured();
    const reviews = api.getReviews(res);
    api.assertHasNullablePropertyTitle(reviews);
  });

  test("ratings are within 1-5", async () => {
    const res = await api.fetchFeatured();
    const reviews = api.getReviews(res);
    api.assertRatingRange(reviews);
  });

  test("empty DB returns [] not error", async () => {
    BaseAPI.clearTables(["Review"]);
    const res = await api.fetchFeatured();
    BaseAPI.assertEmptyArray(res);
  });
});