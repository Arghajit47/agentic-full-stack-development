import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ServicesPage from "@/app/services/page";

afterEach(() => {
  cleanup();
});

describe("/services page", () => {
  it("renders page intro heading and subheading", () => {
    render(<ServicesPage />);
    expect(screen.getByTestId("services-intro-heading")).toHaveTextContent(
      "Elevate Your Real Estate Experience"
    );
    expect(screen.getByTestId("services-intro-subheading")).toHaveTextContent(
      "Welcome to Estatein"
    );
  });

  it("renders all quick-link cards with correct hrefs", () => {
    render(<ServicesPage />);
    expect(screen.getByTestId("services-quick-link-find-your-dream-home")).toHaveAttribute(
      "href",
      "/properties"
    );
    expect(screen.getByTestId("services-quick-link-unlock-property-value")).toHaveAttribute(
      "href",
      "#property-selling"
    );
    expect(screen.getByTestId("services-quick-link-effortless-property-management")).toHaveAttribute(
      "href",
      "#property-management"
    );
    expect(screen.getByTestId("services-quick-link-smart-investments-informed-decisions")).toHaveAttribute(
      "href",
      "#investment-advisory"
    );
  });

  it("renders all three service section headings", () => {
    render(<ServicesPage />);
    expect(screen.getByTestId("services-property-selling-heading")).toHaveTextContent(
      "Unlock Property Value"
    );
    expect(screen.getByTestId("services-property-management-heading")).toHaveTextContent(
      "Effortless Property Management"
    );
    expect(screen.getByTestId("services-investment-advisory-heading")).toHaveTextContent(
      "Smart Investments, Informed Decisions"
    );
  });

  it("renders all 12 category cards with correct titles and descriptions", () => {
    render(<ServicesPage />);

    // Property Selling
    expect(screen.getByTestId("services-property-selling-card-valuation-mastery")).toHaveTextContent(
      "Valuation Mastery"
    );
    expect(
      screen.getByTestId("services-property-selling-card-strategic-marketing")
    ).toHaveTextContent("Strategic Marketing");
    expect(
      screen.getByTestId("services-property-selling-card-negotiation-wizardry")
    ).toHaveTextContent("Negotiation Wizardry");
    expect(screen.getByTestId("services-property-selling-card-closing-success")).toHaveTextContent(
      "Closing Success"
    );

    // Property Management
    expect(screen.getByTestId("services-property-management-card-tenant-harmony")).toHaveTextContent(
      "Tenant Harmony"
    );
    expect(
      screen.getByTestId("services-property-management-card-maintenance-ease")
    ).toHaveTextContent("Maintenance Ease");
    expect(
      screen.getByTestId("services-property-management-card-financial-peace-of-mind")
    ).toHaveTextContent("Financial Peace of Mind");
    expect(screen.getByTestId("services-property-management-card-legal-guardian")).toHaveTextContent(
      "Legal Guardian"
    );

    // Investment Advisory
    expect(screen.getByTestId("services-investment-advisory-card-market-insight")).toHaveTextContent(
      "Market Insight"
    );
    expect(screen.getByTestId("services-investment-advisory-card-roi-assessment")).toHaveTextContent(
      "ROI Assessment"
    );
    expect(
      screen.getByTestId("services-investment-advisory-card-customized-strategies")
    ).toHaveTextContent("Customized Strategies");
    expect(
      screen.getByTestId("services-investment-advisory-card-diversification-mastery")
    ).toHaveTextContent("Diversification Mastery");
  });

  it("renders all service CTA banners and buttons with correct text and hrefs", () => {
    render(<ServicesPage />);

    expect(screen.getByTestId("services-property-selling-cta-button")).toHaveTextContent(
      "Learn More"
    );
    expect(screen.getByTestId("services-property-selling-cta-button")).toHaveAttribute(
      "href",
      "#services/property-selling"
    );

    expect(screen.getByTestId("services-property-management-cta-button")).toHaveTextContent(
      "Learn More"
    );
    expect(screen.getByTestId("services-property-management-cta-button")).toHaveAttribute(
      "href",
      "#services/property-management"
    );

    expect(screen.getByTestId("services-investment-advisory-left-cta-button")).toHaveTextContent(
      "Learn More"
    );
    expect(screen.getByTestId("services-investment-advisory-left-cta-button")).toHaveAttribute(
      "href",
      "#services/investment-advisory"
    );
  });

  it("renders bottom page CTA with correct heading and href", () => {
    render(<ServicesPage />);
    expect(screen.getByTestId("services-bottom-cta-heading")).toHaveTextContent(
      "Start Your Real Estate Journey Today"
    );
    expect(screen.getByTestId("services-bottom-cta-button")).toHaveTextContent(
      "Explore Properties"
    );
    expect(screen.getByTestId("services-bottom-cta-button")).toHaveAttribute("href", "/properties");
  });

  it("ensures category cards and CTA buttons are focusable anchor elements", () => {
    render(<ServicesPage />);
    const card = screen.getByTestId("services-property-selling-card-valuation-mastery");
    const button = screen.getByTestId("services-bottom-cta-button");

    expect(card.tagName).toBe("A");
    expect(button.tagName).toBe("A");
    expect(card).toHaveAttribute("href");
    expect(button).toHaveAttribute("href");
  });
});
