import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { featuredProperties } from "@/mocks/featured-properties";

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1920 });
});

afterEach(cleanup);

const mockData = featuredProperties.slice(0, 6);

describe("FeaturedProperties", () => {
  it("renders heading 'Featured Properties'", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("featured-properties-heading")).toHaveTextContent("Featured Properties");
  });

  it("heading is left-aligned", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("featured-properties-heading").closest("div")?.className).toContain("text-left");
  });

  it("renders subheading with exact AC text", () => {
    render(<FeaturedProperties data={mockData} />);
    const sub = screen.getByTestId("featured-properties-subheading");
    expect(sub).toHaveTextContent("Explore our handpicked selection of featured properties. Each listing offers a glimpse into exceptional homes and investments available through Estatein.");
  });

  it("renders 3 visible cards at 1920px", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getAllByTestId(/property-card/)).toHaveLength(3);
  });

  it("renders 'View All Properties' button at top-right", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("view-all-properties")).toHaveTextContent("View All Properties");
  });

  it("renders nav arrows with correct ARIA labels", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("prev-arrow")).toHaveAttribute("aria-label", "Previous properties");
    expect(screen.getByTestId("next-arrow")).toHaveAttribute("aria-label", "Next properties");
  });

  it("left arrow disabled on first page", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("prev-arrow")).toBeDisabled();
  });

  it("right arrow enabled when more data exists", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("next-arrow")).not.toBeDisabled();
  });

  it("clicking right arrow navigates to next page", () => {
    render(<FeaturedProperties data={mockData} />);
    fireEvent.click(screen.getByTestId("next-arrow"));
    expect(screen.getByTestId("prev-arrow")).not.toBeDisabled();
  });

  it("renders property image with alt=text=title", () => {
    render(<FeaturedProperties data={mockData} />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(3);
    expect(images[0]).toHaveAttribute("alt", mockData[0].title);
  });

  it("renders 3 spec pills per card", () => {
    render(<FeaturedProperties data={mockData} />);
    const specs = screen.getByTestId(`property-specs-${mockData[0].id}`);
    expect(specs.textContent).toContain(`${mockData[0].bedrooms}-Bedroom`);
    expect(specs.textContent).toContain(`${mockData[0].bathrooms}-Bathroom`);
    expect(specs.textContent).toContain(mockData[0].propertyType);
  });

  it("renders 'Price' label above price value", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId(`price-label-${mockData[0].id}`)).toHaveTextContent("Price");
  });

  it("renders formatted price value", () => {
    render(<FeaturedProperties data={mockData} />);
    const priceSection = screen.getByTestId(`property-price-${mockData[0].id}`);
    expect(priceSection.textContent).toContain("$");
  });

  it("renders 'View Property Details' button with aria-label", () => {
    render(<FeaturedProperties data={mockData} />);
    const btn = screen.getByTestId(`view-details-${mockData[0].id}`);
    expect(btn).toHaveTextContent("View Property Details");
    expect(btn).toHaveAttribute("aria-label", `View details for ${mockData[0].title}`);
  });

  it("renders divider line behind arrows", () => {
    render(<FeaturedProperties data={mockData} />);
    expect(screen.getByTestId("divider-line")).toBeInTheDocument();
  });

  it("renders skeleton loading state", () => {
    render(<FeaturedProperties data={mockData} isLoading={true} />);
    expect(screen.getAllByTestId(/property-skeleton/)).toHaveLength(3);
  });

  it("renders empty state 'No properties found'", () => {
    render(<FeaturedProperties data={[]} />);
    expect(screen.getByTestId("no-properties")).toHaveTextContent("No properties found");
  });

  it("renders error state with retry button when onRetry provided", () => {
    const onRetry = vi.fn();
    render(<FeaturedProperties data={[]} onRetry={onRetry} />);
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalled();
  });

  it("cards have dark bg and border", () => {
    render(<FeaturedProperties data={mockData} />);
    screen.getAllByTestId(/property-card/).forEach((card) => {
      expect(card.className).toContain("bg-[#141414]");
      expect(card.className).toContain("border-[#1D1B1B]");
    });
  });

  it("cards have tabindex=0", () => {
    render(<FeaturedProperties data={mockData} />);
    screen.getAllByTestId(/property-card/).forEach((card) => {
      expect(card).toHaveAttribute("tabindex", "0");
    });
  });
});