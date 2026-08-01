export const LIGHTHOUSE_CONSTANTS: {
  HTTP_OK: number;
  ROBOTS_USER_AGENT_REGEX: RegExp;
  ROBOTS_DISALLOW_API: string;
  ROBOTS_ALLOW_ROOT: string;
  SITEMAP_ROUTES: string[];
  SKIP_LINK_SELECTOR: string;
  SKIP_LINK_CLASS: string;
  PROPERTY_DETAIL_SLUG_FRAGMENT: string;
  SECURITY_HEADERS: {
    X_FRAME_OPTIONS: string;
    X_CONTENT_TYPE_OPTIONS: string;
    REFERRER_POLICY: string;
  };
  JSON_LD_TYPE: string;
} = {
  HTTP_OK: 200,
  ROBOTS_USER_AGENT_REGEX: /User-[Aa]gent:/,
  ROBOTS_DISALLOW_API: "Disallow: /api/",
  ROBOTS_ALLOW_ROOT: "Allow: /",
  SITEMAP_ROUTES: ["/services", "/about-us", "/contact", "/properties"],
  SKIP_LINK_SELECTOR: 'a[href="#main-content"]',
  SKIP_LINK_CLASS: "sr-only",
  PROPERTY_DETAIL_SLUG_FRAGMENT: "seawide",
  SECURITY_HEADERS: {
    X_FRAME_OPTIONS: "DENY",
    X_CONTENT_TYPE_OPTIONS: "nosniff",
    REFERRER_POLICY: "strict-origin-when-cross-origin",
  },
  JSON_LD_TYPE: "RealEstateAgent",
};
