import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, propertyContactSubmissionSchema } from "./route";
import prisma from "@/lib/prisma";
import { resetRateLimitStore } from "@/lib/rate-limit";

const fullRequestBody = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1-555-1234",
  preferredLocation: "Test City",
  propertyType: "Villa",
  bedrooms: "3",
  bathrooms: "2",
  budget: "$500,000",
  message: "I'm interested in this property and would like more information.",
  agreeToTerms: true,
};

const legacyRequestBody = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1-555-1234",
  message: "I'm interested in this property and would like more information.",
};

function makeRequest(body: object, headers?: Record<string, string>): NextRequest {
  return new Request("http://localhost:3000/api/contact/property", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/contact/property", () => {
  beforeEach(async () => {
    await prisma.contactSubmission.deleteMany();
    resetRateLimitStore();
  });

  // ─── Valid request tests ─────────────────────────────────────────────────────
  it("should create a contact submission with full data", async () => {
    const response = await POST(makeRequest(fullRequestBody));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Contact submission received successfully");
    expect(data.submissionId).toBeDefined();

    const submission = await prisma.contactSubmission.findUnique({
      where: { id: data.submissionId },
    });

    expect(submission).toBeDefined();
    expect(submission?.firstName).toBe(fullRequestBody.firstName);
    expect(submission?.lastName).toBe(fullRequestBody.lastName);
    expect(submission?.name).toBe(`${fullRequestBody.firstName} ${fullRequestBody.lastName}`);
    expect(submission?.email).toBe(fullRequestBody.email);
    expect(submission?.phone).toBe(fullRequestBody.phone);
    expect(submission?.preferredLocation).toBe(fullRequestBody.preferredLocation);
    expect(submission?.propertyType).toBe(fullRequestBody.propertyType);
    expect(submission?.bedrooms).toBe(fullRequestBody.bedrooms);
    expect(submission?.bathrooms).toBe(fullRequestBody.bathrooms);
    expect(submission?.budget).toBe(fullRequestBody.budget);
    expect(submission?.message).toBe(fullRequestBody.message);
    expect(submission?.agreeToTerms).toBe(true);
    expect(submission?.propertySlug).toBeNull();
  });

  it("should create a contact submission with legacy data and null firstName", async () => {
    const response = await POST(makeRequest(legacyRequestBody));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);

    const submission = await prisma.contactSubmission.findUnique({
      where: { id: data.submissionId },
    });

    expect(submission?.name).toBe(legacyRequestBody.name);
    expect(submission?.firstName).toBeNull();
    expect(submission?.lastName).toBeNull();
    expect(submission?.agreeToTerms).toBe(false);
  });

  it("should create a contact submission with propertySlug using legacy shape", async () => {
    const property = await prisma.property.create({
      data: {
        slug: "test-villa",
        title: "Test Villa",
        description: "A beautiful test villa",
        price: 500000,
        location: "Test City",
        bedrooms: 3,
        bathrooms: 2,
        areaSqft: 2000,
        propertyType: "Villa",
        imageUrl: "https://example.com/image.jpg",
        galleryUrls: JSON.stringify([]),
        features: JSON.stringify([]),
      },
    });

    const response = await POST(
      makeRequest({ ...legacyRequestBody, propertySlug: property.slug })
    );
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);

    const submission = await prisma.contactSubmission.findUnique({
      where: { id: data.submissionId },
    });

    expect(submission?.propertySlug).toBe(property.slug);
  });

  // ─── Validation tests ────────────────────────────────────────────────────────
  it("should return 400 for missing required fields", async () => {
    const response = await POST(makeRequest({ name: "John Doe" }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details).toBeDefined();
  });

  it("should return 400 for invalid email format", async () => {
    const response = await POST(
      makeRequest({ ...legacyRequestBody, email: "not-an-email" })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details.email).toBeDefined();
  });

  it("should return 400 for phone number that's too short", async () => {
    const response = await POST(
      makeRequest({ ...legacyRequestBody, phone: "123" })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.phone).toBeDefined();
  });

  it("should return 400 for phone number with invalid characters", async () => {
    const response = await POST(
      makeRequest({ ...legacyRequestBody, phone: "+1-555-ABCD" })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.phone).toBeDefined();
  });

  it("should return 400 for message that's too short", async () => {
    const response = await POST(
      makeRequest({ ...legacyRequestBody, message: "Too short" })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.message).toBeDefined();
  });

  it("should return 400 for name that's too long", async () => {
    const response = await POST(
      makeRequest({ ...legacyRequestBody, name: "A".repeat(101) })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.name).toBeDefined();
  });

  it("should return 400 for missing agreeToTerms in full shape", async () => {
    const bodyWithoutAgree = { ...fullRequestBody };
    delete (bodyWithoutAgree as { agreeToTerms?: boolean }).agreeToTerms;
    const response = await POST(makeRequest(bodyWithoutAgree));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details).toEqual(expect.any(Object));
  });

  it("should return 400 for missing firstName in full shape", async () => {
    const body = { ...fullRequestBody, agreeToTerms: true };
    delete (body as { firstName?: string }).firstName;
    const response = await POST(makeRequest(body));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details).toEqual(expect.any(Object));
  });

  // ─── Property validation tests ───────────────────────────────────────────────
  it("should return 404 for non-existent propertySlug", async () => {
    const response = await POST(
      makeRequest({
        propertySlug: "non-existent-slug",
        ...legacyRequestBody,
        message: "This is a test message with more than ten characters.",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Property not found");
    expect(data.slug).toBe("non-existent-slug");
  });

  // ─── Rate limiting tests ─────────────────────────────────────────────────────
  it("should enforce rate limit of 5 requests per minute", async () => {
    const requestBody = legacyRequestBody;

    for (let i = 0; i < 5; i++) {
      const response = await POST(
        makeRequest(requestBody, { "x-forwarded-for": "192.168.1.1" })
      );
      expect(response.status).toBe(201);
    }

    const response = await POST(
      makeRequest(requestBody, { "x-forwarded-for": "192.168.1.1" })
    );
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe("Rate limit exceeded");
    expect(data.message).toContain("Too many contact submissions");
    expect(data.resetAt).toBeDefined();

    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
  });

  it("should track rate limits per IP address", async () => {
    const requestBody = legacyRequestBody;

    for (let i = 0; i < 5; i++) {
      await POST(makeRequest(requestBody, { "x-forwarded-for": "192.168.1.1" }));
    }

    const response = await POST(
      makeRequest(requestBody, { "x-forwarded-for": "192.168.1.2" })
    );
    expect(response.status).toBe(201);
  });

  // ─── Rate limit headers test ─────────────────────────────────────────────────
  it("should include rate limit headers in successful responses", async () => {
    const response = await POST(makeRequest(legacyRequestBody));

    expect(response.status).toBe(201);
    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("4");
    expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
  });
});

// ─── Schema validation tests (unit tests for Zod schema) ─────────────────────
describe("propertyContactSubmissionSchema", () => {
  it("should validate a complete full request", () => {
    const result = propertyContactSubmissionSchema.safeParse(fullRequestBody);
    expect(result.success).toBe(true);
  });

  it("should validate a complete legacy request", () => {
    const result = propertyContactSubmissionSchema.safeParse({
      ...legacyRequestBody,
      propertySlug: "test-property",
    });
    expect(result.success).toBe(true);
  });

  it("should validate request without propertySlug", () => {
    const result = propertyContactSubmissionSchema.safeParse(legacyRequestBody);
    expect(result.success).toBe(true);
  });

  it("should reject missing agreeToTerms in full shape", () => {
    const bodyWithoutAgree = { ...fullRequestBody };
    delete (bodyWithoutAgree as { agreeToTerms?: boolean }).agreeToTerms;
    const result = propertyContactSubmissionSchema.safeParse(bodyWithoutAgree);
    expect(result.success).toBe(false);
  });

  it("should reject agreeToTerms false in full shape", () => {
    const result = propertyContactSubmissionSchema.safeParse({
      ...fullRequestBody,
      agreeToTerms: false,
    });
    expect(result.success).toBe(false);
  });

  it("should accept various phone number formats", () => {
    const phoneFormats = [
      "+1-555-1234",
      "+44 20 1234 5678",
      "(555) 123-4567",
      "555-123-4567",
      "5551234567",
    ];

    phoneFormats.forEach((phone) => {
      const result = propertyContactSubmissionSchema.safeParse({
        ...legacyRequestBody,
        phone,
      });
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid phone formats", () => {
    const invalidPhones = ["phone", "123-ABC-4567", "test@example.com"];

    invalidPhones.forEach((phone) => {
      const result = propertyContactSubmissionSchema.safeParse({
        ...legacyRequestBody,
        phone,
      });
      expect(result.success).toBe(false);
    });
  });
});
