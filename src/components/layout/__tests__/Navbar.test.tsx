import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Navbar } from "@/components/layout/Navbar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1920,
  });
});

afterEach(() => {
  cleanup();
});

describe("Navbar", () => {
  it("renders the top banner text", () => {
    render(<Navbar />);
    expect(screen.getByText(/Discover Your Dream Property with Estatein/i)).toBeInTheDocument();
  });

  it("renders the Learn More link", () => {
    render(<Navbar />);
    const link = screen.getByRole("link", { name: /Learn More/i });
    expect(link).toHaveAttribute("href", "/properties");
  });

  it("renders the Estatein logo and link to home", () => {
    render(<Navbar />);
    const logo = screen.getByRole("link", { name: /Estatein home/i });
    expect(logo).toHaveAttribute("href", "/");
    expect(screen.getByText("Estatein")).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(<Navbar />);
    ["Home", "About Us", "Properties", "Services"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("marks the active page with aria-current", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("renders the Contact Us button on desktop", () => {
    render(<Navbar />);
    const cta = screen.getByRole("link", { name: /Contact Us/i });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("toggles the mobile menu on hamburger click", () => {
    render(<Navbar />);
    const button = screen.getByTestId("mobile-menu-button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when a nav link is clicked", () => {
    render(<Navbar />);
    const button = screen.getByTestId("mobile-menu-button");
    fireEvent.click(button);
    const mobileNav = screen.getByTestId("mobile-nav");
    const mobileLink = within(mobileNav).getByRole("link", { name: "Properties" });
    fireEvent.click(mobileLink);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
