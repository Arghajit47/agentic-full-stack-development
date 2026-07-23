import { describe, it, expect, vi, afterEach, beforeAll } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Navbar } from "@/components/layout/Navbar";
import type { SWRResponse } from "swr";
import type { NavigationData } from "@/lib/api";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/lib/api", () => ({
  useNavigation: vi.fn(),
}));

const mockUseNavigation = vi.mocked(useNavigation, { partial: true });

beforeAll(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1920,
  });
});

afterEach(() => {
  cleanup();
  mockUseNavigation.mockReset();
});

const defaultData: NavigationData = {
  banner: { text: "Discover Your Dream Property with Estatein", cta: "Learn More", ctaHref: "/properties" },
  links: [
    { id: "1", label: "Home", href: "/", order: 0, isExternal: false },
    { id: "2", label: "About Us", href: "/about", order: 1, isExternal: false },
    { id: "3", label: "Properties", href: "/properties", order: 2, isExternal: false },
    { id: "4", label: "Services", href: "/services", order: 3, isExternal: false },
  ],
};

const baseState = {
  mutate: vi.fn(),
  isValidating: false,
  isLoading: false,
};

describe("Navbar", () => {
  it("renders the top banner text", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    expect(screen.getByText(/Discover Your Dream Property with Estatein/i)).toBeInTheDocument();
  });

  it("renders the Learn More link", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    const link = screen.getByRole("link", { name: /Learn More/i });
    expect(link).toHaveAttribute("href", "/properties");
  });

  it("renders the Estatein logo and link to home", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    const logo = screen.getByRole("link", { name: /Estatein home/i });
    expect(logo).toHaveAttribute("href", "/");
    expect(screen.getByText("Estatein")).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    ["Home", "About Us", "Properties", "Services"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("marks the active page with aria-current", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("renders the Contact Us button on desktop", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    const cta = screen.getByRole("link", { name: /Contact Us/i });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("toggles the mobile menu on hamburger click", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
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
    mockUseNavigation.mockReturnValue({ ...baseState, data: defaultData, error: undefined } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    const button = screen.getByTestId("mobile-menu-button");
    fireEvent.click(button);
    const mobileNav = screen.getByTestId("mobile-nav");
    const mobileLink = within(mobileNav).getByRole("link", { name: "Properties" });
    fireEvent.click(mobileLink);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows loading skeletons while data loads", () => {
    mockUseNavigation.mockReturnValue({ ...baseState, data: undefined, error: undefined, isLoading: true } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows error banner with retry button on error", () => {
    const mutate = vi.fn();
    mockUseNavigation.mockReturnValue({ ...baseState, mutate, data: undefined, error: new Error("boom") } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    expect(screen.getByText(/Unable to load banner/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));
    expect(mutate).toHaveBeenCalled();
  });

  it("falls back to hardcoded links when API returns empty links", () => {
    mockUseNavigation.mockReturnValue({
      ...baseState,
      data: { banner: { text: "Banner", cta: "Go", ctaHref: "/go" }, links: [] },
      error: undefined,
    } as unknown as SWRResponse<NavigationData, Error>);
    render(<Navbar />);
    ["Home", "About Us", "Properties", "Services"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });
});

import { useNavigation } from "@/lib/api";
