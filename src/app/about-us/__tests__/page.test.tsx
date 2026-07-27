import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AboutUsPage from "@/app/about-us/page";

afterEach(() => {
  cleanup();
});

describe("AboutUsPage", () => {
  it("renders page wrapper and all three sections", () => {
    render(<AboutUsPage />);

    expect(screen.getByTestId("about-us-page")).toBeInTheDocument();
    expect(screen.getByTestId("our-journey-heading")).toHaveTextContent("Our Journey");
    expect(screen.getByTestId("our-values-heading")).toHaveTextContent("Our Values");
    expect(screen.getByTestId("our-achievements-heading")).toHaveTextContent("Our Achievements");
  });
});
