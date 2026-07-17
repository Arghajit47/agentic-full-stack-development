import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { featuredProperties } from "@/mocks/featured-properties";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock responsive hook to return 3 cards (desktop)
vi.mock("react", async (importActual) => {
  const actual = await importActual<typeof import("react")>();
  return {
    ...actual,
    useState: actual.useState,
    // Override the effect-based responsive hook by mocking window
  };
});

// Set window width for desktop (3 cards)
beforeAll(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1920 });
});

afterEach(cleanup);

describe("FeaturedProperties", () => {
  it("renders the heading 'Featured Properties'", () => {
    render(<FeaturedProperties />);
    expect(screen.getByTestId("featured-properties-heading")).toHaveTextContent("Featured Properties");
  });

  it("heading is left-aligned", () => {
    render(<FeaturedProperties />);
    const heading = screen.getByTestId("featured-properties-heading");
    expect(heading.parentElement?.className).toContain("text-left");
  });

  it("renders the subheading", () => {
    render(<FeaturedProperties />);
    expect(screen.getByTestId("featured-properties-subheading")).toBeInTheDocument();
  });

  it("renders 3 visible property cards at 1920px (not 6)", () => {
    render(<FeaturedProperties />);
    const cards = screen.getAllByTestId(/property-card/);
    expect(cards).toHaveLength(3);
  });

  it("renders left and right navigation arrows", () => {
    render(<FeaturedProperties />);
    expect(screen.getByTestId("prev-arrow")).toBeInTheDocument();
    expect(screen.getByTestId("next-arrow")).toBeInTheDocument();
  });

  it("left arrow is disabled on first page", () => {
    render(<FeaturedProperties />);
    expect(screen.getByTestId("prev-arrow")).toBeDisabled();
  });

  it("right arrow is enabled when more data exists", () => {
    render(<FeaturedProperties />);
    expect(screen.getByTestId("next-arrow")).not.toBeDisabled();
  });

  it("renders property image in each card", () => {
    render(<FeaturedProperties />);
    const images = screen.getAllByRole("img", { name: /Modern|Downtown|Beachfront/i });
    expect(images).toHaveLength(3);
  });

  it("renders property title in each card", () => {
    render(<FeaturedProperties />);
    featuredProperties.slice(0, 3).forEach((p) => {
      expect(screen.getByTestId(`property-title-${p.id}`)).toHaveTextContent(p.title);
    });
  });

  it("renders property description in each card", () => {
    render(<FeaturedProperties />);
    featuredProperties.slice(0, 3).forEach((p) => {
      expect(screen.getByTestId(`property-description-${p.id}`)).toHaveTextContent(p.description);
    });
  });

  it("renders specs row with bedrooms, bathrooms, and property type (not area)", () => {
    render(<FeaturedProperties />);
    const firstCard = screen.getByTestId(`property-specs-${featuredProperties[0].id}`);
    expect(firstCard).toHaveTextContent(`${featuredProperties[0].bedrooms} bedrooms`);
    expect(firstCard).toHaveTextContent(`${featuredProperties[0].bathrooms} bathrooms`);
    expect(firstCard).toHaveTextContent(featuredProperties[0].propertyType);
    expect(firstCard).not.toHaveTextContent("sqft");
    expect(firstCard).not.toHaveTextContent("area");
  });

  it("renders 'Price' label above price value", () => {
    render(<FeaturedProperties />);
    const priceLabel = screen.getByTestId(`price-label-${featuredProperties[0].id}`);
    expect(priceLabel).toHaveTextContent("Price");
  });

  it("renders formatted price value", () => {
    render(<FeaturedProperties />);
    const priceSection = screen.getByTestId(`property-price-${featuredProperties[0].id}`);
    expect(priceSection).toHaveTextContent("$1,250,000");
  });

  it("renders 'View property details' button in each card", () => {
    render(<FeaturedProperties />);
    featuredProperties.slice(0, 3).forEach((p) => {
      expect(screen.getByTestId(`view-details-${p.id}`)).toHaveTextContent("View property details");
    });
  });

  it("renders 'Explore Properties' CTA below section", () => {
    render(<FeaturedProperties />);
    expect(screen.getByTestId("explore-properties-cta")).toHaveTextContent("Explore Properties");
  });

  it("renders skeleton loading state", () => {
    render(<FeaturedProperties isLoading={true} />);
    expect(screen.getAllByTestId(/skeleton|property-skeleton/)).toHaveLength(3);
  });

  it("renders empty state when data is empty", () => {
    render(<FeaturedProperties data={[]} />);
    expect(screen.getByTestId("no-properties")).toHaveTextContent("No properties found");
  });

  it("cards have no visible border/ring (blended with bg)", () => {
    render(<FeaturedProperties />);
    const cards = screen.getAllByTestId(/property-card/);
    cards.forEach((card) => {
      expect(card.className).not.toContain("ring");
      expect(card.className).not.toContain("border");
      expect(card.className).not.toContain("shadow");
    });
  });

  it("section has dark background", () => {
    render(<FeaturedProperties />);
    const section = screen.getByTestId("featured-properties-section");
    expect(section.className).toContain("bg-zinc-950");
  });
});