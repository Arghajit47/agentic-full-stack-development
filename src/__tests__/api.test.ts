import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { GET as getFeaturedProperties } from "@/app/api/properties/featured/route";
import { GET as getFeaturedReviews } from "@/app/api/reviews/featured/route";
import { GET as getSettings } from "@/app/api/settings/route";
import { propertySchema, reviewSchema, settingsSchema } from "@/lib/validators";
import prisma from "@/lib/prisma";

// Helper: extract JSON body from a NextResponse
async function getJsonBody(res: Response): Promise<unknown> {
  return res.json();
}

describe("GET /api/properties/featured", () => {
  beforeEach(async () => {
    // Re-seed before each test to ensure consistent state
    await prisma.property.deleteMany();
    await prisma.review.deleteMany();
    await prisma.siteSetting.deleteMany();

    const properties = [
      {
        slug: "featured-1",
        title: "Featured Property 1",
        description: "First featured property",
        price: 500000,
        location: "Location A",
        bedrooms: 3,
        bathrooms: 2,
        areaSqft: 1500,
        propertyType: "House",
        imageUrl: "https://example.com/1.jpg",
        isFeatured: true,
        galleryUrls: JSON.stringify(["https://example.com/g1.jpg", "https://example.com/g2.jpg"]),
        features: JSON.stringify(["Pool", "Garage"]),
      },
      {
        slug: "featured-2",
        title: "Featured Property 2",
        description: "Second featured property",
        price: 750000,
        location: "Location B",
        bedrooms: 4,
        bathrooms: 3,
        areaSqft: 2200,
        propertyType: "Villa",
        imageUrl: "https://example.com/2.jpg",
        isFeatured: true,
        galleryUrls: JSON.stringify([]),
        features: JSON.stringify(["Garden"]),
      },
      {
        slug: "not-featured-1",
        title: "Not Featured Property",
        description: "Not featured",
        price: 300000,
        location: "Location C",
        bedrooms: 2,
        bathrooms: 1,
        areaSqft: 900,
        propertyType: "Apartment",
        imageUrl: "https://example.com/3.jpg",
        isFeatured: false,
        galleryUrls: JSON.stringify([]),
        features: JSON.stringify([]),
      },
    ];

    for (const p of properties) {
      await prisma.property.create({ data: p });
    }

    const reviews = [
      {
        clientName: "Test Client",
        clientAvatarUrl: "https://example.com/avatar.jpg",
        rating: 5,
        reviewText: "Great!",
        propertyTitle: "Some Property",
      },
    ];
    for (const r of reviews) {
      await prisma.review.create({ data: r });
    }

    await prisma.siteSetting.create({
      data: { key: "properties_heading", value: "Featured Properties" },
    });
  });

  it("returns 200 with array of featured properties", async () => {
    const res = await getFeaturedProperties();
    expect(res.status).toBe(200);
    const body = await getJsonBody(res);
    expect(Array.isArray(body)).toBe(true);
  });

  it("returns only featured properties (isFeatured=true)", async () => {
    const res = await getFeaturedProperties();
    const body = (await getJsonBody(res)) as Array<{ isFeatured: boolean }>;
    expect(body.length).toBe(2); // 2 featured in seed
    expect(body.every((p) => p.isFeatured === true)).toBe(true);
  });

  it("returns at most 6 featured properties", async () => {
    // Add more featured properties; the endpoint no longer caps at 6.
    for (let i = 3; i <= 10; i++) {
      await prisma.property.create({
        data: {
          slug: `featured-${i}`,
          title: `Featured Property ${i}`,
          description: `Featured property ${i}`,
          price: 100000 * i,
          location: `Location ${i}`,
          bedrooms: i,
          bathrooms: i - 1,
          areaSqft: 1000 * i,
          propertyType: "House",
          imageUrl: `https://example.com/${i}.jpg`,
          isFeatured: true,
          galleryUrls: "[]",
          features: "[]",
        },
      });
    }
    const res = await getFeaturedProperties();
    const body = (await getJsonBody(res)) as unknown[];
    // 2 from beforeEach + 8 added above
    expect(body.length).toBe(10);
  });

  it("parses galleryUrls and features from JSON text to arrays", async () => {
    const res = await getFeaturedProperties();
    const body = (await getJsonBody(res)) as Array<{
      galleryUrls: string[];
      features: string[];
    }>;
    expect(body[0].galleryUrls).toEqual(["https://example.com/g1.jpg", "https://example.com/g2.jpg"]);
    expect(body[0].features).toEqual(["Pool", "Garage"]);
    expect(Array.isArray(body[0].galleryUrls)).toBe(true);
    expect(Array.isArray(body[0].features)).toBe(true);
  });

  it("returns properties that match propertySchema", async () => {
    const res = await getFeaturedProperties();
    const body = (await getJsonBody(res)) as unknown[];
    for (const item of body) {
      expect(propertySchema.safeParse(item).success).toBe(true);
    }
  });

  it("returns empty array when no properties exist (empty DB)", async () => {
    await prisma.property.deleteMany();
    const res = await getFeaturedProperties();
    expect(res.status).toBe(200);
    const body = await getJsonBody(res);
    expect(body).toEqual([]);
  });

  it("returns 500 with { error: string } when the DB throws", async () => {
    vi.spyOn(prisma.property, "findMany").mockRejectedValueOnce(new Error("DB down"));
    const res = await getFeaturedProperties();
    expect(res.status).toBe(500);
    const body = (await getJsonBody(res)) as { error: string };
    expect(typeof body.error).toBe("string");
  });
});

