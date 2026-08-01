import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PricingBreakdown, PricingBreakdownData } from "../PricingBreakdown";

const mockPricingData: PricingBreakdownData = {
  propertySlug: "test-property",
  additionalFees: {
    propertyTransferTax: 25000,
    legalFees: 3000,
    homeInspection: 500,
    propertyInsurance: 1200,
    mortgageFees: "Varies",
  },
  monthlyCosts: {
    propertyTaxesMonthly: 1250,
    hoaFeeMonthly: 300,
  },
  totalInitialCosts: {
    downPayment: 250000,
    downPaymentPct: 20,
    mortgageAmount: 1000000,
  },
};

describe("PricingBreakdown", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render the component", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-breakdown")).toBeInTheDocument();
  });

  it("should display the Additional Fees card", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-additional-fees")).toBeInTheDocument();
    expect(screen.getByText("Additional Fees")).toBeInTheDocument();
  });

  it("should display the Monthly Costs card", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-monthly-costs")).toBeInTheDocument();
    expect(screen.getByText("Monthly Costs")).toBeInTheDocument();
  });

  it("should display the Total Initial Investment card", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-total-initial-costs")).toBeInTheDocument();
    expect(screen.getByText("Total Initial Investment")).toBeInTheDocument();
  });

  it("should display propertyTransferTax correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Property Transfer Tax")).toBeInTheDocument();
    expect(screen.getByText("$25,000")).toBeInTheDocument();
  });

  it("should display legalFees correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("$3,000")).toBeInTheDocument();
  });

  it("should display homeInspection correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Home Inspection")).toBeInTheDocument();
    expect(screen.getByText("$500")).toBeInTheDocument();
  });

  it("should display propertyInsurance correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Property Insurance")).toBeInTheDocument();
    expect(screen.getByText("$1,200")).toBeInTheDocument();
  });

  it("should display mortgageFees as string 'Varies'", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Varies")).toBeInTheDocument();
  });

  it("should display propertyTaxesMonthly correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Property Taxes (Monthly)")).toBeInTheDocument();
    expect(screen.getByText("$1,250")).toBeInTheDocument();
  });

  it("should display hoaFeeMonthly correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("HOA Fees (Monthly)")).toBeInTheDocument();
    expect(screen.getByText("$300")).toBeInTheDocument();
  });

  it("should display downPayment with percentage correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText(/Down Payment/)).toBeInTheDocument();
    expect(screen.getByText("$250,000")).toBeInTheDocument();
  });

  it("should display mortgageAmount correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Mortgage Amount")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000")).toBeInTheDocument();
  });

  it("should apply custom className when provided", () => {
    const customClass = "custom-test-class";
    render(<PricingBreakdown data={mockPricingData} className={customClass} />);
    const container = screen.getByTestId("pricing-breakdown");
    expect(container).toHaveClass(customClass);
  });
});
