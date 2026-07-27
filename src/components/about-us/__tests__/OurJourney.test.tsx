import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurJourney } from "@/components/about-us/OurJourney";
import type { AboutUsJourney } from "@/lib/schemas";

const mockJourney: AboutUsJourney = {
  heading: "Our Journey",
  body: "Our story is one of continuous growth and evolution.",
  imageUrl: "https://example.com/journey.jpg",
  stats: [
    { value: "200+", label: "Happy Customers", icon: "Home" },
    { value: "10k+", label: "Properties For Clients", icon: "Home" },
    { value: "16+", label: "Years of Experience", icon: "Home" },
  ],
};

afterEach(() => {
  cleanup();
});

describe("OurJourney", () => {
  it("renders heading, body, stats and image from props", () => {
    render(<OurJourney data={mockJourney} />);

    expect(screen.getByTestId("our-journey-heading")).toHaveTextContent("Our Journey");
    expect(screen.getByTestId("our-journey-body")).toHaveTextContent("continuous growth and evolution");
    expect(screen.getByTestId("our-journey-stat-happy-customers")).toHaveTextContent("200+");
    expect(screen.getByTestId("our-journey-stat-properties-for-clients")).toHaveTextContent("10k+");
    expect(screen.getByTestId("our-journey-stat-years-of-experience")).toHaveTextContent("16+");
    expect(screen.getByTestId("our-journey-image")).toBeInTheDocument();
  });
});
