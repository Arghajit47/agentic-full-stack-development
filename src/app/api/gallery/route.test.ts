import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import prisma from "@/lib/prisma";

const SEED_GALLERY = [
  { imageUrl: "/images/properties/property-1.jpg", caption: "Luxury Villa Exterior", order: 1 },
  { imageUrl: "/images/properties/property-2.jpg", caption: "Modern Living Room", order: 2 },
  { imageUrl: "/images/properties/property-3.jpg", caption: "Spacious Kitchen", order: 3 },
  { imageUrl: "/images/properties/property-4.jpg", caption: "Master Bedroom Suite", order: 4 },
  { imageUrl: "/images/properties/property-5.jpg", caption: "Outdoor Entertainment Area", order: 5 },
  { imageUrl: "/images/properties/property-6.jpg", caption: "Swimming Pool & Garden", order: 6 },
];

describe("GET /api/gallery", () => {
  beforeEach(async () => {
    await prisma.galleryImage.deleteMany();
    for (const image of SEED_GALLERY) {
      await prisma.galleryImage.create({ data: image });
    }
  });

  it("should return gallery images ordered by order field", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("should return gallery images with required fields", async () => {
    const response = await GET();
    const json = await response.json();

    if (json.data.length > 0) {
      const image = json.data[0];
      expect(image).toHaveProperty("id");
      expect(image).toHaveProperty("imageUrl");
      expect(image).toHaveProperty("caption");
      expect(image).toHaveProperty("order");
    }
  });

  it("should return gallery images in ascending order", async () => {
    const response = await GET();
    const json = await response.json();

    if (json.data.length > 1) {
      for (let i = 0; i < json.data.length - 1; i++) {
        expect(json.data[i].order).toBeLessThanOrEqual(json.data[i + 1].order);
      }
    }
  });

  it("should return exactly 6 gallery images from seed data", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.data.length).toBe(6);
  });

  it("should return image URLs starting with /images/properties/", async () => {
    const response = await GET();
    const json = await response.json();

    json.data.forEach((image: any) => {
      expect(image.imageUrl).toMatch(/^\/images\/properties\//);
    });
  });

  it("should return first image with correct caption", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.data[0].caption).toBe("Luxury Villa Exterior");
    expect(json.data[0].imageUrl).toBe("/images/properties/property-1.jpg");
  });

  it("should return last image with correct caption", async () => {
    const response = await GET();
    const json = await response.json();

    expect(json.data[5].caption).toBe("Swimming Pool & Garden");
    expect(json.data[5].imageUrl).toBe("/images/properties/property-6.jpg");
  });
});
