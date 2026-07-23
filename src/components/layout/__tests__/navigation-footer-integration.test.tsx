import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const navigationData = {
  banner: { text: "Live banner text", cta: "Click me", ctaHref: "/live" },
  links: [
    { id: "a", label: "Home", href: "/", order: 0, isExternal: false },
    { id: "b", label: "About", href: "/about", order: 1, isExternal: false },
    { id: "c", label: "Properties", href: "/properties", order: 2, isExternal: false },
  ],
};

const footerData = {
  cta: {
    title: "Live CTA Title",
    body: "Live CTA body",
    ctaText: "Live Button",
    ctaHref: "/live-cta",
  },
  newsletter: { placeholder: "Live placeholder" },
  bottom: { copyright: "Live copyright", legalText: "Live legal" },
};

let navState: Partial<ReturnType<typeof import("@/lib/api").useNavigation>> = {
  data: navigationData,
  error: undefined,
  isLoading: false,
  mutate: vi.fn(),
};
let footerState: Partial<ReturnType<typeof import("@/lib/api").useFooter>> = {
  data: footerData,
  error: undefined,
  isLoading: false,
};

vi.mock("@/lib/api", () => ({
  useNavigation: vi.fn(() => navState),
  useFooter: vi.fn(() => footerState),
  newsletterSchema: {
    safeParse: (v: unknown) => {
      const email = typeof v === "object" && v !== null ? (v as { email: string }).email : "";
      return email.includes("@")
        ? { success: true, data: { email } }
        : { success: false, error: { issues: [{ message: "Invalid email address" }] } };
    },
  },
  subscribeNewsletter: vi.fn(async (input: { email: string }) => {
    const res = await mockFetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Subscription failed");
    return { data: json.data, message: json.message };
  }),
}));

afterEach(() => {
  cleanup();
  mockFetch.mockReset();
  navState = { data: navigationData, error: undefined, isLoading: false, mutate: vi.fn() };
  footerState = { data: footerData, error: undefined, isLoading: false };
});

describe("navigation and footer integration", () => {
  it("Navbar renders live API banner and links", () => {
    render(<Navbar />);
    expect(screen.getByText(/Live banner text/i)).toBeInTheDocument();
    const bannerCta = screen.getByRole("link", { name: /Click me/i });
    expect(bannerCta).toHaveAttribute("href", "/live");
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("Footer renders live API CTA, newsletter and bottom text", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: /Live CTA Title/i })).toBeInTheDocument();
    expect(screen.getByText(/Live CTA body/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Live Button/i });
    expect(cta).toHaveAttribute("href", "/live-cta");
    expect(screen.getByPlaceholderText(/Live placeholder/i)).toBeInTheDocument();
    expect(screen.getByText(/Live copyright/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Live legal/i })).toBeInTheDocument();
  });

  it("newsletter submit succeeds with live data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        data: { id: "sub-1", email: "user@example.com" },
        message: "Subscribed successfully",
      }),
    });
    render(<Footer />);
    const input = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "user@example.com" } });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(input.value).toBe(""));
    expect(screen.getByTestId("newsletter-message")).toHaveTextContent(/Subscribed successfully/i);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/newsletter",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
  });

  it("newsletter submit shows API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ success: false, error: "Invalid email address", data: null }),
    });
    render(<Footer />);
    const input = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "user@example.com" } });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getByTestId("newsletter-message")).toHaveTextContent(/Invalid email address/i),
    );
  });

  it("Navbar shows loading state", () => {
    navState = { data: undefined, error: undefined, isLoading: true, mutate: vi.fn() };
    render(<Navbar />);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("Navbar shows error state with retry", () => {
    const mutate = vi.fn();
    navState = { data: undefined, error: new Error("fail"), isLoading: false, mutate };
    render(<Navbar />);
    expect(screen.getByText(/Unable to load banner/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));
    expect(mutate).toHaveBeenCalled();
  });

  it("Footer shows loading state", () => {
    footerState = { data: undefined, error: undefined, isLoading: true };
    render(<Footer />);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});
