import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "./route";
import prisma from "@/lib/prisma";

const SEED_REVIEWS = [
  {
    clientName: "Sarah Johnson",
    clientLocation: "Beverly Hills, CA",
    clientAvatarUrl: "https://example.com/sarah.jpg",
    rating: 5,
    reviewText: "Great service!",
    propertyTitle: "Modern Luxury Villa",
  },
  {
    clientName: "Michael Chen",
    clientLocation: "New York, NY",
    clientAvatarUrl: "https://example.com/michael.jpg",
    rating: 5,
    reviewText: "Very professional.",
    propertyTitle: "Downtown Penthouse",
  },
];

describe("GET /api/reviews/featured", () => {
  beforeEach(async () => {
    await prisma.review.deleteMany();
    for (const review of SEED_REVIEWS) {
      await prisma.review.create({ data: review });
    }
  });

  it("should return featured reviews as a raw array", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(2);
  });

  it("should include required review fields", async () => {
    const response = await GET();
    const json = await response.json();

    const first = json[0];
    expect(first).toHaveProperty("clientName");
    expect(first).toHaveProperty("clientAvatarUrl");
    expect(first).toHaveProperty("rating");
    expect(first).toHaveProperty("reviewText");
    expect(first).toHaveProperty("propertyTitle");
  });

  it("should limit results to 5 reviews", async () => {
    await prisma.review.deleteMany();
    for (let i = 0; i < 7; i++) {
      await prisma.review.create({
        data: {
          clientName: `Reviewer ${i}`,
          clientLocation: "City",
          clientAvatarUrl: "https://example.com/avatar.jpg",
          rating: 4,
          reviewText: "Review text",
          propertyTitle: i === 0 ? null : "Property",
        },
      });
    }

    const response = await GET();
    const json = await response.json();
    expect(json.length).toBeLessThanOrEqual(5);
  });

  it("should return 500 when database throws", async () => {
    const originalFindMany = prisma.review.findMany;
    prisma.review.findMany = vi.fn().mockRejectedValue(new Error("DB error"));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Failed to fetch featured reviews");

    prisma.review.findMany = originalFindMany;
  });
});
