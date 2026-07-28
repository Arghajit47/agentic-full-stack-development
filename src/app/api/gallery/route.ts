import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const galleryImages = await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: galleryImages,
    });
  } catch (error) {
    console.error("[GET /api/gallery] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery images",
        data: null,
      },
      { status: 500 }
    );
  }
}
