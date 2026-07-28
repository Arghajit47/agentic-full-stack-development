import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const offices = await prisma.office.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: offices,
    });
  } catch (error) {
    console.error("[GET /api/offices] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch offices",
        data: null,
      },
      { status: 500 }
    );
  }
}
