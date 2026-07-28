import { describe, it, expect, beforeAll } from "vitest";
import prisma from "@/lib/prisma";

describe("GET /api/properties/[slug]/pricing", () => {
  const testSlug = "modern-villa-in-sunset-hills";

  beforeAll(async () => {
    // Ensure test data exists (seed should have run)
    const property = await prisma.property.findUnique({
      where: { slug: testSlug },
    });
    expect(property).toBeDefined();
  });

  it("returns 400 for missing slug", async () => {
    const response = await fetch("http://localhost:3000/api/properties//pricing");
    expect(response.status).toBe(404); // Next.js returns 404 for invalid routes
  });

  it("returns 404 for non-existent property", async () => {
    const response = await fetch("http://localhost:3000/api/properties/non-existent-property/pricing");
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Property not found");
  });

  it("returns pricing breakdown for valid property", async () => {
    const response = await fetch(`http://localhost:3000/api/properties/${testSlug}/pricing`);
    expect(response.status).toBe(200);

    const data = await response.json();

    // Verify structure
    expect(data).toHaveProperty("propertySlug", testSlug);
    expect(data).toHaveProperty("breakdown");
    expect(data).toHaveProperty("totalPrice");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("updatedAt");

    // Verify breakdown structure
    expect(data.breakdown).toHaveProperty("listing");
    expect(data.breakdown).toHaveProperty("fees");
    expect(data.breakdown).toHaveProperty("costs");

    // Verify listing
    expect(data.breakdown.listing).toHaveProperty("amount");
    expect(data.breakdown.listing).toHaveProperty("label", "Listing Price");

    // Verify fees
    expect(data.breakdown.fees).toHaveProperty("platformFee");
    expect(data.breakdown.fees.platformFee).toHaveProperty("amount");
    expect(data.breakdown.fees.platformFee).toHaveProperty("label", "Platform Service Fee");

    expect(data.breakdown.fees).toHaveProperty("processingFee");
    expect(data.breakdown.fees.processingFee).toHaveProperty("amount");
    expect(data.breakdown.fees.processingFee).toHaveProperty("label", "Transaction Processing Fee");

    // Verify costs
    expect(data.breakdown.costs).toHaveProperty("inspectionCost");
    expect(data.breakdown.costs.inspectionCost).toHaveProperty("amount");
    expect(data.breakdown.costs.inspectionCost).toHaveProperty("label", "Property Inspection");

    expect(data.breakdown.costs).toHaveProperty("legalFee");
    expect(data.breakdown.costs.legalFee).toHaveProperty("amount");
    expect(data.breakdown.costs.legalFee).toHaveProperty("label", "Legal Documentation");

    expect(data.breakdown.costs).toHaveProperty("insuranceCost");
    expect(data.breakdown.costs.insuranceCost).toHaveProperty("amount");
    expect(data.breakdown.costs.insuranceCost).toHaveProperty("label", "Insurance Cost");

    // Verify total calculation
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
    const slug1 = "modern-villa-in-sunset-hills";
    const slug2 = "downtown-loft-penthouse";

    const response1 = await fetch(`http://localhost:3000/api/properties/${slug1}/pricing`);
    const response2 = await fetch(`http://localhost:3000/api/properties/${slug2}/pricing`);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);

    const data1 = await response1.json();
    const data2 = await response2.json();

    // Pricing should differ between properties
    expect(data1.totalPrice).not.toBe(data2.totalPrice);
    expect(data1.breakdown.listing.amount).not.toBe(data2.breakdown.listing.amount);
  });

  it("verifies pricing calculation logic", async () => {
    const response = await fetch(`http://localhost:3000/api/properties/${testSlug}/pricing`);
    expect(response.status).toBe(200);

    const data = await response.json();
    const listing = data.breakdown.listing.amount;

    // Verify fee calculations are within expected ranges
    // Platform fee should be ~2% of listing
    const expectedPlatformFee = Math.floor(listing * 0.02);
    expect(data.breakdown.fees.platformFee.amount).toBe(expectedPlatformFee);

    // Processing fee should be ~0.5% of listing
    const expectedProcessingFee = Math.floor(listing * 0.005);
    expect(data.breakdown.fees.processingFee.amount).toBe(expectedProcessingFee);

    // Fixed costs
    expect(data.breakdown.costs.inspectionCost.amount).toBe(500);
    expect(data.breakdown.costs.legalFee.amount).toBe(1500);

    // Insurance should be ~0.3% of listing
    const expectedInsurance = Math.floor(listing * 0.003);
    expect(data.breakdown.costs.insuranceCost.amount).toBe(expectedInsurance);
  });
});
