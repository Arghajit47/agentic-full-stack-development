import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ServicesPageContent } from "@/components/sections/Services";

const mockServices = [
  {
    heading: "Unlock Property Value",
    subheading: "Selling your property should be a rewarding experience.",
    categories: [
      { title: "Valuation Mastery", description: "Discover the true worth of your property.", icon: "TrendingUp" },
      { title: "Strategic Marketing", description: "Selling a property requires a strategic marketing approach.", icon: "Megaphone" },
      { title: "Negotiation Wizardry", description: "Negotiating the best deal is an art.", icon: "Handshake" },
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
];

const mockData = {
  intro: {
    heading: "Elevate Your Real Estate Experience",
    subheading: "Welcome to Estatein, where your real estate aspirations meet expert guidance.",
  },
  quickLinks: [
    { title: "Find Your Dream Home", href: "/properties", icon: "Home" },
    { title: "Unlock Property Value", href: "#property-selling", icon: "KeyRound" },
    { title: "Effortless Property Management", href: "#property-management", icon: "Building2" },
    { title: "Smart Investments, Informed Decisions", href: "#investment-advisory", icon: "TrendingUp" },
  ],
  services: mockServices,
  bottomCta: {
    heading: "Start Your Real Estate Journey Today",
    body: "Your dream property is just a click away.",
    href: "/properties",
    buttonText: "Explore Properties",
  },
};

afterEach(() => {
  cleanup();
});

describe("Services section", () => {
  it("renders both property selling and property management services", () => {
    render(<ServicesPageContent data={mockData} />);
    expect(screen.getByTestId("services-property-selling-section")).toBeInTheDocument();
    expect(screen.getByTestId("services-property-management-section")).toBeInTheDocument();
  });

  it("renders all category cards for property selling service", () => {
    render(<ServicesPageContent data={mockData} />);
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
    render(<ServicesPageContent data={mockData} />);
    expect(screen.getByTestId("services-property-management-card-tenant-harmony")).toHaveTextContent(
      "Tenant Harmony"
    );
    expect(screen.getByTestId("services-property-management-card-maintenance-ease")).toHaveTextContent(
      "Maintenance Ease"
    );
    expect(
      screen.getByTestId("services-property-management-card-financial-peace-of-mind")
    ).toHaveTextContent("Financial Peace of Mind");
    expect(screen.getByTestId("services-property-management-card-legal-guardian")).toHaveTextContent(
      "Legal Guardian"
    );
  });

  it("renders headings, subheadings, and button text", () => {
    render(<ServicesPageContent data={mockData} />);
    expect(screen.getByTestId("services-property-selling-heading")).toHaveTextContent("Unlock Property Value");
    expect(screen.getByTestId("services-property-management-heading")).toHaveTextContent(
      "Effortless Property Management"
    );
    expect(screen.getByTestId("services-property-selling-subheading")).toHaveTextContent(
      "Selling your property should be a rewarding experience"
    );
    expect(screen.getByTestId("services-property-management-subheading")).toHaveTextContent(
      "Owning a property should be a pleasure, not a hassle"
    );
    expect(screen.getByTestId("services-property-selling-cta-button")).toHaveTextContent("Learn More");
    expect(screen.getByTestId("services-property-management-cta-button")).toHaveTextContent("Learn More");
  });

  it("category cards and CTA buttons are keyboard-focusable and point to correct hrefs", () => {
    render(<ServicesPageContent data={mockData} />);
    const sellingCta = screen.getByTestId("services-property-selling-cta-button");
    const managementCta = screen.getByTestId("services-property-management-cta-button");

    expect(sellingCta).toHaveAttribute("href", "#services/property-selling");
    expect(managementCta).toHaveAttribute("href", "#services/property-management");
  });

  it("renders loading skeleton", () => {
    render(<ServicesPageContent isLoading />);
    expect(screen.getAllByTestId("services-skeleton")[0]).toBeInTheDocument();
  });

  it("renders error banner with retry", () => {
    const retry = vi.fn();
    render(<ServicesPageContent error={new Error("boom")} retry={retry} />);
    expect(screen.getByTestId("services-error")).toHaveTextContent("boom");
    expect(screen.getByTestId("services-error-retry")).toBeInTheDocument();
  });

  it("renders empty fallback when no services", () => {
    render(<ServicesPageContent data={{ ...mockData, services: [] }} />);
    expect(screen.getByTestId("services-empty")).toBeInTheDocument();
  });

  it("falls back to defaults when data is missing", () => {
    render(<ServicesPageContent />);
    expect(screen.getByTestId("services-intro-heading")).toHaveTextContent(
      "Elevate Your Real Estate Experience"
    );
    expect(screen.getByTestId("services-quick-link-find-your-dream-home")).toHaveAttribute(
      "href",
      "/properties"
    );
    expect(screen.getByTestId("services-bottom-cta-button")).toHaveTextContent("Explore Properties");
  });
});
