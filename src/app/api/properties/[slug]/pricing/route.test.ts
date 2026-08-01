import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import prisma from "@/lib/prisma";

function makeRequest(slug: string): NextRequest {
  return new Request(`http://localhost:3000/api/properties/${slug}/pricing`, {
    method: "GET",
  }) as unknown as NextRequest;
}

function makeContext(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

const TEST_SLUG_1 = "test-pricing-villa";
const TEST_SLUG_2 = "test-pricing-penthouse";

const baseProperty = {
  description: "A test property",
  location: "Test City",
  bedrooms: 3,
  bathrooms: 2,
  areaSqft: 2000,
  propertyType: "Villa",
  imageUrl: "https://example.com/image.jpg",
  galleryUrls: JSON.stringify([]),
  features: JSON.stringify([]),
};

describe("GET /api/properties/[slug]/pricing", () => {
  beforeAll(async () => {
    await prisma.propertyPricing.deleteMany({ where: { propertySlug: { in: [TEST_SLUG_1, TEST_SLUG_2] } } });
    await prisma.property.deleteMany({ where: { slug: { in: [TEST_SLUG_1, TEST_SLUG_2] } } });

    await prisma.property.create({ data: { ...baseProperty, slug: TEST_SLUG_1, title: "Test Pricing Villa", price: 500000 } });
    await prisma.property.create({ data: { ...baseProperty, slug: TEST_SLUG_2, title: "Test Pricing Penthouse", price: 800000 } });

    for (const [slug, listing] of [[TEST_SLUG_1, 500000], [TEST_SLUG_2, 800000]] as [string, number][]) {
      await prisma.propertyPricing.create({
        data: {
          propertySlug: slug,
          listingPrice: listing,
          platformFee: Math.floor(listing * 0.02),
          processingFee: Math.floor(listing * 0.005),
          inspectionCost: 500,
          legalFee: 1500,
          insuranceCost: Math.floor(listing * 0.003),
          totalPrice: listing + Math.floor(listing * 0.02) + Math.floor(listing * 0.005) + 500 + 1500 + Math.floor(listing * 0.003),
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.propertyPricing.deleteMany({ where: { propertySlug: { in: [TEST_SLUG_1, TEST_SLUG_2] } } });
    await prisma.property.deleteMany({ where: { slug: { in: [TEST_SLUG_1, TEST_SLUG_2] } } });
  });

  it("returns 404 for non-existent property", async () => {
    const response = await GET(makeRequest("non-existent-property"), makeContext("non-existent-property"));
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Property not found");
  });

  it("returns pricing breakdown for valid property", async () => {
    const response = await GET(makeRequest(TEST_SLUG_1), makeContext(TEST_SLUG_1));
    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty("propertySlug", TEST_SLUG_1);
    expect(data).toHaveProperty("breakdown");
    expect(data).toHaveProperty("totalPrice");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("updatedAt");

    expect(data.breakdown).toHaveProperty("listing");
    expect(data.breakdown).toHaveProperty("fees");
    expect(data.breakdown).toHaveProperty("costs");

    expect(data.breakdown.listing).toHaveProperty("amount");
    expect(data.breakdown.listing).toHaveProperty("label", "Listing Price");

    expect(data.breakdown.fees).toHaveProperty("platformFee");
    expect(data.breakdown.fees.platformFee).toHaveProperty("amount");
    expect(data.breakdown.fees.platformFee).toHaveProperty("label", "Platform Service Fee");

    expect(data.breakdown.fees).toHaveProperty("processingFee");
    expect(data.breakdown.fees.processingFee).toHaveProperty("amount");
    expect(data.breakdown.fees.processingFee).toHaveProperty("label", "Transaction Processing Fee");

    expect(data.breakdown.costs).toHaveProperty("inspectionCost");
    expect(data.breakdown.costs.inspectionCost).toHaveProperty("amount");
    expect(data.breakdown.costs.inspectionCost).toHaveProperty("label", "Property Inspection");

    expect(data.breakdown.costs).toHaveProperty("legalFee");
    expect(data.breakdown.costs.legalFee).toHaveProperty("amount");
    expect(data.breakdown.costs.legalFee).toHaveProperty("label", "Legal Documentation");

    expect(data.breakdown.costs).toHaveProperty("insuranceCost");
    expect(data.breakdown.costs.insuranceCost).toHaveProperty("amount");
    expect(data.breakdown.costs.insuranceCost).toHaveProperty("label", "Insurance Cost");

    const expectedTotal =
      data.breakdown.listing.amount +
      data.breakdown.fees.platformFee.amount +
      data.breakdown.fees.processingFee.amount +
      data.breakdown.costs.inspectionCost.amount +
      data.breakdown.costs.legalFee.amount +
      data.breakdown.costs.insuranceCost.amount;

    expect(data.totalPrice).toBe(expectedTotal);
  });

  it("returns different pricing for different properties", async () => {
    const response1 = await GET(makeRequest(TEST_SLUG_1), makeContext(TEST_SLUG_1));
    const response2 = await GET(makeRequest(TEST_SLUG_2), makeContext(TEST_SLUG_2));

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    const data1 = await response1.json();
    const data2 = await response2.json();

    expect(data1.totalPrice).not.toBe(data2.totalPrice);
    expect(data1.breakdown.listing.amount).not.toBe(data2.breakdown.listing.amount);
  });

  it("verifies pricing calculation logic", async () => {
    const response = await GET(makeRequest(TEST_SLUG_1), makeContext(TEST_SLUG_1));
    expect(response.status).toBe(200);

    const data = await response.json();
    const listing = data.breakdown.listing.amount;

    const expectedPlatformFee = Math.floor(listing * 0.02);
    expect(data.breakdown.fees.platformFee.amount).toBe(expectedPlatformFee);

    const expectedProcessingFee = Math.floor(listing * 0.005);
    expect(data.breakdown.fees.processingFee.amount).toBe(expectedProcessingFee);

    expect(data.breakdown.costs.inspectionCost.amount).toBe(500);
    expect(data.breakdown.costs.legalFee.amount).toBe(1500);

    const expectedInsurance = Math.floor(listing * 0.003);
    expect(data.breakdown.costs.insuranceCost.amount).toBe(expectedInsurance);
  });
});
