import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PricingBreakdown, PricingBreakdownData } from "../PricingBreakdown";

const mockPricingData: PricingBreakdownData = {
  propertySlug: "test-property",
  breakdown: {
    listing: {
      amount: 1250000,
      label: "Listing Price",
    },
    fees: {
      platformFee: {
        amount: 25000,
        label: "Platform Service Fee",
      },
      processingFee: {
        amount: 15000,
        label: "Transaction Processing Fee",
      },
    },
    costs: {
      inspectionCost: {
        amount: 5000,
        label: "Property Inspection",
      },
      legalFee: {
        amount: 10000,
        label: "Legal Documentation",
      },
      insuranceCost: {
        amount: 8000,
        label: "Insurance Cost",
      },
    },
  },
  totalPrice: 1313000,
};

describe("PricingBreakdown", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render the component", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-breakdown")).toBeInTheDocument();
  });

  it("should display the heading", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByTestId("pricing-heading")).toHaveTextContent("Pricing Breakdown");
  });

  it("should display the listing price with correct formatting", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const listingElement = screen.getByTestId("pricing-listing");
    expect(listingElement).toHaveTextContent("Listing Price");
    expect(listingElement).toHaveTextContent("$1,250,000");
  });

  it("should display platform fee correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const platformFeeElement = screen.getByTestId("pricing-platform-fee");
    expect(platformFeeElement).toHaveTextContent("Platform Service Fee");
    expect(platformFeeElement).toHaveTextContent("$25,000");
  });

  it("should display processing fee correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const processingFeeElement = screen.getByTestId("pricing-processing-fee");
    expect(processingFeeElement).toHaveTextContent("Transaction Processing Fee");
    expect(processingFeeElement).toHaveTextContent("$15,000");
  });

  it("should display inspection cost correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const inspectionElement = screen.getByTestId("pricing-inspection-cost");
    expect(inspectionElement).toHaveTextContent("Property Inspection");
    expect(inspectionElement).toHaveTextContent("$5,000");
  });

  it("should display legal fee correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const legalFeeElement = screen.getByTestId("pricing-legal-fee");
    expect(legalFeeElement).toHaveTextContent("Legal Documentation");
    expect(legalFeeElement).toHaveTextContent("$10,000");
  });

  it("should display insurance cost correctly", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const insuranceElement = screen.getByTestId("pricing-insurance-cost");
    expect(insuranceElement).toHaveTextContent("Insurance Cost");
    expect(insuranceElement).toHaveTextContent("$8,000");
  });

  it("should display total price with correct formatting and styling", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const totalElement = screen.getByTestId("pricing-total");
    expect(totalElement).toHaveTextContent("Total Price");
    expect(totalElement).toHaveTextContent("$1,313,000");
  });

  it("should apply custom className when provided", () => {
    const customClass = "custom-test-class";
    render(<PricingBreakdown data={mockPricingData} className={customClass} />);
    const container = screen.getByTestId("pricing-breakdown");
    expect(container).toHaveClass(customClass);
  });

  it("should handle zero values correctly", () => {
    const zeroData: PricingBreakdownData = {
      propertySlug: "test",
      breakdown: {
        listing: { amount: 0, label: "Listing Price" },
        fees: {
          platformFee: { amount: 0, label: "Platform Service Fee" },
          processingFee: { amount: 0, label: "Transaction Processing Fee" },
        },
        costs: {
          inspectionCost: { amount: 0, label: "Property Inspection" },
          legalFee: { amount: 0, label: "Legal Documentation" },
          insuranceCost: { amount: 0, label: "Insurance Cost" },
        },
      },
      totalPrice: 0,
    };

    render(<PricingBreakdown data={zeroData} />);
    expect(screen.getByTestId("pricing-total")).toHaveTextContent("$0");
  });

  it("should display section headings", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    expect(screen.getByText("Fees")).toBeInTheDocument();
    expect(screen.getByText("Additional Costs")).toBeInTheDocument();
  });

  it("should have proper ARIA structure", () => {
    render(<PricingBreakdown data={mockPricingData} />);
    const heading = screen.getByRole("heading", { name: /pricing breakdown/i });
    expect(heading).toBeInTheDocument();
  });

  it("should render all pricing items in correct order", () => {
    render(<PricingBreakdown data={mockPricingData} />);

    const allText = screen.getByTestId("pricing-breakdown").textContent || "";

    // Check that items appear in the expected order
    const listingIndex = allText.indexOf("Listing Price");
    const feesIndex = allText.indexOf("Fees");
    const platformIndex = allText.indexOf("Platform Service Fee");
    const costsIndex = allText.indexOf("Additional Costs");
    const totalIndex = allText.indexOf("Total Price");

    expect(listingIndex).toBeLessThan(feesIndex);
    expect(feesIndex).toBeLessThan(platformIndex);
    expect(platformIndex).toBeLessThan(costsIndex);
    expect(costsIndex).toBeLessThan(totalIndex);
  });
});
