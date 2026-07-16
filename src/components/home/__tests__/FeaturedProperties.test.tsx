import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import type { Property } from "@/mocks/featured-properties";

afterEach(() => cleanup());

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    price: 1250000,
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 4200,
    imageUrl: "https://example.com/1.jpg",
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    price: 895000,
    location: "New York, NY",
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 2100,
    imageUrl: "https://example.com/2.jpg",
  },
  {
    id: 3,
    title: "Beachfront Estate",
    price: 2150000,
    location: "Malibu, CA",
    bedrooms: 6,
    bathrooms: 5,
    areaSqft: 5800,
    imageUrl: "https://example.com/3.jpg",
  },
  {
    id: 4,
    title: "Suburban Family Home",
    price: 475000,
    location: "Austin, TX",
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2800,
    imageUrl: "https://example.com/4.jpg",
  },
  {
    id: 5,
    title: "Contemporary Loft",
    price: 620000,
    location: "Chicago, IL",
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1600,
    imageUrl: "https://example.com/5.jpg",
  },
  {
    id: 6,
    title: "Hillside Modern Retreat",
    price: 1780000,
    location: "Scottsdale, AZ",
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3900,
    imageUrl: "https://example.com/6.jpg",
  },
];

describe("FeaturedProperties", () => {
  it("renders heading 'Featured Properties' and a subheading", () => {
    render(<FeaturedProperties properties={mockProperties} />);
    expect(screen.getByText("Featured Properties")).toBeTruthy();
    // subheading placeholder
    expect(
      screen.getByText(/handpicked selection of premium properties/i)
    ).toBeTruthy();
  });

  it("renders exactly 6 property cards", () => {
    render(<FeaturedProperties properties={mockProperties} />);
    // 6 article elements (cards)
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(6);
  });

  it("displays image, title, formatted price, location, beds/baths/area in each card", () => {
    render(<FeaturedProperties properties={mockProperties} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(6);

    cards.forEach((card, idx) => {
      const p = mockProperties[idx];
      // title
      expect(within(card).getByText(p.title)).toBeTruthy();
      // price formatted
      const expected = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(p.price);
      expect(within(card).getByText(expected)).toBeTruthy();
      // location
      expect(within(card).getByText(p.location)).toBeTruthy();
      // beds / baths / area
      expect(within(card).getByText(`${p.bedrooms} Beds`)).toBeTruthy();
      expect(within(card).getByText(`${p.bathrooms} Baths`)).toBeTruthy();
      expect(
        within(card).getByText(`${p.areaSqft.toLocaleString("en-US")} sqft`)
      ).toBeTruthy();
      // image
      const img = within(card).getByRole("img") as HTMLImageElement;
      expect(img.src).toBe(p.imageUrl);
    });
  });

  it("renders 'Explore Properties' CTA button below the section", () => {
    render(<FeaturedProperties properties={mockProperties} />);
    const btn = screen.getByRole("button", { name: /explore properties/i });
    expect(btn).toBeTruthy();
  });

  it("shows loading skeleton state while loading", () => {
    render(<FeaturedProperties properties={mockProperties} isLoading />);
    // No articles rendered during loading
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    // CTA not rendered while loading
    expect(screen.queryByRole("button", { name: /explore properties/i })).toBeNull();
  });

  it("transitions out of loading state when isLoading flips to false", () => {
    const { rerender } = render(
      <FeaturedProperties properties={mockProperties} isLoading />
    );
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    rerender(<FeaturedProperties properties={mockProperties} isLoading={false} />);
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("renders 'No properties found' when data array is empty", () => {
    render(<FeaturedProperties properties={[]} />);
    expect(screen.getByText("No properties found")).toBeTruthy();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("does not render CTA when no properties", () => {
    render(<FeaturedProperties properties={[]} />);
    expect(screen.queryByRole("button", { name: /explore properties/i })).toBeNull();
  });

  it("uses responsive grid classes (1 col mobile, 2 col sm/md, 3 col lg/xl)", () => {
    const { container } = render(
      <FeaturedProperties properties={mockProperties} />
    );
    // Find the grid div (contains all cards)
    const grid = container.querySelector(".grid");
    expect(grid).toBeTruthy();
    const cls = grid?.className ?? "";
    expect(cls).toContain("grid-cols-1");
    expect(cls).toContain("sm:grid-cols-2");
    expect(cls).toContain("lg:grid-cols-3");
    expect(cls).toContain("xl:grid-cols-3");
  });

  it("formats price with Intl.NumberFormat (no decimals)", () => {
    render(<FeaturedProperties properties={mockProperties} />);
    expect(screen.getByText("$1,250,000")).toBeTruthy();
    expect(screen.getByText("$895,000")).toBeTruthy();
  });

  it("falls back to default mock data when no properties prop is passed", () => {
    render(<FeaturedProperties />);
    // Default mock has 6 properties
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });
});