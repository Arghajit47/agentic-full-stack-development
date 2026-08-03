export const LIGHTHOUSE_THRESHOLDS = {
  performance: 100,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
} as const;

export const PAGES_TO_TEST = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about-us" },
  { name: "Contact", path: "/contact" },
] as const;

export const RESOLUTIONS = [
  { name: "WIDE", width: 1920, height: 1080, mobile: false },
  { name: "DESKTOP", width: 1440, height: 900, mobile: false },
  { name: "LAPTOP", width: 1024, height: 768, mobile: false },
  { name: "TABLET", width: 768, height: 1024, mobile: true },
  { name: "MOBILE", width: 375, height: 812, mobile: true },
] as const;
