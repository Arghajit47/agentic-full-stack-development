export const SERVICES_TEXT = {
  DEFAULT_INTRO_HEADING: "Elevate Your Real Estate Experience",
  DEFAULT_PROPERTY_SELLING_HEADING: "Unlock Property Value",
  DEFAULT_PROPERTY_MANAGEMENT_HEADING: "Effortless Property Management",
  DEFAULT_INVESTMENT_ADVISORY_HEADING: "Smart Investments, Informed Decisions",
  DEFAULT_BOTTOM_CTA_HEADING: "Start Your Real Estate Journey Today",
  DEFAULT_BOTTOM_CTA_BUTTON: "Explore Properties",
  EMPTY_MESSAGE: "No services content available.",
  ERROR_MESSAGE: "Failed to fetch",
} as const;

export const SERVICES_COUNTS = {
  QUICK_LINKS: 4,
  PROPERTY_SELLING_CARDS: 4,
  PROPERTY_MANAGEMENT_CARDS: 4,
  INVESTMENT_ADVISORY_CARDS: 4,
} as const;

export const SERVICES_GRID_COLS = {
  MOBILE: 1,
  TABLET: 2,
  LAPTOP: 4,
  DESKTOP: 4,
  WIDE: 4,
} as const;

export const RESPONSIVE_SERVICE_IDS = [
  "property-selling",
  "property-management",
] as const;
