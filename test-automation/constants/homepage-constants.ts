export const HOMEPAGE_CONSTANTS = {
  NO_PROPERTIES_TEXT: "No featured properties",
  NO_REVIEWS_TEXT: "No reviews yet",
} as const;

// Expected grid column counts per viewport.
export const FEATURED_GRID_COLS = {
  WIDE: 3,
  DESKTOP: 3,
  LAPTOP: 2,
  TABLET: 1,
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
  // KAN-58 — Properties page SearchFilterBar
  PROPERTIES_PAGE_HEADING: "Find Your Dream Property",
  SEARCH_SUBMIT_BTN: "Find Property",
  SEARCH_PLACEHOLDER: "Search For A Property",
} as const;

// Expected rendered counts.
export const UI_COUNTS = {
  PROPERTY_CARDS: 6,
  REVIEW_CARDS: 5,
  SKELETON_PROPERTY: 6,
  SKELETON_REVIEW: 5,
} as const;

export const ERROR_MESSAGES = {
  ERROR_FALLBACK: "Unable to load properties. Please try again later.",
} as const;

export const INTEGRATION_COUNTS = {
  VISIBLE_CARDS_DESKTOP: 3,
  VISIBLE_CARDS_LAPTOP: 2,
  VISIBLE_CARDS_MOBILE: 1,
  STAR_TOTAL: 5,
} as const;
