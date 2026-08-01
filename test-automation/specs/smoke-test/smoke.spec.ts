import { test } from "@fixtures/ui-fixtures";

test("All page URLs return 200", async ({ smokePage, request }) => {
  await smokePage.assertAllUrlsReturn200(request);
});

test("No broken images on any page", async ({ smokePage }) => {
  await smokePage.assertNoBrokenImages();
});

test("No broken layouts — navbar and footer visible at all viewports", async ({ smokePage }) => {
  await smokePage.assertNoLayoutBreaks();
});
