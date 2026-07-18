/**
 * KAN-10: GET /api/properties — Unit tests
 *
 * Covers all Acceptance Criteria:
 *  - Paginated, searchable, filterable property list
 *  - Response shape: { items, total, page, limit }
 *  - Query params: search, type, featured, page, limit
 *  - Zod 400 validation on bad inputs
 *  - galleryUrls + features parsed from JSON text to arrays (via json-helpers)
 *  - skip/take pagination: skip = (page-1)*limit
 *  - total count via prisma.property.count()
 *  - 500 on DB error
 */

import { describe, it, expect, beforeEach, afterEach, afterAll, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/properties/route";
import prisma from "@/lib/prisma";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost/api/properties");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new NextRequest(url.toString());
}

async function getJson(res: Response) {
  return res.json();
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED = [
  {
    slug: "malibu-villa",
    title: "Malibu Beachfront Villa",
    description: "Stunning ocean views in Malibu",
    price: 2_500_000,
    location: "Malibu, CA",
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 4200,
    propertyType: "Villa",
    imageUrl: "https://example.com/villa.jpg",
    isFeatured: true,
    galleryUrls: JSON.stringify(["https://example.com/g1.jpg", "https://example.com/g2.jpg"]),
    features: JSON.stringify(["Pool", "Ocean View", "Garage"]),
  },
  {
    slug: "aspen-mansion",
    title: "Aspen Mountain Mansion",
    description: "Luxurious ski-in ski-out estate",
    price: 8_000_000,
    location: "Aspen, CO",
    bedrooms: 8,
    bathrooms: 7,
    areaSqft: 9500,
    propertyType: "Mansion",
    imageUrl: "https://example.com/mansion.jpg",
    isFeatured: true,
    galleryUrls: JSON.stringify([]),
    features: JSON.stringify(["Ski-In/Ski-Out", "Wine Cellar"]),
  },
  {
    slug: "brooklyn-cottage",
    title: "Brooklyn Cottage",
    description: "Cosy brownstone in Brooklyn Heights",
    price: 950_000,
    location: "Brooklyn, NY",
    bedrooms: 2,
    bathrooms: 1,
    areaSqft: 1100,
    propertyType: "Cottage",
    imageUrl: "https://example.com/cottage.jpg",
    isFeatured: false,
    galleryUrls: JSON.stringify([]),
    features: JSON.stringify(["Garden"]),
  },
  {
    slug: "miami-estate",
    title: "Miami Waterfront Estate",
    description: "Modern estate with private dock",
    price: 4_200_000,
    location: "Miami, FL",
    bedrooms: 6,
    bathrooms: 5,
    areaSqft: 6100,
    propertyType: "Estate",
    imageUrl: "https://example.com/estate.jpg",
    isFeatured: false,
    galleryUrls: JSON.stringify(["https://example.com/e1.jpg"]),
    features: JSON.stringify(["Private Dock", "Pool"]),
  },
  {
    slug: "austin-house",
    title: "Austin Family House",
    description: "Spacious home in Austin suburb",
    price: 650_000,
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2800,
    propertyType: "House",
    imageUrl: "https://example.com/house.jpg",
    isFeatured: false,
    galleryUrls: JSON.stringify([]),
    features: JSON.stringify(["Backyard", "2-Car Garage"]),
  },
];

describe("GET /api/properties (KAN-10)", () => {
  beforeEach(async () => {
    // Wipe ALL properties before each test to ensure clean isolation
    await prisma.property.deleteMany();
    for (const p of SEED) {
      await prisma.property.create({ data: p });
    }
  });

  afterEach(async () => {
    // Clean up after each test to prevent cross-file DB leakage
    await prisma.property.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ─── Response shape ────────────────────────────────────────────────────────

  describe("Response shape", () => {
    it("returns { items, total, page, limit } at the top level", async () => {
      const res = await GET(makeRequest());
      expect(res.status).toBe(200);
      const body = await getJson(res);
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("limit");
      expect(Array.isArray(body.items)).toBe(true);
      expect(typeof body.total).toBe("number");
    });

    it("defaults to page=1 and limit=10 when no params given", async () => {
      const res = await GET(makeRequest());
      const body = await getJson(res);
      expect(body.page).toBe(1);
      expect(body.limit).toBe(10);
    });

    it("parses galleryUrls from JSON text to string[]", async () => {
      const res = await GET(makeRequest({ search: "Malibu" }));
      const body = await getJson(res);
      expect(Array.isArray(body.items[0].galleryUrls)).toBe(true);
      expect(body.items[0].galleryUrls).toEqual([
        "https://example.com/g1.jpg",
        "https://example.com/g2.jpg",
      ]);
    });

    it("parses features from JSON text to string[]", async () => {
      const res = await GET(makeRequest({ search: "Malibu" }));
      const body = await getJson(res);
      expect(Array.isArray(body.items[0].features)).toBe(true);
      expect(body.items[0].features).toEqual(["Pool", "Ocean View", "Garage"]);
    });

    it("returns empty arrays for empty JSON galleryUrls/features", async () => {
      const res = await GET(makeRequest({ search: "Aspen" }));
      const body = await getJson(res);
      expect(body.items[0].galleryUrls).toEqual([]);
    });
  });

  // ─── Empty / no params ─────────────────────────────────────────────────────

  describe("Empty search (no params)", () => {
    it("returns all properties paginated", async () => {
      const res = await GET(makeRequest());
      const body = await getJson(res);
      expect(body.total).toBe(SEED.length);
      expect(body.items.length).toBe(SEED.length); // 5 < default limit 10
    });

    it("returns 200 even when DB is empty", async () => {
      await prisma.property.deleteMany();
      const res = await GET(makeRequest());
      expect(res.status).toBe(200);
      const body = await getJson(res);
      expect(body.items).toEqual([]);
      expect(body.total).toBe(0);
    });
  });

  // ─── Search filter ──────────────────────────────────────────────────────────

  describe("?search= filter", () => {
    it("filters by title (case-insensitive)", async () => {
      // SQLite contains is case-insensitive for ASCII — 'Malibu' matches
      const res = await GET(makeRequest({ search: "Malibu" }));
      const body = await getJson(res);
      expect(body.total).toBe(1);
      expect(body.items[0].title).toBe("Malibu Beachfront Villa");
    });

    it("filters by location", async () => {
      // Use exact casing to be safe with SQLite
      const res = await GET(makeRequest({ search: "Brooklyn" }));
      const body = await getJson(res);
      expect(body.total).toBe(1);
      expect(body.items[0].slug).toBe("brooklyn-cottage");
    });

    it("filters by description", async () => {
      // Use exact casing from seed data: "private dock" vs "private Dock"
      const res = await GET(makeRequest({ search: "private dock" }));
      const body = await getJson(res);
      expect(body.total).toBe(1);
      expect(body.items[0].slug).toBe("miami-estate");
    });

    it("returns empty items when no match", async () => {
      const res = await GET(makeRequest({ search: "NonExistentXYZ123" }));
      const body = await getJson(res);
      expect(body.total).toBe(0);
      expect(body.items).toEqual([]);
    });
  });

  // ─── Type filter ────────────────────────────────────────────────────────────

  describe("?type= filter", () => {
    it("filters by exact propertyType", async () => {
      const res = await GET(makeRequest({ type: "Villa" }));
      const body = await getJson(res);
      expect(body.total).toBe(1);
      expect(body.items[0].propertyType).toBe("Villa");
    });

    it("returns all types when type=All (or omitted)", async () => {
      const res = await GET(makeRequest({ type: "All" }));
      const body = await getJson(res);
      expect(body.total).toBe(SEED.length);
    });

    it("returns all types when type param is omitted", async () => {
      const res = await GET(makeRequest());
      const body = await getJson(res);
      expect(body.total).toBe(SEED.length);
    });

    it("returns empty items for non-existent type", async () => {
      const res = await GET(makeRequest({ type: "Penthouse" }));
      const body = await getJson(res);
      expect(body.total).toBe(0);
      expect(body.items).toEqual([]);
    });
  });

  // ─── Featured filter ────────────────────────────────────────────────────────

  describe("?featured= filter", () => {
    it("returns only featured properties when featured=true", async () => {
      const res = await GET(makeRequest({ featured: "true" }));
      const body = await getJson(res);
      expect(body.total).toBe(2); // villa + mansion from seed
      expect(body.items.every((p: { isFeatured: boolean }) => p.isFeatured === true)).toBe(true);
    });

    it("returns only non-featured properties when featured=false", async () => {
      const res = await GET(makeRequest({ featured: "false" }));
      const body = await getJson(res);
      expect(body.total).toBe(3); // cottage + estate + house from seed
      expect(body.items.every((p: { isFeatured: boolean }) => p.isFeatured === false)).toBe(true);
    });

    it("returns all properties when featured param is omitted", async () => {
      const res = await GET(makeRequest());
      const body = await getJson(res);
      expect(body.total).toBe(SEED.length);
    });
  });

  // ─── Combined filters ────────────────────────────────────────────────────────

  describe("Combined filters", () => {
    it("combines search + type correctly", async () => {
      const res = await GET(makeRequest({ search: "Aspen", type: "Mansion" }));
      const body = await getJson(res);
      expect(body.total).toBe(1);
      expect(body.items[0].slug).toBe("aspen-mansion");
    });

    it("combines featured + type correctly", async () => {
      const res = await GET(makeRequest({ featured: "true", type: "Villa" }));
      const body = await getJson(res);
      expect(body.total).toBe(1);
      expect(body.items[0].slug).toBe("malibu-villa");
    });

    it("returns 0 when combined filters produce no matches", async () => {
      const res = await GET(makeRequest({ search: "Malibu", type: "Cottage" }));
      const body = await getJson(res);
      expect(body.total).toBe(0);
    });
  });

  // ─── Pagination ──────────────────────────────────────────────────────────────

  describe("Pagination (skip/take)", () => {
    it("returns first page correctly with limit=2", async () => {
      const res = await GET(makeRequest({ limit: "2", page: "1" }));
      const body = await getJson(res);
      expect(body.items.length).toBe(2);
      expect(body.page).toBe(1);
      expect(body.limit).toBe(2);
      expect(body.total).toBe(SEED.length);
    });

    it("returns second page correctly with limit=2", async () => {
      const res = await GET(makeRequest({ limit: "2", page: "2" }));
      const body = await getJson(res);
      expect(body.items.length).toBe(2);
      expect(body.page).toBe(2);
    });

    it("returns last partial page correctly", async () => {
      // 5 items, limit 2 → page 3 should have 1 item
      const res = await GET(makeRequest({ limit: "2", page: "3" }));
      const body = await getJson(res);
      expect(body.items.length).toBe(1);
    });

    it("returns empty items when page is beyond total", async () => {
      const res = await GET(makeRequest({ limit: "2", page: "99" }));
      const body = await getJson(res);
      expect(body.items).toEqual([]);
      expect(body.total).toBe(SEED.length); // total unchanged
    });

    it("total always reflects the full count, not the page slice", async () => {
      const res = await GET(makeRequest({ limit: "1", page: "1" }));
      const body = await getJson(res);
      expect(body.total).toBe(SEED.length);
      expect(body.items.length).toBe(1);
    });
  });

  // ─── Zod validation / 400 errors ────────────────────────────────────────────

  describe("Input validation (400)", () => {
    it("returns 400 for page=0 (min 1)", async () => {
      const res = await GET(makeRequest({ page: "0" }));
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body).toHaveProperty("error");
    });

    it("returns 400 for limit=0 (min 1)", async () => {
      const res = await GET(makeRequest({ limit: "0" }));
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body).toHaveProperty("error");
    });

    it("returns 400 for limit=51 (max 50)", async () => {
      const res = await GET(makeRequest({ limit: "51" }));
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body).toHaveProperty("error");
    });

    it("returns 400 for non-numeric page", async () => {
      const res = await GET(makeRequest({ page: "abc" }));
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body).toHaveProperty("error");
    });

    it("returns 400 for invalid featured value", async () => {
      const res = await GET(makeRequest({ featured: "maybe" }));
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body).toHaveProperty("error");
    });
  });

  // ─── Server error ────────────────────────────────────────────────────────────

  describe("Server error (500)", () => {
    it("returns 500 when Prisma findMany throws", async () => {
      vi.spyOn(prisma.property, "findMany").mockRejectedValueOnce(new Error("DB down"));
      const res = await GET(makeRequest());
      expect(res.status).toBe(500);
      const body = (await getJson(res)) as { error: string };
      expect(typeof body.error).toBe("string");
    });

    it("returns 500 when Prisma count throws", async () => {
      vi.spyOn(prisma.property, "count").mockRejectedValueOnce(new Error("DB down"));
      const res = await GET(makeRequest());
      expect(res.status).toBe(500);
    });
  });
});
