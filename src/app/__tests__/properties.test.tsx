import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup as cleanupReact, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PropertiesPage from "@/app/properties/page";

// ─── Mock API data (matches /api/properties response shape) ───────────────────
const MOCK_PROPERTIES = [
  { id: 1, slug: "a", title: "Royal Oak Mansion", description: "Grand", price: 3450000, location: "Greenwich, CT", bedrooms: 7, bathrooms: 8, propertyType: "Mansion", imageUrl: "/images/properties/property-1.jpg", areaSqft: 8500, isFeatured: true, galleryUrls: [], features: [] },
  { id: 2, slug: "b", title: "Whispering Pines Mansion", description: "Serene", price: 2800000, location: "Aspen, CO", bedrooms: 6, bathrooms: 5, propertyType: "Mansion", imageUrl: "/images/properties/property-2.jpg", areaSqft: 6200, isFeatured: false, galleryUrls: [], features: [] },
  { id: 3, slug: "c", title: "Beachfront Estate", description: "Stunning Malibu ocean views", price: 5200000, location: "Malibu, CA", bedrooms: 5, bathrooms: 4, propertyType: "Estate", imageUrl: "/images/properties/property-3.jpg", areaSqft: 4200, isFeatured: true, galleryUrls: [], features: [] },
  { id: 4, slug: "d", title: "Modern Luxury Villa", description: "Contemporary", price: 1250000, location: "Beverly Hills, CA", bedrooms: 5, bathrooms: 4, propertyType: "Villa", imageUrl: "/images/properties/property-4.jpg", areaSqft: 4200, isFeatured: false, galleryUrls: [], features: [] },
  { id: 5, slug: "e", title: "Cozy Cottage", description: "Charming", price: 450000, location: "Portland, OR", bedrooms: 2, bathrooms: 1, propertyType: "Cottage", imageUrl: "/images/properties/property-5.jpg", areaSqft: 1100, isFeatured: false, galleryUrls: [], features: [] },
  { id: 6, slug: "f", title: "Suburban House", description: "Family home", price: 650000, location: "Austin, TX", bedrooms: 4, bathrooms: 3, propertyType: "House", imageUrl: "/images/properties/property-6.jpg", areaSqft: 2800, isFeatured: false, galleryUrls: [], features: [] },
  { id: 7, slug: "g", title: "Downtown Loft", description: "Urban living", price: 850000, location: "Seattle, WA", bedrooms: 1, bathrooms: 1, propertyType: "House", imageUrl: "/images/properties/property-7.jpg", areaSqft: 1200, isFeatured: false, galleryUrls: [], features: [] },
  { id: 8, slug: "h", title: "Lakeview Villa", description: "Waterfront", price: 2100000, location: "Tahoe, CA", bedrooms: 4, bathrooms: 3, propertyType: "Villa", imageUrl: "/images/properties/property-8.jpg", areaSqft: 3600, isFeatured: false, galleryUrls: [], features: [] },
  { id: 9, slug: "i", title: "Hilltop Estate", description: "Panoramic views", price: 3800000, location: "Hollywood Hills, CA", bedrooms: 6, bathrooms: 5, propertyType: "Estate", imageUrl: "/images/properties/property-9.jpg", areaSqft: 5800, isFeatured: false, galleryUrls: [], features: [] },
  { id: 10, slug: "j", title: "Garden Cottage", description: "Quaint", price: 380000, location: "Savannah, GA", bedrooms: 2, bathrooms: 1, propertyType: "Cottage", imageUrl: "/images/properties/property-10.jpg", areaSqft: 950, isFeatured: false, galleryUrls: [], features: [] },
];

function mockApiResponse(items: typeof MOCK_PROPERTIES, total: number, page: number, limit = 6) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ items, total, page, limit }),
  } as Response;
}

function filteredAndPaginated(query: string, type: string, page: number, limit = 6) {
  let items = MOCK_PROPERTIES;
  if (query.trim()) {
    const q = query.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q),
    );
  }
  if (type && type !== "All") {
    items = items.filter((p) => p.propertyType === type);
  }
  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return { items: paged, total, page, limit };
}

describe("Properties Page integration", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const u = new URL(url, "http://localhost");
        const search = u.searchParams.get("search") ?? "";
        const type = u.searchParams.get("type") ?? "All";
        const page = parseInt(u.searchParams.get("page") ?? "1", 10);
        const limit = parseInt(u.searchParams.get("limit") ?? "6", 10);
        return Promise.resolve(mockApiResponse(...Object.values(filteredAndPaginated(search, type, page, limit)) as [typeof MOCK_PROPERTIES, number, number, number]));
      }),
    );
  });

  afterEach(() => {
    cleanupReact();
    vi.unstubAllGlobals();
  });

  it("renders the page and transitions from loading skeleton to property list", async () => {
    render(<PropertiesPage />);

    // Check for loading skeletons initially
    expect(screen.getByTestId("property-grid-loading")).toBeInTheDocument();

    // Wait for properties to render
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByTestId("properties-page-heading")).toHaveTextContent("Find Your Dream Property");
    expect(screen.getByTestId("property-grid")).toBeInTheDocument();
    expect(screen.getAllByTestId("property-card").length).toBe(6);
  });

  it("filters properties when the property type dropdown changes", async () => {
    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    const select = screen.getByTestId("property-type-filter");
    fireEvent.change(select, { target: { value: "Mansion" } });

    // Wait for debounced fetch + loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getAllByTestId("property-card").length).toBe(2);
    expect(screen.getByText("Royal Oak Mansion")).toBeInTheDocument();
    expect(screen.getByText("Whispering Pines Mansion")).toBeInTheDocument();
  });

  it("filters properties based on search query when submitting search", async () => {
    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    const searchInput = screen.getByTestId("search-input");
    const form = screen.getByTestId("search-filter-form");

    fireEvent.change(searchInput, { target: { value: "Malibu" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getAllByTestId("property-card").length).toBe(1);
    expect(screen.getByText("Beachfront Estate")).toBeInTheDocument();
  });

  it("handles empty results state correctly", async () => {
    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    const searchInput = screen.getByTestId("search-input");
    const form = screen.getByTestId("search-filter-form");

    fireEvent.change(searchInput, { target: { value: "NonMatchingQueryString" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByTestId("no-properties")).toBeInTheDocument();
    expect(screen.getByText("No properties found")).toBeInTheDocument();
  });

  it("handles pagination next and prev pages correctly", async () => {
    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // 10 items, 6 per page → 2 pages
    expect(screen.getByTestId("pagination-indicator")).toHaveTextContent("Page 1 of 2");

    const nextBtn = screen.getByTestId("next-page-btn");
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByTestId("pagination-indicator")).toHaveTextContent("Page 2 of 2");
    expect(screen.getAllByTestId("property-card").length).toBe(4);
  });
});