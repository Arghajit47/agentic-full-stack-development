import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ClientCard } from "@/components/about-us/ClientCard";
import type { ClientTestimonial } from "@/lib/types/our-clients";

const mockClient: ClientTestimonial = {
  since: "Since 2018",
  company: "GreenTech Enterprises",
  domain: "Commercial Real Estate",
  category: "Retail Space",
  quote:
    "Estatein's ability to identify prime retail locations helped us expand our brand presence.",
  websiteUrl: "https://example.com",
};

afterEach(() => {
  cleanup();
});

describe("ClientCard", () => {
  it("renders all client information correctly", () => {
    render(<ClientCard client={mockClient} />);

    expect(screen.getByTestId("client-since")).toHaveTextContent("Since 2018");
    expect(screen.getByTestId("client-company")).toHaveTextContent("GreenTech Enterprises");
    expect(screen.getByTestId("client-domain")).toHaveTextContent("Commercial Real Estate");
    expect(screen.getByTestId("client-category")).toHaveTextContent("Retail Space");
    expect(screen.getByTestId("client-quote")).toHaveTextContent(
      "Estatein's ability to identify prime retail locations helped us expand our brand presence.",
    );
  });

  it("renders Visit Website button with correct aria-label", () => {
    render(<ClientCard client={mockClient} />);

    const button = screen.getByTestId("client-website-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Visit GreenTech Enterprises website");
    expect(button).toHaveAttribute("href", "https://example.com");
    expect(button).toHaveTextContent("Visit Website");
  });

  it("renders with correct card testid based on company name", () => {
    render(<ClientCard client={mockClient} />);
    expect(screen.getByTestId("client-card-greentech-enterprises")).toBeInTheDocument();
  });

  it("renders meta section with divider", () => {
    render(<ClientCard client={mockClient} />);
    const meta = screen.getByTestId("client-meta");
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveClass("border-t");
  });

  it("applies correct styling classes", () => {
    render(<ClientCard client={mockClient} />);
    const card = screen.getByTestId("client-card-greentech-enterprises");
    expect(card).toHaveClass("rounded-xl", "bg-[#1a1a1a]", "border", "border-[#262626]");
  });
});
