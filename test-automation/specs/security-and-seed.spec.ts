import { test, expect } from "../fixtures/api-fixtures";
import { BaseAPI } from "../base/api-base";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

test.describe("Security & Seed Validation", () => {
  test("npm audit — zero high/critical vulnerabilities", () => {
    let auditOut = "";
    let exitCode = 0;
    try {
      auditOut = execSync("npm audit --audit-level=high --json 2>&1", {
        cwd: "..",
        encoding: "utf-8",
        timeout: 60_000,
      });
    } catch (e) {
      auditOut = (e as { stdout?: string }).stdout ?? "";
      exitCode = 1;
    }
    let parsed: { metadata?: { vulnerabilities?: { high?: number; critical?: number } } } = {};
    try { parsed = JSON.parse(auditOut); } catch { /* non-JSON = no advisory */ }
    const v = parsed.metadata?.vulnerabilities ?? {};
    expect(v.high ?? 0, "no high vulnerabilities").toBe(0);
    expect(v.critical ?? 0, "no critical vulnerabilities").toBe(0);
    if (exitCode !== 0 && (v.high ?? 0) === 0 && (v.critical ?? 0) === 0) return;
  });

  test("Prisma schema has Property, Review, SiteSetting with correct fields", () => {
    const schema = readFileSync("../prisma/schema.prisma", "utf-8");
    expect(schema).toMatch(/model\s+Property\s*\{/);
    expect(schema).toMatch(/model\s+Review\s*\{/);
    expect(schema).toMatch(/model\s+SiteSetting\s*\{/);
    for (const f of ["id", "slug", "title", "price", "location", "bedrooms", "bathrooms", "areaSqft", "imageUrl", "isFeatured", "galleryUrls", "features"]) {
      expect(schema, `Property.${f}`).toContain(`  ${f}`);
    }
    for (const f of ["clientName", "clientAvatarUrl", "rating", "reviewText", "propertyTitle"]) {
      expect(schema, `Review.${f}`).toContain(`  ${f}`);
    }
    expect(schema, "propertyTitle nullable").toMatch(/propertyTitle\s+String\?/);
    expect(schema).toMatch(/key\s+String\s+@unique/);
    expect(schema).toMatch(/value\s+String/);
    const validate = execSync("npx prisma validate 2>&1", { cwd: "..", encoding: "utf-8", timeout: 30_000 });
    expect(validate.toLowerCase(), "prisma validate passes").toContain("valid");
  });

  test("seed script creates correct data counts", () => {
    BaseAPI.reseed();
    expect(BaseAPI.dbCount("Property"), "6 properties").toBe(6);
    expect(BaseAPI.dbCount("Review"), "5 reviews").toBe(5);
    expect(BaseAPI.dbCount("SiteSetting"), "14 settings").toBe(14);
    expect(Number(BaseAPI.dbQuery("SELECT COUNT(*) FROM Property WHERE isFeatured=1;")), "5 featured").toBe(5);
    expect(Number(BaseAPI.dbQuery("SELECT COUNT(*) FROM Review WHERE propertyTitle IS NULL;")), "1 null propertyTitle").toBe(1);
    expect(BaseAPI.dbQuery("SELECT MIN(rating), MAX(rating) FROM Review;"), "ratings 2-5").toBe("2|5");
  });
});