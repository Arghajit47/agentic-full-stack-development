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
    // "Additional Fees" appears as both the card heading and a cell label in Card 3
    expect(screen.getAllByText("Additional Fees").length).toBeGreaterThanOrEqual(1);
  });

  it("should display the Monthly Costs card", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-monthly-costs")).toBeInTheDocument();
    expect(screen.getByText("Monthly Costs")).toBeInTheDocument();
  });

  it("should display the Total Initial Costs card", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-total-initial-costs")).toBeInTheDocument();
    expect(screen.getByText("Total Initial Costs")).toBeInTheDocument();
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
    // "Property Insurance" appears in Card 1 row and Card 4 cell label
    expect(screen.getAllByText("Property Insurance").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("$1,200")).toBeInTheDocument();
  });

  it("should display mortgageFees as string 'Varies'", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const variesEls = screen.getAllByText("Varies");
    expect(variesEls.length).toBeGreaterThanOrEqual(1);
  });

  it("should display propertyTaxesMonthly correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    // $1,250 appears in both Card 2 (Monthly Costs) and Card 4 (Monthly Expenses)
    expect(screen.getAllByText("$1,250").length).toBeGreaterThanOrEqual(1);
  });

  it("should display hoaFeeMonthly correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    // $300 appears in both Card 2 (Monthly Costs) and Card 4 (Monthly Expenses)
    expect(screen.getAllByText("$300").length).toBeGreaterThanOrEqual(1);
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

  it("should render the Note card", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-note-card")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
  });

  it("should render the Monthly Expenses card with correct heading", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-monthly-expenses")).toBeInTheDocument();
    expect(screen.getByText("Monthly Expenses")).toBeInTheDocument();
  });

  it("should render pricing-listing-price when listingPrice prop is provided", () => {
    render(<PricingBreakdown data={mockPricingData} listingPrice={1350000} />);
    expect(screen.getByTestId("pricing-listing-price")).toBeInTheDocument();
    // $1,350,000 appears in both the left panel and Card 3's Listing Price cell
    expect(screen.getAllByText("$1,350,000").length).toBeGreaterThanOrEqual(1);
  });

  it("should not render pricing-listing-price when listingPrice prop is not provided", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.queryByTestId("pricing-listing-price")).not.toBeInTheDocument();
  });
});
