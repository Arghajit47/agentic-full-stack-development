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

const TEST_SLUG = "test-pricing-villa-kan114";

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

const PRICING_CREATE = {
  propertySlug: TEST_SLUG,
  propertyTransferTax: 25000,
  legalFees: 3000,
  homeInspection: 500,
  propertyInsurance: 1200,
  mortgageFees: "Varies",
  propertyTaxesMonthly: 1250,
  hoaFeeMonthly: 300,
  downPayment: 250000,
  downPaymentPct: 20,
  mortgageAmount: 1000000,
};

describe("GET /api/properties/[slug]/pricing", () => {
  beforeAll(async () => {
    await prisma.propertyPricing.deleteMany({ where: { propertySlug: TEST_SLUG } });
    await prisma.property.deleteMany({ where: { slug: TEST_SLUG } });

    await prisma.property.create({
      data: { ...baseProperty, slug: TEST_SLUG, title: "Test Pricing Villa KAN-114", price: 1250000 },
    });

    await prisma.propertyPricing.create({ data: PRICING_CREATE });
  });

  afterAll(async () => {
    await prisma.propertyPricing.deleteMany({ where: { propertySlug: TEST_SLUG } });
    await prisma.property.deleteMany({ where: { slug: TEST_SLUG } });
  });

  // Test 1: Returns 200 with correct data shape
  it("returns 200 with correct data shape", async () => {
    const response = await GET(makeRequest(TEST_SLUG), makeContext(TEST_SLUG));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.error).toBeNull();
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty("propertySlug", TEST_SLUG);
    expect(body.data).toHaveProperty("additionalFees");
    expect(body.data).toHaveProperty("monthlyCosts");
    expect(body.data).toHaveProperty("totalInitialCosts");
    expect(body.data).toHaveProperty("createdAt");
    expect(body.data).toHaveProperty("updatedAt");
  });

  // Test 2: additionalFees values
  it("returns correct additionalFees values", async () => {
    const response = await GET(makeRequest(TEST_SLUG), makeContext(TEST_SLUG));
    const body = await response.json();

    const fees = body.data.additionalFees;
    expect(fees.propertyTransferTax).toBe(25000);
    expect(fees.legalFees).toBe(3000);
    expect(fees.homeInspection).toBe(500);
    expect(fees.propertyInsurance).toBe(1200);
    expect(fees.mortgageFees).toBe("Varies");
  });

  // Test 3: monthlyCosts values
  it("returns correct monthlyCosts values", async () => {
    const response = await GET(makeRequest(TEST_SLUG), makeContext(TEST_SLUG));
    const body = await response.json();

    const monthly = body.data.monthlyCosts;
    expect(monthly.propertyTaxesMonthly).toBe(1250);
    expect(monthly.hoaFeeMonthly).toBe(300);
  });

  // Test 4: totalInitialCosts values
  it("returns correct totalInitialCosts values", async () => {
    const response = await GET(makeRequest(TEST_SLUG), makeContext(TEST_SLUG));
    const body = await response.json();

    const total = body.data.totalInitialCosts;
    expect(total.downPayment).toBe(250000);
    expect(total.downPaymentPct).toBe(20);
    expect(total.mortgageAmount).toBe(1000000);
  });

  // Test 5: Returns 404 for unknown slug
  it("returns 404 for unknown slug", async () => {
    const response = await GET(makeRequest("non-existent-slug-xyz"), makeContext("non-existent-slug-xyz"));
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.data).toBeNull();
    expect(body.error).toBe("Pricing data not found");
  });

  // Test 6: success flag
  it("returns success=true on hit and success=false on miss", async () => {
    const hitResponse = await GET(makeRequest(TEST_SLUG), makeContext(TEST_SLUG));
    const hitBody = await hitResponse.json();
    expect(hitBody.success).toBe(true);

    const missResponse = await GET(makeRequest("no-such-slug"), makeContext("no-such-slug"));
    const missBody = await missResponse.json();
    expect(missBody.success).toBe(false);
  });
});
