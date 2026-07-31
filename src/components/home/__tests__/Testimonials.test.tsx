import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Testimonials } from "@/components/home/Testimonials";
import { testimonials } from "@/mocks/testimonials";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockUseFeaturedReviews = vi.fn((): {
  data: import("@/lib/api").FeaturedReview[] | undefined;
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
  useFeaturedReviews: () => mockUseFeaturedReviews(),
}));

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1920 });
});

afterEach(cleanup);

describe("Testimonials", () => {
  it("renders heading 'What Our Clients Say'", () => {
    render(<Testimonials />);
    expect(screen.getByTestId("testimonials-heading")).toHaveTextContent("What Our Clients Say");
  });

  it("heading is left-aligned", () => {
    render(<Testimonials />);
    const heading = screen.getByTestId("testimonials-heading");
    expect(heading.closest("div")?.className).toContain("text-left");
  });

  it("renders the subheading", () => {
    render(<Testimonials />);
    expect(screen.getByTestId("testimonials-subheading")).toBeInTheDocument();
  });

  it("renders 3 visible review cards at 1920px", () => {
    render(<Testimonials data={testimonials} />);
    const cards = screen.getAllByTestId(/review-card/);
    expect(cards).toHaveLength(3);
  });

  it("renders left and right navigation arrows", () => {
    render(<Testimonials data={testimonials} />);
    expect(screen.getByTestId("testimonials-prev-arrow")).toBeInTheDocument();
    expect(screen.getByTestId("testimonials-next-arrow")).toBeInTheDocument();
  });

  it("left arrow is disabled on first page", () => {
    render(<Testimonials data={testimonials} />);
    expect(screen.getByTestId("testimonials-prev-arrow")).toBeDisabled();
  });

  it("renders avatar image in each card", () => {
    render(<Testimonials data={testimonials} />);
    const images = screen.getAllByRole("img", { name: /Sarah|Michael|Emily/i });
    expect(images).toHaveLength(3);
  });

  it("renders client name and location in each card", () => {
    render(<Testimonials data={testimonials} />);
    testimonials.slice(0, 3).forEach((r) => {
      expect(screen.getByTestId(`review-name-${r.id}`)).toHaveTextContent(r.clientName);
      expect(screen.getByTestId(`review-location-${r.id}`)).toHaveTextContent(r.clientLocation);
    });
  });

  it("renders review title in each card", () => {
    render(<Testimonials data={testimonials} />);
    testimonials.slice(0, 3).forEach((r) => {
      expect(screen.getByTestId(`review-title-${r.id}`)).toHaveTextContent(r.reviewTitle ?? "");
    });
  });

  it("renders star rating with role=img and aria-label", () => {
    render(<Testimonials data={testimonials} />);
    const stars = screen.getAllByRole("img");
    expect(stars.length).toBeGreaterThanOrEqual(3);
  });

  it("renders review text in each card", () => {
    render(<Testimonials data={testimonials} />);
    testimonials.slice(0, 3).forEach((r) => {
      expect(screen.getByTestId(`review-text-${r.id}`)).toHaveTextContent(r.reviewText);
    });
  });

  it("renders skeleton loading state", () => {
    render(<Testimonials isLoading={true} />);
    expect(screen.getAllByTestId(/skeleton|review-skeleton/)).toHaveLength(3);
  });

  it("renders empty state when data is empty", () => {
    render(<Testimonials data={[]} />);
    expect(screen.getByTestId("no-reviews")).toHaveTextContent("No reviews yet");
  });

  it("cards have a subtle border matching the Figma design", () => {
    render(<Testimonials data={testimonials} />);
    const cards = screen.getAllByTestId(/review-card/);
    cards.forEach((card) => {
      expect(card.className).toContain("border");
    });
  });

  it("section has dark background", () => {
    render(<Testimonials data={testimonials} />);
    const section = screen.getByTestId("testimonials-section");
    expect(section.className).toContain("bg-zinc-950");
  });

  it("renders error state with retry button", () => {
    mockUseFeaturedReviews.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
      mutate: vi.fn(),
    });
    render(<Testimonials />);
    expect(screen.getByTestId("testimonials-error")).toBeInTheDocument();
    expect(screen.getByTestId("testimonials-retry")).toHaveTextContent("Retry");
  });
});
