import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { checkRateLimit, hashIp, getClientIp } from "@/lib/rate-limit";

// ─── Request body validation schema (KAN-30 AC) ───────────────────────────────
// AC: propertySlug (optional), name, email, phone, message (all required except slug)
export const contactPropertySchema = z.object({
  propertySlug: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(20, "Phone too long")
    .regex(/^[0-9+\-() ]+$/, "Phone contains invalid characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message too long"),
});

export type ContactPropertyRequest = z.infer<typeof contactPropertySchema>;

// ─── POST /api/contact/property ───────────────────────────────────────────────
// AC: Rate limit 5 requests per minute per IP (KAN-30)
export async function POST(request: NextRequest) {
  try {
    // ─── Rate limiting: 5 req/min ──────────────────────────────────────────
    const clientIp = getClientIp(request);
    const ipKey = hashIp(clientIp);
    const rateLimit = checkRateLimit(ipKey, 5, 60_000); // 5 requests per 60 seconds

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many contact submissions. Please try again later.",
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.resetAt),
          },
        }
      );
    }

    // ─── Parse and validate request body ───────────────────────────────────
    const body = await request.json();
    const parsed = contactPropertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { propertySlug, name, email, phone, message } = parsed.data;

    // ─── Verify propertySlug exists if provided ────────────────────────────
    if (propertySlug) {
      const propertyExists = await prisma.property.findUnique({
        where: { slug: propertySlug },
        select: { id: true },
      });

      if (!propertyExists) {
        return NextResponse.json(
          { error: "Property not found", slug: propertySlug },
          { status: 404 }
        );
      }
    }

    // ─── Create contact submission ─────────────────────────────────────────
    const submission = await prisma.contactSubmission.create({
      data: {
        propertySlug,
        name,
        email,
        phone,
        message,
        ipHash: ipKey,
      },
    });

    // ─── Return success response ───────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: "Contact submission received successfully",
        submissionId: submission.id,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetAt),
        },
      }
    );
  } catch (error) {
    console.error("[POST /api/contact/property] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
