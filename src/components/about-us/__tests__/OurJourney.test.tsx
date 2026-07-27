import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { OurJourney } from "@/components/about-us/OurJourney";

afterEach(() => {
  cleanup();
});

describe("OurJourney", () => {
  it("renders heading, body, stats and image", () => {
    render(<OurJourney />);

    expect(screen.getByTestId("our-journey-heading")).toHaveTextContent("Our Journey");
    expect(screen.getByTestId("our-journey-body")).toHaveTextContent("continuous growth and evolution");
    expect(screen.getByTestId("our-journey-stat-happy-customers")).toHaveTextContent("200+");
    expect(screen.getByTestId("our-journey-stat-properties-for-clients")).toHaveTextContent("10k+");
    expect(screen.getByTestId("our-journey-stat-years-of-experience")).toHaveTextContent("16+");
    expect(screen.getByTestId("our-journey-image")).toBeInTheDocument();
  });
});
