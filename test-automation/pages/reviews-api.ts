import { expect } from "@playwright/test";
import { BaseAPI, type Response } from "@base/api-base";

export interface Review {
  id: number;
  clientName: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  propertyTitle: string | null;
}

const PATH = "/api/reviews/featured";

/** Page-specific actions/assertions for the Featured Reviews API. */
export class ReviewsAPI extends BaseAPI {
  async fetchFeatured(): Promise<Response> {
    return this.get(PATH);
  }

  getReviews(res: Response): Review[] {
    return BaseAPI.assertArray(res) as Review[];
  }

  assertHasNullablePropertyTitle(reviews: Review[]): void {
    const nullReview = reviews.find((r) => r.propertyTitle === null);
    expect(nullReview, "at least one null propertyTitle").toBeDefined();
  }

  assertRatingRange(reviews: Review[]): void {
    for (const r of reviews) {
      expect(r.rating, `rating ${r.rating} in 1-5`).toBeGreaterThanOrEqual(1);
      expect(r.rating, `rating ${r.rating} in 1-5`).toBeLessThanOrEqual(5);
    }
  }
}