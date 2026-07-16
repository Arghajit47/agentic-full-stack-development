import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import Testimonials from "@/components/home/Testimonials";
import type { Review } from "@/mocks/testimonials";

afterEach(() => cleanup());

const mockReviews: Review[] = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    clientAvatarUrl: "https://example.com/a1.jpg",
    rating: 5,
    reviewText: "Finding our dream home was effortless.",
    propertyTitle: "Modern Luxury Villa",
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientAvatarUrl: "https://example.com/a2.jpg",
    rating: 5,
    reviewText: "Professional, responsive, and genuinely caring.",
    propertyTitle: "Downtown Penthouse",
  },
  {
    id: 3,
    clientName: "Emily Rodriguez",
    clientAvatarUrl: "https://example.com/a3.jpg",
    rating: 4,
    reviewText: "Great experience overall.",
    propertyTitle: "Suburban Family Home",
  },
  {
    id: 4,
    clientName: "David Thompson",
    clientAvatarUrl: "https://example.com/a4.jpg",
    rating: 5,
    reviewText: "Outstanding service.",
  },
  {
    id: 5,
    clientName: "Jessica Williams",
    clientAvatarUrl: "https://example.com/a5.jpg",
    rating: 4,
    reviewText: "Smooth transaction and excellent communication.",
    propertyTitle: "Contemporary Loft",
  },
];

describe("Testimonials", () => {
  it("renders heading 'What Our Clients Say' and a subheading", () => {
    render(<Testimonials reviews={mockReviews} />);
    expect(screen.getByText("What Our Clients Say")).toBeTruthy();
    expect(
      screen.getByText(/real stories from real clients/i)
    ).toBeTruthy();
  });

  it("renders up to 5 review cards", () => {
    render(<Testimonials reviews={mockReviews} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(5);
  });

  it("displays avatar image, client name, star rating, review text, and optional property name", () => {
    render(<Testimonials reviews={mockReviews} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(5);

    cards.forEach((card, idx) => {
      const r = mockReviews[idx];
      // avatar
      const img = within(card).getByRole("img") as HTMLImageElement;
      expect(img.src).toBe(r.clientAvatarUrl);
      // client name
      expect(within(card).getByText(r.clientName)).toBeTruthy();
      // review text
      expect(within(card).getByText(new RegExp(r.reviewText))).toBeTruthy();
      // property title (optional)
      if (r.propertyTitle) {
        expect(within(card).getByText(r.propertyTitle)).toBeTruthy();
      }
    });
  });

  it("renders 5 star icons per card with correct filled/empty count", () => {
    render(<Testimonials reviews={mockReviews} />);
    const cards = screen.getAllByRole("article");
    // Each card has a star-rating container with aria-label
    cards.forEach((card, idx) => {
      const r = mockReviews[idx];
      const rating = within(card).getByLabelText(`${r.rating} out of 5 stars`);
      expect(rating).toBeTruthy();
      // 5 svg star icons in the rating container
      const stars = rating.querySelectorAll("svg");
      expect(stars).toHaveLength(5);
    });
  });

  it("shows loading skeleton state while loading", () => {
    render(<Testimonials reviews={mockReviews} isLoading />);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.queryByText("No reviews yet")).toBeNull();
  });

  it("transitions out of loading state when isLoading flips to false", () => {
    const { rerender } = render(
      <Testimonials reviews={mockReviews} isLoading />
    );
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    rerender(<Testimonials reviews={mockReviews} isLoading={false} />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });

  it("renders 'No reviews yet' when data array is empty", () => {
    render(<Testimonials reviews={[]} />);
    expect(screen.getByText("No reviews yet")).toBeTruthy();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("uses responsive grid classes (1 col mobile/768, 2 col md, 3 col lg/xl)", () => {
    const { container } = render(<Testimonials reviews={mockReviews} />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeTruthy();
    const cls = grid?.className ?? "";
    expect(cls).toContain("grid-cols-1");
    expect(cls).toContain("md:grid-cols-2");
    expect(cls).toContain("lg:grid-cols-3");
    expect(cls).toContain("xl:grid-cols-3");
  });

  it("supports ratings 1-5 with correct filled star count", () => {
    const reviews: Review[] = [
      { ...mockReviews[0], id: 10, rating: 1 },
      { ...mockReviews[1], id: 11, rating: 2 },
      { ...mockReviews[2], id: 12, rating: 3 },
      { ...mockReviews[3], id: 13, rating: 4 },
      { ...mockReviews[4], id: 14, rating: 5 },
    ];
    render(<Testimonials reviews={reviews} />);
    expect(screen.getByLabelText("1 out of 5 stars")).toBeTruthy();
    expect(screen.getByLabelText("2 out of 5 stars")).toBeTruthy();
    expect(screen.getByLabelText("3 out of 5 stars")).toBeTruthy();
    expect(screen.getByLabelText("4 out of 5 stars")).toBeTruthy();
    expect(screen.getByLabelText("5 out of 5 stars")).toBeTruthy();
  });

  it("falls back to default mock data when no reviews prop is passed", () => {
    render(<Testimonials />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });

  it("renders review card without property title when optional field is absent", () => {
    const reviews: Review[] = [
      {
        id: 99,
        clientName: "Test User",
        clientAvatarUrl: "https://example.com/x.jpg",
        rating: 5,
        reviewText: "No property title here.",
      },
    ];
    render(<Testimonials reviews={reviews} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("Test User")).toBeTruthy();
    expect(within(card).queryByText("Modern Luxury Villa")).toBeNull();
  });
});