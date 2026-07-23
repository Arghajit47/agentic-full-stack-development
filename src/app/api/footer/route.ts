import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.footerSection.findMany();
    const data: Record<string, Record<string, string | null>> = {};
    for (const section of sections) {
      data[section.key] = {
        title: section.title,
        body: section.body,
        ctaText: section.ctaText,
        ctaHref: section.ctaHref,
        placeholder: section.placeholder,
        copyright: section.copyright,
        legalText: section.legalText,
      };
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/footer] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer", data: null },
      { status: 500 },
    );
  }
}
