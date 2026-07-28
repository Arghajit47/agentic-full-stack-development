import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── GET /api/properties/[slug]/pricing ───────────────────────────────────────
// Fetch pricing breakdown for a property by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { slug },
      select: { id: true, slug: true, title: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Fetch pricing data
    const pricing = await prisma.propertyPricing.findUnique({
      where: { propertySlug: slug },
    });

    if (!pricing) {
      return NextResponse.json(
        { error: "Pricing data not found for this property" },
        { status: 404 }
      );
    }

    // Build response with breakdown
    const response = {
      propertySlug: pricing.propertySlug,
      breakdown: {
        listing: {
          amount: pricing.listingPrice,
          label: "Listing Price",
        },
        fees: {
          platformFee: {
            amount: pricing.platformFee,
            label: "Platform Service Fee",
          },
          processingFee: {
            amount: pricing.processingFee,
            label: "Transaction Processing Fee",
          },
        },
        costs: {
          inspectionCost: {
            amount: pricing.inspectionCost,
            label: "Property Inspection",
          },
          legalFee: {
            amount: pricing.legalFee,
            label: "Legal Documentation",
          },
          insuranceCost: {
            amount: pricing.insuranceCost,
            label: "Insurance Cost",
          },
        },
      },
      totalPrice: pricing.totalPrice,
      createdAt: pricing.createdAt,
      updatedAt: pricing.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/properties/[slug]/pricing] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
