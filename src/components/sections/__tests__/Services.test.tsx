import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Services } from "@/components/sections/Services";

afterEach(() => {
  cleanup();
});

describe("Services section", () => {
  it("renders both property selling and property management services", () => {
    render(<Services />);
    expect(screen.getByTestId("services-property-selling-section")).toBeInTheDocument();
    expect(screen.getByTestId("services-property-management-section")).toBeInTheDocument();
  });

  it("renders all category cards for property selling service", () => {
    render(<Services />);
    expect(screen.getByTestId("services-property-selling-card-valuation-mastery")).toHaveTextContent(
      "Valuation Mastery"
    );
    expect(screen.getByTestId("services-property-selling-card-strategic-marketing")).toHaveTextContent(
      "Strategic Marketing"
    );
    expect(screen.getByTestId("services-property-selling-card-negotiation-wizardry")).toHaveTextContent(
      "Negotiation Wizardry"
    );
    expect(screen.getByTestId("services-property-selling-card-closing-success")).toHaveTextContent(
      "Closing Success"
    );
  });

  it("renders all category cards for property management service", () => {
    render(<Services />);
    expect(screen.getByTestId("services-property-management-card-tenant-harmony")).toHaveTextContent(
      "Tenant Harmony"
    );
    expect(screen.getByTestId("services-property-management-card-maintenance-ease")).toHaveTextContent(
      "Maintenance Ease"
    );
    expect(screen.getByTestId("services-property-management-card-financial-transparency")).toHaveTextContent(
      "Financial Transparency"
    );
    expect(screen.getByTestId("services-property-management-card-legal-compliance")).toHaveTextContent(
      "Legal Compliance"
    );
  });

  it("renders headings, subheadings, and button text", () => {
    render(<Services />);
    expect(screen.getByTestId("services-property-selling-heading")).toHaveTextContent("Unlock Property Value");
    expect(screen.getByTestId("services-property-management-heading")).toHaveTextContent(
      "Effortless Property Management"
    );
    expect(screen.getByTestId("services-property-selling-subheading")).toHaveTextContent(
      "Selling your property should be a rewarding experience"
    );
    expect(screen.getByTestId("services-property-management-subheading")).toHaveTextContent(
      "Owning a property should be a pleasure"
    );
    expect(screen.getByTestId("services-property-selling-cta-button")).toHaveTextContent("Learn More");
    expect(screen.getByTestId("services-property-management-cta-button")).toHaveTextContent("Learn More");
  });

  it("category cards and CTA buttons are keyboard-focusable and point to correct hrefs", () => {
    render(<Services />);
    const sellingCta = screen.getByTestId("services-property-selling-cta-button");
    const managementCta = screen.getByTestId("services-property-management-cta-button");

    expect(sellingCta).toHaveAttribute("href", "#services/property-selling");
    expect(managementCta).toHaveAttribute("href", "#services/property-management");

    const sellingCard = screen.getByTestId("services-property-selling-card-valuation-mastery");
    const managementCard = screen.getByTestId("services-property-management-card-tenant-harmony");

    expect(sellingCard).toHaveAttribute("href", "#services/property-selling");
    expect(managementCard).toHaveAttribute("href", "#services/property-management");
    expect(sellingCard.tagName).toBe("A");
    expect(managementCard.tagName).toBe("A");
  });
});
