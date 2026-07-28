import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseJsonArray } from "@/lib/json-helpers";

// ─── GET /api/properties/[slug] ───────────────────────────────────────────────
// Fetch a single property by slug with full details including gallery images
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

    const property = await prisma.property.findUnique({
      where: { slug },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Transform JSON text fields to arrays
    const response = {
      ...property,
      galleryUrls: parseJsonArray(property.galleryUrls),
      features: parseJsonArray(property.features),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/properties/[slug]] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
