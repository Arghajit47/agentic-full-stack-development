import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Footer } from "@/components/layout/Footer";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(() => {
  cleanup();
});

describe("Footer", () => {
  it("renders the CTA heading", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: /Start Your Real Estate Journey Today/i })).toBeInTheDocument();
  });

  it("renders the CTA body text", () => {
    render(<Footer />);
    expect(screen.getByText(/Your dream property is just a click away/i)).toBeInTheDocument();
  });

  it("renders the Explore Properties button", () => {
    render(<Footer />);
    const cta = screen.getByRole("link", { name: /Explore Properties/i });
    expect(cta).toHaveAttribute("href", "/properties");
    expect(cta.className).toContain("bg-violet-600");
  });

  it("renders the newsletter email input with envelope icon", () => {
    render(<Footer />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Your Email/i)).toHaveAttribute("type", "email");
  });

  it("clears the email input on submit", () => {
    render(<Footer />);
    const input = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByRole("form"));
    expect(input.value).toBe("");
  });

  it("renders the copyright and terms link", () => {
    render(<Footer />);
    expect(screen.getByText(/\u00a92024 Estatein/i)).toBeInTheDocument();
    const terms = screen.getByRole("link", { name: /Terms \u0026 Conditions/i });
    expect(terms).toHaveAttribute("href", "/terms");
  });

  it("renders social media links", () => {
    render(<Footer />);
    for (const label of ["Facebook", "LinkedIn", "Twitter", "YouTube"]) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("has a dark background", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer").className).toContain("bg-zinc-950");
  });
});
