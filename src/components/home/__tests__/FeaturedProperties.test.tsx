import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { featuredProperties } from "@/mocks/featured-properties";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockUseFeaturedProperties = vi.fn((): {
  data: import("@/lib/api").FeaturedProperty[] | undefined;
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
} => ({
  data: undefined,
  isLoading: false,
  error: undefined,
  mutate: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  useFeaturedProperties: () => mockUseFeaturedProperties(),
}));

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
    render(<FeaturedProperties data={featuredProperties} />);
    const cards = screen.getAllByTestId(/property-card/);
    expect(cards).toHaveLength(3);
  });

  it("renders left and right navigation arrows", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    expect(screen.getByTestId("prev-arrow")).toBeInTheDocument();
    expect(screen.getByTestId("next-arrow")).toBeInTheDocument();
  });

  it("left arrow is disabled on first page", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    expect(screen.getByTestId("prev-arrow")).toBeDisabled();
  });

  it("right arrow is enabled when more data exists", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    expect(screen.getByTestId("next-arrow")).not.toBeDisabled();
  });

  it("renders property image in each card", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const images = screen.getAllByRole("img", { name: /Seawide|Metropolitan|Rustic/i });
    expect(images).toHaveLength(3);
  });

  it("renders property title in each card", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    featuredProperties.slice(0, 3).forEach((p) => {
      expect(screen.getByTestId(`property-title-${p.id}`)).toHaveTextContent(p.title);
    });
  });

  it("renders property description in each card", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    featuredProperties.slice(0, 3).forEach((p) => {
      expect(screen.getByTestId(`property-description-${p.id}`)).toHaveTextContent(p.description);
    });
  });

  it("renders specs row with bedrooms, bathrooms, and property type (not area)", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const firstCard = screen.getByTestId(`property-specs-${featuredProperties[0].id}`);
    expect(firstCard).toHaveTextContent(`${featuredProperties[0].bedrooms} bedrooms`);
    expect(firstCard).toHaveTextContent(`${featuredProperties[0].bathrooms} bathrooms`);
    expect(firstCard).toHaveTextContent(featuredProperties[0].propertyType);
    expect(firstCard).not.toHaveTextContent("sqft");
    expect(firstCard).not.toHaveTextContent("area");
  });

  it("renders 'Price' label above price value", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const priceLabel = screen.getByTestId(`price-label-${featuredProperties[0].id}`);
    expect(priceLabel).toHaveTextContent("Price");
  });

  it("renders formatted price value", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const priceSection = screen.getByTestId(`property-price-${featuredProperties[0].id}`);
    expect(priceSection).toHaveTextContent("$1,250,000");
  });

  it("renders 'View property details' button in each card", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    featuredProperties.slice(0, 3).forEach((p) => {
      expect(screen.getByTestId(`view-details-${p.id}`)).toHaveTextContent("View property details");
    });
  });

  it("renders 'View All Properties' CTA in header", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const cta = screen.getByTestId("view-all-properties-cta");
    expect(cta).toHaveTextContent("View All Properties");
    expect(cta).toHaveAttribute("href", "/properties");
  });

  it("does not render old 'Explore Properties' bottom CTA", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    expect(screen.queryByTestId("explore-properties-cta")).not.toBeInTheDocument();
  });

  it("renders navigation dots when there are multiple pages", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    // 6 properties, 3 visible = 2 pages → dots should render
    expect(screen.getByTestId("nav-dots")).toBeInTheDocument();
  });

  it("nav-dot-0 is active (bg-[#703BF7]) on first page", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const dot0 = screen.getByTestId("nav-dot-0");
    expect(dot0.className).toContain("bg-[#703BF7]");
  });

  it("nav-dot-1 is inactive (border border-[#383737]) on first page", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const dot1 = screen.getByTestId("nav-dot-1");
    expect(dot1.className).toContain("border-[#383737]");
  });

  it("renders mobile CTA below nav", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const mobileCta = screen.getByTestId("view-all-properties-mobile-cta");
    expect(mobileCta).toHaveTextContent("View All Properties");
    expect(mobileCta).toHaveAttribute("href", "/properties");
  });

  it("renders skeleton loading state", () => {
    render(<FeaturedProperties isLoading={true} />);
    expect(screen.getAllByTestId(/skeleton|property-skeleton/)).toHaveLength(3);
  });

  it("renders empty state when data is empty", () => {
    render(<FeaturedProperties data={[]} />);
    expect(screen.getByTestId("no-properties")).toHaveTextContent("No properties found");
  });

  it("cards have a subtle border matching the Figma design", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const cards = screen.getAllByTestId(/property-card/);
    cards.forEach((card) => {
      expect(card.className).toContain("border");
    });
  });

  it("section has dark background", () => {
    render(<FeaturedProperties data={featuredProperties} />);
    const section = screen.getByTestId("featured-properties-section");
    expect(section.className).toContain("bg-zinc-950");
  });

  it("renders error state with retry button", () => {
    mockUseFeaturedProperties.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
      mutate: vi.fn(),
    });
    render(<FeaturedProperties />);
    expect(screen.getByTestId("featured-properties-error")).toBeInTheDocument();
    expect(screen.getByTestId("featured-properties-retry")).toHaveTextContent("Retry");
  });
});
