/** Centralized constants for the test-automation suite — single source of truth. */
export * from "./homepage-constants";
export * from "./api-constants";
export * from "./properties-constants";

// ── API ──────────────────────────────────────────────────────────
export const BASE_URL = "https://real-estates-estatein.netlify.app";

export const API_PATHS = {
  PROPERTIES: "/api/properties",
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
  PROPERTIES: 20,
  REVIEWS: 20,
  SETTINGS: 14,
  FEATURED_PROPERTIES: 20,
  NULL_PROPERTY_TITLES: 1,
  MIN_RATING: 1,
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

// ── UI test harness ──────────────────────────────────────────────
// Route paths for component test fixtures rendered under /test-harness/.
export const UI_ROUTES = {
  HOME: "/",
  EMPTY_PROPERTIES: "/test-harness/empty-properties",
  EMPTY_REVIEWS: "/test-harness/empty-reviews",
  LOADING: "/test-harness/loading",
  PROPERTIES: "/properties",
  SERVICES: "/services",
} as const;

// Responsive breakpoints (px). Match Tailwind: sm=640, md=768, lg=1024, xl=1280.
// Test cases use 375/768/1024/1440/1920.
export const VIEWPORTS = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  LAPTOP: { width: 1024, height: 768 },
  DESKTOP: { width: 1440, height: 900 },
  WIDE: { width: 1920, height: 1080 },
} as const;