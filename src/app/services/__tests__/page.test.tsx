import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ServicesPageContent } from "@/components/sections/Services";

afterEach(() => {
  cleanup();
});

const mockServicesData = {
  intro: {
    heading: "API Services Heading",
    subheading: "API services subheading text.",
  },
  quickLinks: [
    { title: "Find Your Dream Home", href: "/properties", icon: "Home" },
    { title: "Unlock Property Value", href: "#property-selling", icon: "KeyRound" },
    { title: "Effortless Property Management", href: "#property-management", icon: "Building2" },
    { title: "Smart Investments, Informed Decisions", href: "#investment-advisory", icon: "TrendingUp" },
  ],
  services: [
    {
      heading: "Unlock Property Value",
      subheading: "Selling your property should be a rewarding experience.",
      categories: [
        { title: "Valuation Mastery", description: "Discover the true worth of your property.", icon: "TrendingUp" },
        { title: "Strategic Marketing", description: "Strategic marketing approach.", icon: "Megaphone" },
        { title: "Negotiation Wizardry", description: "Negotiating the best deal.", icon: "Handshake" },
        { title: "Closing Success", description: "A successful sale is not complete until the closing.", icon: "CheckCircle" },
      ],
      ctaHeading: "Unlock the Value of Your Property Today",
      ctaBody: "Ready to unlock the true value of your property?",
      ctaHref: "#services/property-selling",
      ctaText: "Learn More",
    },
    {
      heading: "Effortless Property Management",
      subheading: "Owning a property should be a pleasure, not a hassle.",
      categories: [
        { title: "Tenant Harmony", description: "Our Tenant Management services ensure smooth tenants.", icon: "Users" },
        { title: "Maintenance Ease", description: "Say goodbye to property maintenance headaches.", icon: "Wrench" },
        { title: "Financial Peace of Mind", description: "Managing property finances can be complex.", icon: "Wallet" },
        { title: "Legal Guardian", description: "Stay compliant with property laws.", icon: "Scale" },
      ],
      ctaHeading: "Experience Effortless Property Management",
      ctaBody: "Ready to experience hassle-free property management?",
      ctaHref: "#services/property-management",
      ctaText: "Learn More",
    },
    {
      heading: "Smart Investments, Informed Decisions",
      subheading: "Building a real estate portfolio requires a strategic approach.",
      categories: [
        { title: "Market Insight", description: "Stay ahead of market trends.", icon: "BarChart3" },
        { title: "ROI Assessment", description: "Make investment decisions with confidence.", icon: "PieChart" },
        { title: "Customized Strategies", description: "Every investor is unique.", icon: "Target" },
        { title: "Diversification Mastery", description: "Diversify your real estate portfolio.", icon: "Globe" },
      ],
      ctaHeading: "Unlock Your Investment Potential",
      ctaBody: "Explore our Investment Advisory categories.",
      ctaHref: "#services/investment-advisory",
      ctaText: "Learn More",
    },
  ],
  bottomCta: {
    heading: "API Bottom CTA Heading",
    body: "API bottom CTA body text.",
    href: "/properties",
    buttonText: "Explore Properties",
  },
};

describe("ServicesPageContent with data", () => {
  it("renders intro, quick links, services and bottom CTA from API data", () => {
    render(<ServicesPageContent data={mockServicesData} isLoading={false} error={null} />);

    expect(screen.getByTestId("services-intro-heading")).toHaveTextContent("API Services Heading");
    expect(screen.getByTestId("services-intro-subheading")).toHaveTextContent("API services subheading text.");

    expect(screen.getByTestId("services-quick-link-find-your-dream-home")).toHaveAttribute("href", "/properties");
    expect(screen.getByTestId("services-quick-link-unlock-property-value")).toHaveAttribute("href", "#property-selling");

    expect(screen.getByTestId("services-property-selling-heading")).toHaveTextContent("Unlock Property Value");
    expect(screen.getByTestId("services-property-management-heading")).toHaveTextContent("Effortless Property Management");
    expect(screen.getByTestId("services-investment-advisory-heading")).toHaveTextContent("Smart Investments, Informed Decisions");

    expect(screen.getByTestId("services-property-selling-card-valuation-mastery")).toHaveTextContent("Valuation Mastery");
    expect(screen.getByTestId("services-investment-advisory-card-market-insight")).toHaveTextContent("Market Insight");

    expect(screen.getByTestId("services-bottom-cta-heading")).toHaveTextContent("API Bottom CTA Heading");
    expect(screen.getByTestId("services-bottom-cta-button")).toHaveAttribute("href", "/properties");
  });

  it("renders loading skeletons when isLoading is true", () => {
    render(<ServicesPageContent data={null} isLoading={true} error={null} />);
    expect(screen.getAllByTestId("services-skeleton")[0]).toBeInTheDocument();
  });

  it("renders error state with retry button", () => {
    const retry = vi.fn();
    const err = new Error("network failure");
    render(<ServicesPageContent data={null} isLoading={false} error={err} retry={retry} />);

    expect(screen.getByTestId("services-error")).toHaveTextContent("network failure");
    const retryButton = screen.getByTestId("services-error-retry");
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("renders empty state when data is null", () => {
    render(<ServicesPageContent data={null} isLoading={false} error={null} />);
    expect(screen.getByTestId("services-empty")).toHaveTextContent("No services content available.");
  });

  it("falls back to defaults for missing partial data", () => {
    render(<ServicesPageContent data={{ intro: mockServicesData.intro, quickLinks: [], services: [], bottomCta: mockServicesData.bottomCta }} isLoading={false} error={null} />);

    expect(screen.getByTestId("services-intro-heading")).toHaveTextContent("API Services Heading");
    expect(screen.getByTestId("services-property-selling-heading")).toHaveTextContent("Unlock Property Value");
    expect(screen.getByTestId("services-bottom-cta-heading")).toHaveTextContent("API Bottom CTA Heading");
  });
});
