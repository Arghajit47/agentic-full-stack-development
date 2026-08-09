import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CTASection } from "@/components/sections/CTASection";

afterEach(() => {
  cleanup();
});

describe("CTASection", () => {
  it("renders default heading with green accent", () => {
    render(<CTASection />);
    const heading = screen.getByTestId("cta-heading");
    expect(heading).toHaveTextContent("Start your financial journey with YourBank today!");
    expect(heading.querySelector("span")).toHaveClass("text-[#CAFF33]");
  });

  it("renders default body text", () => {
    render(<CTASection />);
    expect(screen.getByTestId("cta-body")).toHaveTextContent(
      "Ready to take control of your finances?"
    );
  });

  it("renders default button label and href", () => {
    render(<CTASection />);
    const button = screen.getByTestId("cta-button");
    expect(button).toHaveTextContent("Open Account");
    expect(button).toHaveAttribute("href", "/");
  });

  it("supports custom props", () => {
    render(
      <CTASection
        headlineStart="Custom start "
        headlineAccent="custom accent."
        body="Custom body text."
        buttonLabel="Custom CTA"
        buttonHref="/custom"
      />
    );
    expect(screen.getByTestId("cta-heading")).toHaveTextContent("Custom start custom accent.");
    expect(screen.getByTestId("cta-body")).toHaveTextContent("Custom body text.");
    expect(screen.getByTestId("cta-button")).toHaveTextContent("Custom CTA");
    expect(screen.getByTestId("cta-button")).toHaveAttribute("href", "/custom");
  });

  it("applies expected section and card test ids", () => {
    render(<CTASection />);
    expect(screen.getByTestId("cta-section")).toBeInTheDocument();
    expect(screen.getByTestId("cta-abstract-decoration")).toBeInTheDocument();
  });
});
