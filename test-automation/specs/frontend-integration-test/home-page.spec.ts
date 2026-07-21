import { test } from "@fixtures/ui-fixtures";

test("Home page live API data vs UI validation", async ({ homepage }) => {
  await homepage.assertLiveApiDataValidation();
});

test("Home Page components, responsive layout", async ({ homepage }) => {
  await homepage.navigateHomePage();
  await test.step("Set viewport to WIDE and assert featured grid columns", async () => {
    await homepage.setViewport("WIDE");
    await homepage.assertFeaturedGridColumns("WIDE");
    await homepage.assertTestimonialsGridColumns("WIDE");
  });
  await test.step("Set viewport to DESKTOP and assert featured grid columns", async () => {
    await homepage.setViewport("DESKTOP");
    await homepage.assertFeaturedGridColumns("DESKTOP");
    await homepage.assertTestimonialsGridColumns("DESKTOP");
  });
  await test.step("Set viewport to LAPTOP and assert featured grid columns", async () => {
    await homepage.setViewport("LAPTOP");
    await homepage.assertFeaturedGridColumns("LAPTOP");
    await homepage.assertTestimonialsGridColumns("LAPTOP");
  });
  await test.step("Set viewport to TABLET and assert featured grid columns", async () => {
    await homepage.setViewport("TABLET");
    await homepage.assertTestimonialsGridColumns("TABLET");
    await homepage.assertTestimonialsGridColumns("TABLET");
  });
  await test.step("Set viewport to MOBILE and assert featured grid columns", async () => {
    await homepage.setViewport("MOBILE");
    await homepage.assertFeaturedGridColumns("MOBILE");
    await homepage.assertTestimonialsGridColumns("MOBILE");
  });
});

test("Home page skeleton loading", async ({ homepage }) => {
  await homepage.assertLoadingSkeletons();
});

test("Home page empty states", async ({ homepage }) => {
  await homepage.assertEmptyStates();
});

test("Home page console error handling and image error handling", async ({ homepage }) => {
  await homepage.assertNoConsoleErrors();
  await homepage.assertNoImage404s();
});
