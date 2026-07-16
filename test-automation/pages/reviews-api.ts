import { expect } from "@playwright/test";
import { BaseAPI, type Response } from "@base/api-base";
import { API_PATHS, RATING_RANGE } from "@constants/index";

export interface Review {
  id: number; clientName: string; clientAvatarUrl: string;
  rating: number; reviewText: string; propertyTitle: string | null;
}

export class ReviewsAPI extends BaseAPI {
  async fetchFeatured(): Promise<Response> {
    return this.get(API_PATHS.REVIEWS_FEATURED);
  }

  getReviews(res: Response): Review[] {
    return BaseAPI.assertArray(res) as Review[];
  }

  assertHasNullablePropertyTitle(reviews: Review[]): void {
    expect(reviews.find((r) => r.propertyTitle === null), "at least one null propertyTitle").toBeDefined();
  }

  assertRatingRange(reviews: Review[]): void {
    for (const r of reviews) {
      expect(r.rating, `rating ${r.rating} in ${RATING_RANGE.MIN}-${RATING_RANGE.MAX}`).toBeGreaterThanOrEqual(RATING_RANGE.MIN);
      expect(r.rating, `rating ${r.rating} in ${RATING_RANGE.MIN}-${RATING_RANGE.MAX}`).toBeLessThanOrEqual(RATING_RANGE.MAX);
    }
  }
}