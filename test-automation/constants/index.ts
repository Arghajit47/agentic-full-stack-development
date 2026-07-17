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
} as const;

// data-testid selectors — single source of truth for UI page object.
export const UI_TESTIDS = {
  FEATURED_SECTION: "featured-properties-section",
  PROPERTY_CARD: "property-card",
  EXPLORE_CTA: "explore-properties-cta",
  NO_PROPERTIES: "no-properties",
  TESTIMONIALS_SECTION: "testimonials-section",
  REVIEW_CARD: "review-card",
  NO_REVIEWS: "no-reviews",
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

// Expected grid column counts per viewport.
export const FEATURED_GRID_COLS = {
  WIDE: 3,
  DESKTOP: 3,
  LAPTOP: 2,
  TABLET: 2,
  MOBILE: 1,
} as const;

export const TESTIMONIALS_GRID_COLS = {
  WIDE: 3,
  DESKTOP: 3,
  LAPTOP: 2,
  TABLET: 1,
  MOBILE: 1,
} as const;

// Headings & subheadings (static copy from components).
export const UI_TEXT = {
  FEATURED_HEADING: "Featured Properties",
  FEATURED_SUBHEADING:
    "Discover our handpicked selection of premium properties available right now.",
  TESTIMONIALS_HEADING: "What Our Clients Say",
  TESTIMONIALS_SUBHEADING:
    "Real stories from real clients who found their perfect home with us.",
  CTA_LABEL: "Explore Properties",
  NO_PROPERTIES: "No featured properties",
  NO_REVIEWS: "No reviews yet",
} as const;

// Expected rendered counts.
export const UI_COUNTS = {
  PROPERTY_CARDS: 6,
  REVIEW_CARDS: 5,
  SKELETON_PROPERTY: 6,
  SKELETON_REVIEW: 5,
} as const;

// Featured property mock data (mirrors src/mocks/featured-properties.ts).
// Specs compare rendered card text against these expected values.
export const FEATURED_PROPERTY_MOCKS = [
  {
    title: "Modern Luxury Villa",
    price: 1250000,
    priceFormatted: "$1,250,000",
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 4200,
  },
  {
    title: "Downtown Penthouse",
    price: 895000,
    priceFormatted: "$895,000",
    location: "New York, NY",
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 2100,
  },
  {
    title: "Beachfront Estate",
    price: 2150000,
    priceFormatted: "$2,150,000",
    location: "Malibu, CA",
    bedrooms: 6,
    bathrooms: 5,
    areaSqft: 5800,
  },
  {
    title: "Suburban Family Home",
    price: 475000,
    priceFormatted: "$475,000",
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2800,
  },
  {
    title: "Contemporary Loft",
    price: 620000,
    priceFormatted: "$620,000",
    location: "Chicago, IL",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1600,
  },
  {
    title: "Hillside Modern Retreat",
    price: 1780000,
    priceFormatted: "$1,780,000",
    location: "Scottsdale, AZ",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3900,
  },
] as const;

// Testimonials mock data (mirrors src/mocks/testimonials.ts).
export const TESTIMONIAL_MOCKS = [
  {
    clientName: "Sarah Johnson",
    rating: 5,
    propertyTitle: "Modern Luxury Villa",
  },
  {
    clientName: "Michael Chen",
    rating: 5,
    propertyTitle: "Downtown Penthouse",
  },
  {
    clientName: "Emily Rodriguez",
    rating: 4,
    propertyTitle: "Suburban Family Home",
  },
  {
    clientName: "David Thompson",
    rating: 5,
    propertyTitle: null,
  },
  {
    clientName: "Jessica Williams",
    rating: 4,
    propertyTitle: "Contemporary Loft",
  },
] as const;

// Star rating aria-label template used by the Testimonials StarRating component.
export const STAR_ARIA_TEMPLATE = "{rating} out of 5 stars";

// ── KAN-8 integration tests (real API + rendered UI) ─────────────
export const INTEGRATION_TEXT = {
  SEED_PROPERTIES_HEADING: "Featured Properties",
  SEED_PROPERTIES_SUBHEADING: "Explore our handpicked selection of premium homes",
  SEED_REVIEWS_HEADING: "What Our Clients Say",
  SEED_REVIEWS_SUBHEADING: "Real stories from happy homeowners",
  ERROR_FALLBACK: "Unable to load properties. Please try again later.",
} as const;

export const INTEGRATION_TESTIDS = {
  HOME_ERROR: "home-error",
  FEATURED_HEADING: "featured-properties-heading",
  FEATURED_SUBHEADING: "featured-properties-subheading",
  TESTIMONIALS_HEADING: "testimonials-heading",
  TESTIMONIALS_SUBHEADING: "testimonials-subheading",
  REVIEW_STARS: "review-stars",
} as const;

export const STAR_SELECTORS = {
  FILLED: ".fill-[#703BF7].text-[#703BF7]",
  EMPTY: ".text-zinc-700",
} as const;

export const INTEGRATION_COUNTS = {
  VISIBLE_CARDS_DESKTOP: 3,
  VISIBLE_CARDS_LAPTOP: 2,
  VISIBLE_CARDS_MOBILE: 1,
  STAR_TOTAL: 5,
} as const;

export const PRICE_FORMAT = {
  LOCALE: "en-US",
  CURRENCY: "USD",
  MAX_FRACTION_DIGITS: 0,
} as const;

export const STUB_IMAGE = {
  CONTENT_TYPE: "image/png",
  BASE64:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1YAAAAASUVORK5CYII=",
} as const;