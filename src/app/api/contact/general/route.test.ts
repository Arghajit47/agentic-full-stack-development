import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST, contactGeneralSchema } from "./route";
import { INQUIRY_TYPES } from "@/types/contact";
import prisma from "@/lib/prisma";
import { resetRateLimitStore } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

// ─── Mock helpers ─────────────────────────────────────────────────────────────
function mockRequest(body: unknown, ip = "127.0.0.1") {
  const headers = new Headers({ "x-forwarded-for": ip });
  return {
    json: vi.fn().mockResolvedValue(body),
    headers,
    nextUrl: new URL("http://localhost:3000/api/contact/general"),
    cookies: {},
  } as unknown as NextRequest;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("POST /api/contact/general", () => {
  beforeEach(async () => {
    resetRateLimitStore();
    await prisma.generalInquiry.deleteMany({});
  });

  afterEach(async () => {
    await prisma.generalInquiry.deleteMany({});
  });

  // ─── Zod Schema Validation Tests ────────────────────────────────────────────
  describe("Zod schema validation", () => {
    it("validates correct general inquiry data", () => {
      const validData = {
        inquiryType: "general",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        message: "I have a question about your services.",
      };

      const result = contactGeneralSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("validates all inquiry types", () => {
      INQUIRY_TYPES.forEach((type: string) => {
        const data = {
          inquiryType: type,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "5551234567",
          message: "Testing inquiry type validation.",
        };

        const result = contactGeneralSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("rejects invalid inquiry type", () => {
      const invalidData = {
        inquiryType: "invalid",
        name: "Test User",
        email: "test@example.com",
        phone: "5551234567",
        message: "This should fail.",
      };

      const result = contactGeneralSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["inquiryType"]);
      }
    });

    it("rejects missing required fields", () => {
      const missingFields = {};
      const result = contactGeneralSchema.safeParse(missingFields);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(5);
      }
    });

    it("rejects empty name", () => {
      const data = {
        inquiryType: "support",
        name: "",
        email: "user@example.com",
        phone: "5551234567",
        message: "Valid message here.",
      };

      const result = contactGeneralSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects invalid email format", () => {
      const data = {
        inquiryType: "partnership",
        name: "Partner Name",
        email: "not-an-email",
        phone: "5551234567",
        message: "Partnership inquiry.",
      };

      const result = contactGeneralSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["email"]);
      }
    });

    it("rejects phone with invalid characters", () => {
      const data = {
        inquiryType: "careers",
        name: "Job Seeker",
        email: "seeker@example.com",
        phone: "555-ABC-1234",
        message: "Interested in job opportunities.",
      };

      const result = contactGeneralSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["phone"]);
      }
    });

    it("rejects phone shorter than 10 digits", () => {
      const data = {
        inquiryType: "general",
        name: "Short Phone",
        email: "short@example.com",
        phone: "12345",
        message: "This phone is too short.",
      };

      const result = contactGeneralSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects message shorter than 10 characters", () => {
      const data = {
        inquiryType: "support",
        name: "User Name",
        email: "user@example.com",
        phone: "5551234567",
        message: "Short",
      };

      const result = contactGeneralSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["message"]);
      }
    });

    it("rejects message longer than 1000 characters", () => {
      const longMessage = "a".repeat(1001);
      const data = {
        inquiryType: "general",
        name: "Long Message User",
        email: "long@example.com",
        phone: "5551234567",
        message: longMessage,
      };

      const result = contactGeneralSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  // ─── API Route Tests ────────────────────────────────────────────────────────
  describe("API route functionality", () => {
    it("creates a general inquiry submission successfully", async () => {
      const validData = {
        inquiryType: "general",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1-555-987-6543",
        message: "I would like to know more about your services.",
      };

      const req = mockRequest(validData, "192.168.1.100");
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.message).toBe("General inquiry submitted successfully");
      expect(json.submissionId).toBeDefined();

      // Verify database record
      const inquiry = await prisma.generalInquiry.findUnique({
        where: { id: json.submissionId },
      });
      expect(inquiry).toBeDefined();
      expect(inquiry?.inquiryType).toBe("general");
      expect(inquiry?.name).toBe("Alice Johnson");
      expect(inquiry?.email).toBe("alice@example.com");
    });

    it("creates support inquiry successfully", async () => {
      const supportData = {
        inquiryType: "support",
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "5559876543",
        message: "I need help with my account setup.",
      };

      const req = mockRequest(supportData);
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);

      const inquiry = await prisma.generalInquiry.findUnique({
        where: { id: json.submissionId },
      });
      expect(inquiry?.inquiryType).toBe("support");
    });

    it("creates partnership inquiry successfully", async () => {
      const partnershipData = {
        inquiryType: "partnership",
        name: "Carol White",
        email: "carol@partner.com",
        phone: "5551112222",
        message: "We are interested in partnering with your company.",
      };

      const req = mockRequest(partnershipData);
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(201);
      const inquiry = await prisma.generalInquiry.findUnique({
        where: { id: json.submissionId },
      });
      expect(inquiry?.inquiryType).toBe("partnership");
    });

    it("creates careers inquiry successfully", async () => {
      const careersData = {
        inquiryType: "careers",
        name: "David Brown",
        email: "david@jobseeker.com",
        phone: "+1 555 333 4444",
        message: "I am interested in job opportunities at your company.",
      };

      const req = mockRequest(careersData);
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(201);
      const inquiry = await prisma.generalInquiry.findUnique({
        where: { id: json.submissionId },
      });
      expect(inquiry?.inquiryType).toBe("careers");
    });

    it("returns 400 for invalid inquiry type", async () => {
      const invalidData = {
        inquiryType: "invalid_type",
        name: "Test User",
        email: "test@example.com",
        phone: "5551234567",
        message: "This should fail validation.",
      };

      const req = mockRequest(invalidData);
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request data");
      expect(json.details).toBeDefined();
    });

    it("returns 400 for missing required fields", async () => {
      const incompleteData = {
        inquiryType: "general",
        name: "Incomplete User",
      };

      const req = mockRequest(incompleteData);
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe("Invalid request data");
    });

    it("stores IP hash in database", async () => {
      const validData = {
        inquiryType: "general",
        name: "IP Test User",
        email: "iptest@example.com",
        phone: "5551234567",
        message: "Testing IP hash storage.",
      };

      const req = mockRequest(validData, "203.0.113.45");
      const response = await POST(req);
      const json = await response.json();

      const inquiry = await prisma.generalInquiry.findUnique({
        where: { id: json.submissionId },
      });
      expect(inquiry?.ipHash).toBeDefined();
      expect(inquiry?.ipHash).not.toBe("");
    });
  });

  // ─── Rate Limiting Tests ────────────────────────────────────────────────────
  describe("Rate limiting", () => {
    it("allows 5 requests within the rate limit", async () => {
      const validData = {
        inquiryType: "general",
        name: "Rate Test User",
        email: "rate@example.com",
        phone: "5551234567",
        message: "Testing rate limit.",
      };

      const testIp = "192.168.100.50";

      for (let i = 0; i < 5; i++) {
        const req = mockRequest(validData, testIp);
        const response = await POST(req);
        expect(response.status).toBe(201);
      }
    });

    it("rejects 6th request with 429 status", async () => {
      const validData = {
        inquiryType: "support",
        name: "Limit Test User",
        email: "limit@example.com",
        phone: "5551234567",
        message: "Testing rate limit exceeded.",
      };

      const testIp = "192.168.100.60";

      // Make 5 successful requests
      for (let i = 0; i < 5; i++) {
        const req = mockRequest(validData, testIp);
        await POST(req);
      }

      // 6th request should be rate limited
      const req = mockRequest(validData, testIp);
      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(429);
      expect(json.error).toBe("Rate limit exceeded");
      expect(json.resetAt).toBeDefined();

      // Verify headers
      expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    });

    it("allows requests from different IPs independently", async () => {
      const validData = {
        inquiryType: "partnership",
        name: "Multi IP User",
        email: "multiip@example.com",
        phone: "5551234567",
        message: "Testing independent IP rate limits.",
      };

      // 5 requests from IP1
      for (let i = 0; i < 5; i++) {
        const req = mockRequest(validData, "10.0.0.1");
        const response = await POST(req);
        expect(response.status).toBe(201);
      }

      // 5 requests from IP2 should still work
      for (let i = 0; i < 5; i++) {
        const req = mockRequest(validData, "10.0.0.2");
        const response = await POST(req);
        expect(response.status).toBe(201);
      }
    });

    it("includes rate limit headers in success response", async () => {
      const validData = {
        inquiryType: "careers",
        name: "Header Test User",
        email: "header@example.com",
        phone: "5551234567",
        message: "Testing rate limit headers.",
      };

      const req = mockRequest(validData, "172.16.0.100");
      const response = await POST(req);

      expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("4");
      expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
    });
  });

  // ─── Edge Cases ─────────────────────────────────────────────────────────────
  describe("Edge cases", () => {
    it("handles malformed JSON gracefully", async () => {
      const headers = new Headers({ "x-forwarded-for": "127.0.0.1" });
      const req = {
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
        headers,
        nextUrl: new URL("http://localhost:3000/api/contact/general"),
        cookies: {},
      } as unknown as NextRequest;

      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.error).toBe("Internal server error");
    });

    it("accepts valid phone number with various formats", async () => {
      const phoneFormats = [
        "5551234567",
        "+1-555-123-4567",
        "(555) 123-4567",
        "+1 (555) 123-4567",
        "555-123-4567",
      ];

      for (const phone of phoneFormats) {
        const data = {
          inquiryType: "general",
          name: "Phone Format Test",
          email: "phone@example.com",
          phone,
          message: "Testing phone format validation.",
        };

        const req = mockRequest(data, `192.168.1.${phoneFormats.indexOf(phone)}`);
        const response = await POST(req);
        expect(response.status).toBe(201);
      }
    });

    it("trims and validates email correctly", async () => {
      const validData = {
        inquiryType: "support",
        name: "Email Test User",
        email: "valid.email+tag@example.co.uk",
        phone: "5551234567",
        message: "Testing complex email validation.",
      };

      const req = mockRequest(validData);
      const response = await POST(req);
      expect(response.status).toBe(201);
    });
  });
});
