import { describe, it, expect, beforeEach } from "vitest";
import { POST, contactPropertySchema } from "./route";
import prisma from "@/lib/prisma";
import { resetRateLimitStore } from "@/lib/rate-limit";

describe("POST /api/contact/property", () => {
  beforeEach(async () => {
    // Clean up contact submissions before each test
    await prisma.contactSubmission.deleteMany();
    // Reset rate limit store before each test
    resetRateLimitStore();
  });

  // ─── Valid request tests ─────────────────────────────────────────────────────
  it("should create a contact submission with valid data", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-1234",
      message: "I'm interested in this property and would like more information.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Contact submission received successfully");
    expect(data.submissionId).toBeDefined();

    // Verify in database
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: data.submissionId },
    });

    expect(submission).toBeDefined();
    expect(submission?.name).toBe(requestBody.name);
    expect(submission?.email).toBe(requestBody.email);
    expect(submission?.phone).toBe(requestBody.phone);
    expect(submission?.message).toBe(requestBody.message);
    expect(submission?.propertySlug).toBeNull();
  });

  it("should create a contact submission with propertySlug", async () => {
    // Create a property first
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

    const requestBody = {
      propertySlug: property.slug,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-5678",
      message: "I would like to schedule a viewing for this villa.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);

    // Verify in database
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: data.submissionId },
    });

    expect(submission?.propertySlug).toBe(property.slug);
  });

  // ─── Validation tests ────────────────────────────────────────────────────────
  it("should return 400 for missing required fields", async () => {
    const requestBody = {
      name: "John Doe",
      // missing email, phone, message
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details).toBeDefined();
  });

  it("should return 400 for invalid email format", async () => {
    const requestBody = {
      name: "John Doe",
      email: "not-an-email",
      phone: "+1-555-1234",
      message: "This is a test message with more than ten characters.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request data");
    expect(data.details.email).toBeDefined();
  });

  it("should return 400 for phone number that's too short", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      phone: "123",
      message: "This is a test message with more than ten characters.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.phone).toBeDefined();
  });

  it("should return 400 for phone number with invalid characters", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-ABCD",
      message: "This is a test message with more than ten characters.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.phone).toBeDefined();
  });

  it("should return 400 for message that's too short", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "Too short",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.message).toBeDefined();
  });

  it("should return 400 for name that's too long", async () => {
    const requestBody = {
      name: "A".repeat(101), // 101 characters
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a test message with more than ten characters.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details.name).toBeDefined();
  });

  // ─── Property validation tests ───────────────────────────────────────────────
  it("should return 404 for non-existent propertySlug", async () => {
    const requestBody = {
      propertySlug: "non-existent-slug",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a test message with more than ten characters.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Property not found");
    expect(data.slug).toBe("non-existent-slug");
  });

  // ─── Rate limiting tests ─────────────────────────────────────────────────────
  it("should enforce rate limit of 5 requests per minute", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a test message with more than ten characters.",
    };

    // Make 5 requests (should all succeed)
    for (let i = 0; i < 5; i++) {
      const request = new Request("http://localhost:3000/api/contact/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.1",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(201);
    }

    // 6th request should be rate limited
    const sixthRequest = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.1",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(sixthRequest as any);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBe("Rate limit exceeded");
    expect(data.message).toContain("Too many contact submissions");
    expect(data.resetAt).toBeDefined();

    // Check rate limit headers
    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
  });

  it("should track rate limits per IP address", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a test message with more than ten characters.",
    };

    // Make 5 requests from IP 1
    for (let i = 0; i < 5; i++) {
      const request = new Request("http://localhost:3000/api/contact/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.1",
        },
        body: JSON.stringify(requestBody),
      });
      await POST(request as any);
    }

    // Request from IP 2 should succeed (different IP)
    const requestFromIp2 = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.2",
      },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(requestFromIp2 as any);
    expect(response.status).toBe(201);
  });

  // ─── Rate limit headers test ─────────────────────────────────────────────────
  it("should include rate limit headers in successful responses", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a test message with more than ten characters.",
    };

    const request = new Request("http://localhost:3000/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request as any);

    expect(response.status).toBe(201);
    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("4");
    expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
  });
});

// ─── Schema validation tests (unit tests for Zod schema) ─────────────────────
describe("contactPropertySchema", () => {
  it("should validate a complete valid request", () => {
    const validData = {
      propertySlug: "test-property",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a valid message with sufficient length.",
    };

    const result = contactPropertySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate request without propertySlug", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-1234",
      message: "This is a valid message with sufficient length.",
    };

    const result = contactPropertySchema.safeParse(validData);
    expect(result.success).toBe(true);
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
      const data = {
        name: "John Doe",
        email: "john@example.com",
        phone,
        message: "This is a valid message with sufficient length.",
      };

      const result = contactPropertySchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid phone formats", () => {
    const invalidPhones = ["phone", "123-ABC-4567", "test@example.com"];

    invalidPhones.forEach((phone) => {
      const data = {
        name: "John Doe",
        email: "john@example.com",
        phone,
        message: "This is a valid message with sufficient length.",
      };

      const result = contactPropertySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
