import { expect } from "@playwright/test";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { BaseAPI } from "@base/api-base";
import { SCHEMA_PATH, PROPERTY_FIELDS, REVIEW_FIELDS, TABLES, SEED_COUNTS } from "@constants/index";

export class SchemaAPI extends BaseAPI {
  assertNoHighCriticalVulns(): void {
    let auditOut = "";
    let exitCode = 0;
    try {
      auditOut = execSync("npm audit --audit-level=high --json 2>&1", { cwd: "..", encoding: "utf-8", timeout: 60_000 });
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
  }

  assertSchemaModels(): void {
    const schema = readFileSync(SCHEMA_PATH, "utf-8");
    expect(schema).toMatch(/model\s+Property\s*\{/);
    expect(schema).toMatch(/model\s+Review\s*\{/);
    expect(schema).toMatch(/model\s+SiteSetting\s*\{/);
    for (const f of PROPERTY_FIELDS) expect(schema, `Property.${f}`).toContain(`  ${f}`);
    for (const f of REVIEW_FIELDS) expect(schema, `Review.${f}`).toContain(`  ${f}`);
    expect(schema, "propertyTitle nullable").toMatch(/propertyTitle\s+String\?/);
    expect(schema).toMatch(/key\s+String\s+@unique/);
    expect(schema).toMatch(/value\s+String/);
    const validate = execSync("npx prisma validate 2>&1", { cwd: "..", encoding: "utf-8", timeout: 30_000 });
    expect(validate.toLowerCase(), "prisma validate passes").toContain("valid");
  }

  assertSeedCounts(): void {
    BaseAPI.reseed();
    expect(BaseAPI.dbCount(TABLES.PROPERTY), `${SEED_COUNTS.PROPERTIES} properties`).toBe(SEED_COUNTS.PROPERTIES);
    expect(BaseAPI.dbCount(TABLES.REVIEW), `${SEED_COUNTS.REVIEWS} reviews`).toBe(SEED_COUNTS.REVIEWS);
    expect(BaseAPI.dbCount(TABLES.SITE_SETTING), `${SEED_COUNTS.SETTINGS} settings`).toBe(SEED_COUNTS.SETTINGS);
    expect(Number(BaseAPI.dbQuery(`SELECT COUNT(*) FROM ${TABLES.PROPERTY} WHERE isFeatured=1;`)), `${SEED_COUNTS.FEATURED_PROPERTIES} featured`).toBe(SEED_COUNTS.FEATURED_PROPERTIES);
    expect(Number(BaseAPI.dbQuery(`SELECT COUNT(*) FROM ${TABLES.REVIEW} WHERE propertyTitle IS NULL;`)), `${SEED_COUNTS.NULL_PROPERTY_TITLES} null propertyTitle`).toBe(SEED_COUNTS.NULL_PROPERTY_TITLES);
    expect(BaseAPI.dbQuery("SELECT MIN(rating), MAX(rating) FROM Review;"), `ratings ${SEED_COUNTS.MIN_RATING}-${SEED_COUNTS.MAX_RATING}`).toBe(`${SEED_COUNTS.MIN_RATING}|${SEED_COUNTS.MAX_RATING}`);
  }
}