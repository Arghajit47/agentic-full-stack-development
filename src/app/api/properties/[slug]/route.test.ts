import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { GET } from "./route";
import { NextRequest } from "next/server";

const prisma = new PrismaClient({
  datasources: { db: { url: "file:./prisma/test.db" } },
});

describe("GET /api/properties/[slug]", () => {
  beforeAll(async () => {
    // Seed test data
    await prisma.property.deleteMany();
    
    await prisma.property.create({
      data: {
        slug: "modern-villa-sunset-hills",
        title: "Modern Villa in Sunset Hills",
        description: "Beautiful modern villa with pool and garden",
        price: 1500000,
        location: "Sunset Hills, CA",
        bedrooms: 4,
        bathrooms: 3,
        areaSqft: 3500,
        propertyType: "Villa",
        imageUrl: "/images/properties/property-1.jpg",
        isFeatured: true,
        galleryUrls: JSON.stringify([
          "/images/properties/property-1.jpg",
          "/images/properties/property-2.jpg",
          "/images/properties/property-3.jpg",
          "/images/properties/property-4.jpg",
        ]),
        features: JSON.stringify([
          "Swimming Pool",
          "Smart Home",
          "Solar Panels",
          "Garden",
        ]),
      },
    });

    await prisma.property.create({
      data: {
        slug: "downtown-loft",
        title: "Downtown Loft Penthouse",
        description: "Modern loft in the heart of downtown",
        price: 850000,
        location: "Downtown, NY",
        bedrooms: 2,
        bathrooms: 2,
        areaSqft: 1800,
        propertyType: "Penthouse",
        imageUrl: "/images/properties/property-2.jpg",
        isFeatured: false,
        galleryUrls: JSON.stringify([
          "/images/properties/property-2.jpg",
        ]),
        features: JSON.stringify([
          "Floor-to-Ceiling Windows",
          "City View",
          "Concierge",
        ]),
      },
    });
  });

  afterAll(async () => {
    await prisma.property.deleteMany();
    await prisma.$disconnect();
  });

  it("should return property with parsed gallery and features arrays", async () => {
    const request = new NextRequest("http://localhost:3000/api/properties/modern-villa-sunset-hills");
    const context = {
      params: Promise.resolve({ slug: "modern-villa-sunset-hills" }),
    };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      slug: "modern-villa-sunset-hills",
      title: "Modern Villa in Sunset Hills",
      description: "Beautiful modern villa with pool and garden",
      price: 1500000,
      location: "Sunset Hills, CA",
      bedrooms: 4,
      bathrooms: 3,
      areaSqft: 3500,
      propertyType: "Villa",
      imageUrl: "/images/properties/property-1.jpg",
      isFeatured: true,
    });

    // Verify galleryUrls is an array
    expect(Array.isArray(data.galleryUrls)).toBe(true);
    expect(data.galleryUrls).toHaveLength(4);
    expect(data.galleryUrls).toEqual([
      "/images/properties/property-1.jpg",
      "/images/properties/property-2.jpg",
      "/images/properties/property-3.jpg",
      "/images/properties/property-4.jpg",
    ]);

    // Verify features is an array
    expect(Array.isArray(data.features)).toBe(true);
    expect(data.features).toHaveLength(4);
    expect(data.features).toEqual([
      "Swimming Pool",
      "Smart Home",
      "Solar Panels",
      "Garden",
    ]);

    // Verify timestamps exist
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("updatedAt");
  });

  it("should return 404 for non-existent slug", async () => {
    const request = new NextRequest("http://localhost:3000/api/properties/non-existent-property");
    const context = {
      params: Promise.resolve({ slug: "non-existent-property" }),
    };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: "Property not found" });
  });

  it("should handle property with single gallery image", async () => {
    const request = new NextRequest("http://localhost:3000/api/properties/downtown-loft");
    const context = {
      params: Promise.resolve({ slug: "downtown-loft" }),
    };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.slug).toBe("downtown-loft");
    expect(Array.isArray(data.galleryUrls)).toBe(true);
    expect(data.galleryUrls).toHaveLength(1);
    expect(data.galleryUrls).toEqual(["/images/properties/property-2.jpg"]);
  });

  it("should return all property fields including id", async () => {
    const request = new NextRequest("http://localhost:3000/api/properties/modern-villa-sunset-hills");
    const context = {
      params: Promise.resolve({ slug: "modern-villa-sunset-hills" }),
    };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(typeof data.id).toBe("number");
  });

  it("should handle slugs with special characters correctly", async () => {
    // Create a property with a slug that has multiple dashes
    await prisma.property.create({
      data: {
        slug: "luxury-beach-front-villa-2024",
        title: "Luxury Beach Front Villa 2024",
        description: "Amazing beachfront property",
        price: 2500000,
        location: "Malibu, CA",
        bedrooms: 5,
        bathrooms: 4,
        areaSqft: 4500,
        propertyType: "Villa",
        imageUrl: "/images/properties/property-3.jpg",
        isFeatured: true,
        galleryUrls: JSON.stringify(["/images/properties/property-3.jpg"]),
        features: JSON.stringify(["Ocean View", "Private Beach"]),
      },
    });

    const request = new NextRequest("http://localhost:3000/api/properties/luxury-beach-front-villa-2024");
    const context = {
      params: Promise.resolve({ slug: "luxury-beach-front-villa-2024" }),
    };

    const response = await GET(request, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.slug).toBe("luxury-beach-front-villa-2024");
    expect(data.title).toBe("Luxury Beach Front Villa 2024");

    // Cleanup
    await prisma.property.delete({
      where: { slug: "luxury-beach-front-villa-2024" },
    });
  });
});
