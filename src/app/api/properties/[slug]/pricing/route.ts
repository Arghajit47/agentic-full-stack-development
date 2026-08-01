import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── GET /api/properties/[slug]/pricing ───────────────────────────────────────
// Fetch comprehensive pricing breakdown for a property by slug
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const pricing = await prisma.propertyPricing.findUnique({
      where: { propertySlug: slug },
    });

    if (!pricing) {
      return NextResponse.json(
        { success: false, data: null, error: "Pricing data not found" },
        { status: 404 }
      );
    }

    const data = {
      propertySlug: pricing.propertySlug,
      additionalFees: {
        propertyTransferTax: pricing.propertyTransferTax,
        legalFees: pricing.legalFees,
        homeInspection: pricing.homeInspection,
        propertyInsurance: pricing.propertyInsurance,
        mortgageFees: pricing.mortgageFees,
      },
      monthlyCosts: {
        propertyTaxesMonthly: pricing.propertyTaxesMonthly,
        hoaFeeMonthly: pricing.hoaFeeMonthly,
      },
      totalInitialCosts: {
        downPayment: pricing.downPayment,
        downPaymentPct: pricing.downPaymentPct,
        mortgageAmount: pricing.mortgageAmount,
      },
      createdAt: pricing.createdAt,
      updatedAt: pricing.updatedAt,
    };

    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    console.error("[GET /api/properties/[slug]/pricing] Unhandled error:", error);
    return NextResponse.json(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
