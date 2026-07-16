/** Centralized constants for the test-automation suite — single source of truth. */

// ── API ──────────────────────────────────────────────────────────
export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
  PROPERTIES_FEATURED: "/api/properties/featured",
  REVIEWS_FEATURED: "/api/reviews/featured",
  SETTINGS: "/api/settings",
} as const;

// ── DB & schema ──────────────────────────────────────────────────
export const DB_PATH = "../prisma/dev.db";
export const SCHEMA_PATH = "../prisma/schema.prisma";

export const TABLES = {
  PROPERTY: "Property",
  REVIEW: "Review",
  SITE_SETTING: "SiteSetting",
} as const;

export const PROPERTY_FIELDS = [
  "id",
  "slug",
  "title",
  "price",
  "location",
  "bedrooms",
  "bathrooms",
  "areaSqft",
  "imageUrl",
  "isFeatured",
  "galleryUrls",
  "features",
] as const;

export const REVIEW_FIELDS = [
  "clientName",
  "clientAvatarUrl",
  "rating",
  "reviewText",
  "propertyTitle",
] as const;

// ── Seed data & validation bounds ────────────────────────────────
export const SEED_COUNTS = {
  PROPERTIES: 6,
  REVIEWS: 5,
  SETTINGS: 14,
  FEATURED_PROPERTIES: 5,
  NULL_PROPERTY_TITLES: 1,
  MIN_RATING: 2,
  MAX_RATING: 5,
} as const;

export const MAX_FEATURED = {
  PROPERTIES: 6,
  REVIEWS: 5,
} as const;

export const RATING_RANGE = {
  MIN: 1,
  MAX: 5,
} as const;

export const REQUIRED_SETTING_KEYS = [
  "properties_heading",
  "properties_subheading",
  "reviews_heading",
  "reviews_subheading",
] as const;