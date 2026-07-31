import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "./route";
import prisma from "@/lib/prisma";

const SEED_PROPERTIES = [
  {
    slug: "modern-luxury-villa",
    title: "Modern Luxury Villa",
    description: "Spacious contemporary villa with floor-to-ceiling windows, open-plan living, and a private garden.",
    price: 1250000,
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 4200,
    propertyType: "Villa",
    imageUrl: "/images/properties/property-1.jpg",
    isFeatured: true,
    galleryUrls: "[]",
    features: "[]",
  },
  {
    slug: "downtown-penthouse",
    title: "Downtown Penthouse",
    description: "Stunning top-floor penthouse with panoramic city views and premium finishes throughout.",
    price: 895000,
    location: "New York, NY",
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 2100,
    propertyType: "Penthouse",
    imageUrl: "/images/properties/property-2.jpg",
    isFeatured: true,
    galleryUrls: "[]",
    features: "[]",
  },
];

describe("GET /api/properties/featured", () => {
  beforeEach(async () => {
    await prisma.property.deleteMany();
    for (const property of SEED_PROPERTIES) {
      await prisma.property.create({ data: property });
    }
  });

  it("should return featured properties as a raw array", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(2);
  });

  it("should include description and propertyType fields", async () => {
    const response = await GET();
    const json = await response.json();

    const first = json[0];
    expect(first).toHaveProperty("description");
    expect(first).toHaveProperty("propertyType");
    expect(first.propertyType).toBe("Villa");
  });

  it("should not return non-featured properties", async () => {
    await prisma.property.create({
      data: {
        slug: "hidden-property",
        title: "Hidden Property",
        description: "Should not appear.",
        price: 100000,
        location: "Nowhere",
        bedrooms: 1,
        bathrooms: 1,
        areaSqft: 500,
        propertyType: "Studio",
        imageUrl: "/images/properties/property-9.jpg",
        isFeatured: false,
        galleryUrls: "[]",
        features: "[]",
      },
    });

    const response = await GET();
    const json = await response.json();
    expect(json.every((p: { isFeatured: boolean }) => p.isFeatured)).toBe(true);
    expect(json.some((p: { slug: string }) => p.slug === "hidden-property")).toBe(false);
  });

  it("should return 500 when database throws", async () => {
    const originalFindMany = prisma.property.findMany;
    prisma.property.findMany = vi.fn().mockRejectedValue(new Error("DB error"));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Failed to fetch featured properties");

    prisma.property.findMany = originalFindMany;
  });
});
