import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Footer } from "@/components/layout/Footer";
import type { SWRResponse } from "swr";
import type { FooterData } from "@/lib/api";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const defaultFooter: FooterData = {
  cta: {
    title: "Start Your Real Estate Journey Today",
    body: "Your dream property is just a click away.",
    ctaText: "Explore Properties",
    ctaHref: "/properties",
  },
  newsletter: { placeholder: "Enter Your Email" },
  bottom: { copyright: "©2024 Estatein. All Rights Reserved.", legalText: "Terms & Conditions" },
};

let mockFooterState: Partial<SWRResponse<FooterData, Error>> = {
  data: defaultFooter,
  error: undefined,
  isLoading: false,
};

vi.mock("@/lib/api", () => ({
  useFooter: vi.fn(() => mockFooterState),
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
  mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
});

describe("Footer", () => {
  it("renders the CTA heading", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    expect(screen.getByRole("heading", { name: /Start Your Real Estate Journey Today/i })).toBeInTheDocument();
  });

  it("renders the CTA body text", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    expect(screen.getByText(/Your dream property is just a click away/i)).toBeInTheDocument();
  });

  it("renders the Explore Properties button", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    const cta = screen.getByRole("link", { name: /Explore Properties/i });
    expect(cta).toHaveAttribute("href", "/properties");
    expect(cta.className).toContain("bg-violet-600");
  });

  it("renders the newsletter email input with envelope icon", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Your Email/i)).toHaveAttribute("type", "email");
  });

  it("clears the email input on successful submit", async () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        data: { id: "sub-1", email: "test@example.com" },
        message: "Subscribed successfully",
      }),
    });
    render(<Footer />);
    const input = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() => expect(input.value).toBe(""));
    expect(screen.getByTestId("newsletter-message")).toHaveTextContent(/Subscribed successfully/i);
  });

  it("shows inline validation error for invalid email", async () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    const input = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "bad-email" } });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getByTestId("newsletter-message")).toHaveTextContent(/Invalid email/i),
    );
  });

  it("shows inline error from API failure", async () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ success: false, error: "Rate limit exceeded. Try again later.", data: null }),
    });
    render(<Footer />);
    const input = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("form"));
    await waitFor(() =>
      expect(screen.getByTestId("newsletter-message")).toHaveTextContent(/Rate limit exceeded/i),
    );
  });

  it("renders the copyright and terms link", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    expect(screen.getByText(/\u00a92024 Estatein/i)).toBeInTheDocument();
    const terms = screen.getByRole("link", { name: /Terms \u0026 Conditions/i });
    expect(terms).toHaveAttribute("href", "/terms");
  });

  it("renders social media links", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    for (const label of ["Facebook", "LinkedIn", "Twitter", "YouTube"]) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("has a dark background", () => {
    mockFooterState = { data: defaultFooter, error: undefined, isLoading: false };
    render(<Footer />);
    expect(screen.getByTestId("footer").className).toContain("bg-zinc-950");
  });

  it("shows loading skeletons while footer data loads", () => {
    mockFooterState = { data: undefined, error: undefined, isLoading: true };
    render(<Footer />);
    expect(document.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });
});
