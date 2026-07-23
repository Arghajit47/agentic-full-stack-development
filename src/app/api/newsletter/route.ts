import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, getClientIp, hashIp, resetRateLimitStore } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/schemas";

export { resetRateLimitStore };

const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body", data: null },
        { status: 400 },
      );
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json(
        { success: false, error: message, data: null },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const ipHash = hashIp(ip);
    const limit = checkRateLimit(ipHash, MAX_REQUESTS, WINDOW_MS);

    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Try again later.", data: null },
        { status: 429 },
      );
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { ipHash },
      create: { email: parsed.data.email, ipHash },
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: subscriber.id, email: subscriber.email },
        message: "Subscribed successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/newsletter] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
