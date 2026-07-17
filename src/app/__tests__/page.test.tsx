import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Home from "@/app/page";

const mockProperties = [
  {
    id: 1,
    slug: "modern-luxury-villa",
    title: "Modern Luxury Villa",
    description: "Spacious contemporary villa with floor-to-ceiling windows.",
    price: 1250000,
    location: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Villa",
    imageUrl: "https://example.com/villa.jpg",
  },
];

const mockReviews = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    clientAvatarUrl: "https://example.com/avatar.jpg",
    rating: 5,
    reviewText: "Great experience!",
    propertyTitle: "Modern Luxury Villa",
  },
];

const mockSettings = {
  properties_heading: "Featured Properties",
  properties_subheading: "Explore our handpicked selection of premium homes",
  reviews_heading: "What Our Clients Say",
  reviews_subheading: "Real stories from happy homeowners",
};

describe("Home page integration", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("fetches properties, reviews, and settings and renders them", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      let body: unknown = {};
      if (url === "/api/properties/featured") body = mockProperties;
      if (url === "/api/reviews/featured") body = mockReviews;
      if (url === "/api/settings") body = mockSettings;
      return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId("featured-properties-heading")).toHaveTextContent("Featured Properties");
    });

    expect(screen.getByTestId("featured-properties-subheading")).toHaveTextContent(
      "Explore our handpicked selection of premium homes"
    );
    expect(screen.getByTestId("testimonials-heading")).toHaveTextContent("What Our Clients Say");
    expect(screen.getByTestId("testimonials-subheading")).toHaveTextContent("Real stories from happy homeowners");
    expect(screen.getByTestId("property-title-1")).toHaveTextContent("Modern Luxury Villa");
    expect(screen.getByTestId("review-name-1")).toHaveTextContent("Sarah Johnson");
  });

  it("renders error fallback when fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network"));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load properties. Please try again later.")).toBeInTheDocument();
    });
  });
});
