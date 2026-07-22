import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Testimonials } from "@/components/home/Testimonials";
import { testimonials } from "@/mocks/testimonials";

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1920 });
});

afterEach(cleanup);

const mockData = testimonials.slice(0, 5);

describe("Testimonials", () => {
  it("renders heading 'What Our Clients Say'", () => {
    render(<Testimonials data={mockData} />);
    expect(screen.getByTestId("testimonials-heading")).toHaveTextContent("What Our Clients Say");
  });

  it("heading is left-aligned", () => {
    render(<Testimonials data={mockData} />);
    expect(screen.getByTestId("testimonials-heading").closest("div")?.className).toContain("text-left");
  });

  it("renders subheading with exact AC text", () => {
    render(<Testimonials data={mockData} />);
    const sub = screen.getByTestId("testimonials-subheading");
    expect(sub).toHaveTextContent("Read the success stories and heartfelt testimonials from our valued clients. Discover why they chose Estatein for their real estate needs.");
  });

  it("renders 3 visible cards at 1920px", () => {
    render(<Testimonials data={mockData} />);
    expect(screen.getAllByTestId(/review-card/)).toHaveLength(3);
  });

  it("renders nav arrows with correct ARIA labels", () => {
    render(<Testimonials data={mockData} />);
    expect(screen.getByTestId("testimonials-prev-arrow")).toHaveAttribute("aria-label", "Previous reviews");
    expect(screen.getByTestId("testimonials-next-arrow")).toHaveAttribute("aria-label", "Next reviews");
  });

  it("left arrow disabled on first page", () => {
    render(<Testimonials data={mockData} />);
    expect(screen.getByTestId("testimonials-prev-arrow")).toBeDisabled();
  });

  it("renders 5 star pills per card", () => {
    render(<Testimonials data={mockData} />);
    const stars = screen.getByTestId(`review-stars-${mockData[0].id}`);
    const pills = stars.querySelectorAll("div > div");
    expect(pills).toHaveLength(5);
  });

  it("star rating has role=img and aria-label", () => {
    render(<Testimonials data={mockData} />);
    const stars = screen.getByTestId(`review-stars-${mockData[0].id}`);
    expect(stars).toHaveAttribute("role", "img");
    expect(stars).toHaveAttribute("aria-label", `${mockData[0].rating} out of 5 stars`);
  });

  it("renders review text in blockquote", () => {
    render(<Testimonials data={mockData} />);
    const text = screen.getByTestId(`review-text-${mockData[0].id}`);
    expect(text.tagName).toBe("BLOCKQUOTE");
    expect(text).toHaveTextContent(mockData[0].reviewText);
  });

  it("renders client name", () => {
    render(<Testimonials data={mockData} />);
    expect(screen.getByTestId(`review-name-${mockData[0].id}`)).toHaveTextContent(mockData[0].clientName);
  });

  it("renders avatar with alt=clientName", () => {
    render(<Testimonials data={mockData} />);
    const avatar = screen.getByAltText(mockData[0].clientName);
    expect(avatar).toBeInTheDocument();
  });

  it("renders skeleton loading state", () => {
    render(<Testimonials data={mockData} isLoading={true} />);
    expect(screen.getAllByTestId(/review-skeleton/)).toHaveLength(3);
  });

  it("renders empty state 'No reviews yet'", () => {
    render(<Testimonials data={[]} />);
    expect(screen.getByTestId("no-reviews")).toHaveTextContent("No reviews yet");
  });

  it("renders error state with retry button when onRetry provided", () => {
    const onRetry = vi.fn();
    render(<Testimonials data={[]} onRetry={onRetry} />);
    expect(screen.getByTestId("testimonials-retry-button")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("testimonials-retry-button"));
    expect(onRetry).toHaveBeenCalled();
  });

  it("cards have dark bg and border", () => {
    render(<Testimonials data={mockData} />);
    screen.getAllByTestId(/review-card/).forEach((card) => {
      expect(card.className).toContain("bg-[#141414]");
      expect(card.className).toContain("border-[#1D1B1B]");
    });
  });

  it("cards have tabindex=0", () => {
    render(<Testimonials data={mockData} />);
    screen.getAllByTestId(/review-card/).forEach((card) => {
      expect(card).toHaveAttribute("tabindex", "0");
    });
  });

  it("clicking right arrow navigates to next page", () => {
    render(<Testimonials data={mockData} />);
    fireEvent.click(screen.getByTestId("testimonials-next-arrow"));
    expect(screen.getByTestId("testimonials-prev-arrow")).not.toBeDisabled();
  });
});