describe("GET /api/reviews/featured", () => {
  beforeEach(async () => {
    await prisma.review.deleteMany();

    const reviews = [
      {
        clientName: "Alice",
        clientAvatarUrl: "https://example.com/a.jpg",
        rating: 5,
        reviewText: "Excellent service!",
        propertyTitle: "Villa Alpha",
      },
      {
        clientName: "Bob",
        clientAvatarUrl: "https://example.com/b.jpg",
        rating: 4,
        reviewText: "Very good experience.",
        propertyTitle: "Loft Beta",
      },
      {
        clientName: "Charlie",
        clientAvatarUrl: "https://example.com/c.jpg",
        rating: 3,
        reviewText: "It was okay.",
        propertyTitle: null,
      },
    ];

    for (const r of reviews) {
      await prisma.review.create({ data: r });
    }
  });

  it("returns 200 with array of reviews", async () => {
    const res = await getFeaturedReviews();
    expect(res.status).toBe(200);
    const body = await getJsonBody(res);
    expect(Array.isArray(body)).toBe(true);
  });

  it("returns at most 5 reviews", async () => {
    // Add more reviews; the endpoint no longer caps at 5.
    for (let i = 4; i <= 10; i++) {
      await prisma.review.create({
        data: {
          clientName: `Client ${i}`,
          clientAvatarUrl: `https://example.com/${i}.jpg`,
          rating: (i % 5) + 1,
          reviewText: `Review ${i}`,
          propertyTitle: `Property ${i}`,
        },
      });
    }
    const res = await getFeaturedReviews();
    const body = (await getJsonBody(res)) as unknown[];
    // 3 from beforeEach + 7 added above
    expect(body.length).toBe(10);
  });

  it("returns reviews that match reviewSchema", async () => {
    const res = await getFeaturedReviews();
    const body = (await getJsonBody(res)) as unknown[];
    for (const item of body) {
      expect(reviewSchema.safeParse(item).success).toBe(true);
    }
  });

  it("handles nullable propertyTitle", async () => {
    const res = await getFeaturedReviews();
    const body = (await getJsonBody(res)) as Array<{ propertyTitle: string | null }>;
    const nullReview = body.find((r) => r.propertyTitle === null);
    expect(nullReview).toBeDefined();
  });

  it("returns empty array when no reviews exist (empty DB)", async () => {
    await prisma.review.deleteMany();
    const res = await getFeaturedReviews();
    expect(res.status).toBe(200);
    const body = await getJsonBody(res);
    expect(body).toEqual([]);
  });

  it("returns 500 with { error: string } when the DB throws", async () => {
    vi.spyOn(prisma.review, "findMany").mockRejectedValueOnce(new Error("DB down"));
    const res = await getFeaturedReviews();
    expect(res.status).toBe(500);
    const body = (await getJsonBody(res)) as { error: string };
    expect(typeof body.error).toBe("string");
  });
});

describe("GET /api/settings", () => {
  beforeEach(async () => {
    await prisma.siteSetting.deleteMany();

    const settings = [
      { key: "properties_heading", value: "Featured Properties" },
      { key: "properties_subheading", value: "Our handpicked selection" },
      { key: "reviews_heading", value: "Client Testimonials" },
      { key: "reviews_subheading", value: "What our clients say" },
      { key: "site_name", value: "EstateHub" },
    ];

    for (const s of settings) {
      await prisma.siteSetting.create({ data: s });
    }
  });

  it("returns 200 with settings object", async () => {
    const res = await getSettings();
    expect(res.status).toBe(200);
    const body = await getJsonBody(res);
    expect(typeof body).toBe("object");
    expect(body).not.toBeNull();
  });

  it("returns key-value pairs as flat object", async () => {
    const res = await getSettings();
    const body = (await getJsonBody(res)) as Record<string, string>;
    expect(body.properties_heading).toBe("Featured Properties");
    expect(body.properties_subheading).toBe("Our handpicked selection");
    expect(body.reviews_heading).toBe("Client Testimonials");
    expect(body.reviews_subheading).toBe("What our clients say");
    expect(body.site_name).toBe("EstateHub");
  });

  it("returns object that matches settingsSchema", async () => {
    const res = await getSettings();
    const body = await getJsonBody(res);
    expect(settingsSchema.safeParse(body).success).toBe(true);
  });

  it("returns empty object when no settings exist (empty DB)", async () => {
    await prisma.siteSetting.deleteMany();
    const res = await getSettings();
    expect(res.status).toBe(200);
    const body = await getJsonBody(res);
    expect(body).toEqual({});
  });

  it("returns 500 with { error: string } when the DB throws", async () => {
    vi.spyOn(prisma.siteSetting, "findMany").mockRejectedValueOnce(new Error("DB down"));
    const res = await getSettings();
    expect(res.status).toBe(500);
    const body = (await getJsonBody(res)) as { error: string };
    expect(typeof body.error).toBe("string");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});