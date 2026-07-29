import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkRateLimit, hashIp, getClientIp } from "@/lib/rate-limit";
import { propertyContactSubmissionSchema } from "@/lib/schemas";

export { propertyContactSubmissionSchema };
export type ContactPropertyRequest = import("@/lib/schemas").PropertyContactSubmissionInput;

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
    const parsed = propertyContactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const propertySlug = data.propertySlug;
    const name = "name" in data ? data.name : `${data.firstName} ${data.lastName}`;

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
        firstName: "firstName" in data ? data.firstName : null,
        lastName: "lastName" in data ? data.lastName : null,
        email: data.email,
        phone: data.phone,
        preferredLocation: "preferredLocation" in data ? data.preferredLocation : null,
        propertyType: "propertyType" in data ? data.propertyType : null,
        bedrooms: "bedrooms" in data ? data.bedrooms : null,
        bathrooms: "bathrooms" in data ? data.bathrooms : null,
        budget: "budget" in data ? data.budget : null,
        message: data.message,
        agreeToTerms: "agreeToTerms" in data ? data.agreeToTerms : false,
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
