import { describe, it, expect } from "vitest";
import { formatCurrency, formatNumber, calculatePercentage } from "@/lib/utils";

describe("utils", () => {
  describe("formatCurrency", () => {
    it("should format currency with default options (USD, no decimals)", () => {
      expect(formatCurrency(1250000)).toBe("$1,250,000");
      expect(formatCurrency(500)).toBe("$500");
      expect(formatCurrency(0)).toBe("$0");
    });

    it("should format currency with decimals when specified", () => {
      expect(
        formatCurrency(1250000, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      ).toBe("$1,250,000.00");
    });

    it("should handle large numbers", () => {
      expect(formatCurrency(10000000)).toBe("$10,000,000");
      expect(formatCurrency(999999999)).toBe("$999,999,999");
    });

    it("should handle small numbers", () => {
      expect(formatCurrency(1)).toBe("$1");
      expect(formatCurrency(99)).toBe("$99");
    });

    it("should format negative numbers", () => {
      expect(formatCurrency(-1000)).toBe("-$1,000");
    });

    it("should support different locales", () => {
      const amount = 1250000;
      const eurFormatted = formatCurrency(amount, {
        locale: "de-DE",
        currency: "EUR",
      });
      // German locale uses different formatting
      expect(eurFormatted).toContain("€");
    });

    it("should support different currencies", () => {
      expect(formatCurrency(1000, { currency: "EUR" })).toContain("€");
      expect(formatCurrency(1000, { currency: "GBP" })).toContain("£");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
      expect(formatNumber(123456789)).toBe("123,456,789");
    });

    it("should handle small numbers", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(1)).toBe("1");
      expect(formatNumber(99)).toBe("99");
      expect(formatNumber(999)).toBe("999");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-1000)).toBe("-1,000");
      expect(formatNumber(-999999)).toBe("-999,999");
    });

    it("should handle decimal numbers", () => {
      expect(formatNumber(1234.56)).toBe("1,234.56");
    });
  });

  describe("calculatePercentage", () => {
    it("should calculate percentage correctly", () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 4)).toBe(25);
    });

    it("should handle zero total", () => {
      expect(calculatePercentage(100, 0)).toBe(0);
    });

    it("should handle zero value", () => {
      expect(calculatePercentage(0, 100)).toBe(0);
    });

    it("should handle decimals", () => {
      expect(calculatePercentage(33, 100)).toBe(33);
      expect(calculatePercentage(1, 3)).toBeCloseTo(33.33, 2);
    });

    it("should handle percentages over 100", () => {
      expect(calculatePercentage(150, 100)).toBe(150);
    });
  });
});
