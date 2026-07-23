import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { GET as getNavigation } from "@/app/api/navigation/route";
import { GET as getFooter } from "@/app/api/footer/route";
import { POST as postNewsletter, resetRateLimitStore } from "@/app/api/newsletter/route";
import prisma from "@/lib/prisma";

async function getJson(res: Response) {
  return res.json();
}

function newsletterRequest(email: string, ip = "127.0.0.1"): NextRequest {
  return new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
  });
}

describe("Navigation & Footer API (KAN-13)", () => {
  beforeEach(async () => {
    await prisma.navigationLink.deleteMany();
    await prisma.footerSection.deleteMany();
    await prisma.newsletterSubscriber.deleteMany();
    resetRateLimitStore();

    const links = [
      { label: "Home", href: "/", order: 1, isExternal: false },
      { label: "About Us", href: "/about", order: 2, isExternal: false },
      { label: "Properties", href: "/properties", order: 3, isExternal: false },
      { label: "Services", href: "/services", order: 4, isExternal: false },
    ];
    for (const link of links) {
      await prisma.navigationLink.create({ data: link });
    }

    const footerSections = [
      {
        key: "cta",
        title: "Start Your Real Estate Journey Today",
        body: "Your dream property is just a click away.",
        ctaText: "Explore Properties",
        ctaHref: "/properties",
      },
      {
        key: "newsletter",
        placeholder: "Enter Your Email",
      },
      {
        key: "bottom",
        copyright: "©2024 Estatein. All Rights Reserved.",
        legalText: "Terms & Conditions",
      },
    ];
    for (const section of footerSections) {
      await prisma.footerSection.create({ data: section });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/navigation", () => {
    it("returns 200 with success true and navigation data", async () => {
      const res = await getNavigation();
      expect(res.status).toBe(200);
      const body = await getJson(res);
      expect(body.success).toBe(true);
      expect(body.data.links).toHaveLength(4);
      expect(body.data.links[0].label).toBe("Home");
      expect(body.data.links[3].href).toBe("/services");
    });

    it("falls back to a default banner when site setting is missing", async () => {
      const res = await getNavigation();
      const body = await getJson(res);
      expect(body.data.banner.text).toContain("Discover Your Dream Property");
    });
  });

  describe("GET /api/footer", () => {
    it("returns 200 with footer sections keyed by section key", async () => {
      const res = await getFooter();
      expect(res.status).toBe(200);
      const body = await getJson(res);
      expect(body.success).toBe(true);
      expect(body.data.cta.title).toBe("Start Your Real Estate Journey Today");
      expect(body.data.newsletter.placeholder).toBe("Enter Your Email");
      expect(body.data.bottom.copyright).toContain("©2024");
    });
  });

  describe("POST /api/newsletter", () => {
    it("subscribes a valid email and returns 201", async () => {
      const res = await postNewsletter(newsletterRequest("test@example.com"));
      expect(res.status).toBe(201);
      const body = await getJson(res);
      expect(body.success).toBe(true);
      expect(body.data.email).toBe("test@example.com");
    });

    it("returns 400 for invalid email", async () => {
      const res = await postNewsletter(newsletterRequest("not-an-email"));
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body.success).toBe(false);
      expect(body.error).toBeTruthy();
      expect(body.data).toBeNull();
    });

    it("returns 400 for missing JSON body", async () => {
      const req = new NextRequest("http://localhost/api/newsletter", {
        method: "POST",
        body: "not-json",
        headers: { "Content-Type": "application/json" },
      });
      const res = await postNewsletter(req);
      expect(res.status).toBe(400);
      const body = await getJson(res);
      expect(body.success).toBe(false);
    });

    it("rate limits after 5 submissions from the same IP", async () => {
      const emailPrefix = "rate-limit@example.com";
      for (let i = 0; i < 5; i += 1) {
        const res = await postNewsletter(newsletterRequest(`${i}${emailPrefix}`, "1.2.3.4"));
        expect(res.status).toBe(201);
      }
      const blocked = await postNewsletter(newsletterRequest(`blocked${emailPrefix}`, "1.2.3.4"));
      expect(blocked.status).toBe(429);
      const body = await getJson(blocked);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/Rate limit/i);
    });

    it("does not rate limit a different IP", async () => {
      for (let i = 0; i < 5; i += 1) {
        const res = await postNewsletter(newsletterRequest(`${i}other@example.com`, "5.6.7.8"));
        expect(res.status).toBe(201);
      }
      const res = await postNewsletter(newsletterRequest("other-ok@example.com", "9.10.11.12"));
      expect(res.status).toBe(201);
    });
  });
});
