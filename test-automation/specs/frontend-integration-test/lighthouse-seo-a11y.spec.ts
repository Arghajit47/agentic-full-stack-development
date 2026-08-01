import { test, expect } from "@fixtures/ui-fixtures";

// KAN-115: Lighthouse SEO, Accessibility, and Best Practices tests

test("TC-1: /robots.txt returns 200 with correct directives", async ({ lighthousePage, request }) => {
  await lighthousePage.assertRobotsTxt(request);
});

test("TC-2: /sitemap.xml returns 200 and lists all static routes", async ({ lighthousePage, request }) => {
  await lighthousePage.assertSitemapXml(request);
});

test("TC-3: Skip-to-content link is present in home page DOM", async ({ lighthousePage }) => {
  await lighthousePage.assertSkipToContentLink();
});

test("TC-4: Per-route page titles are unique and contain route keyword", async ({ lighthousePage }) => {
  await lighthousePage.assertPerRoutePageTitles();
});

test("TC-5: Property detail page has dynamic title from property name", async ({ lighthousePage }) => {
  await lighthousePage.assertPropertyDetailTitle();
});

test("TC-6: Loading skeleton has role=status", async ({ lighthousePage }) => {
  await lighthousePage.assertLoadingSkeletonAriaRole();
});

test("TC-7: Security response headers are present on all responses", async ({ lighthousePage, request }) => {
  await lighthousePage.assertSecurityHeaders(request);
});

test("TC-8: Gallery dot buttons have aria-label and aria-current on active dot", async ({ lighthousePage }) => {
  await lighthousePage.assertGalleryAriaLabels();
});

test("TC-9: JSON-LD structured data script is in DOM with @type RealEstateAgent", async ({ lighthousePage }) => {
  await lighthousePage.assertJsonLdStructuredData();
});
