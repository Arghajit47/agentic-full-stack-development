import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ContactPage from "@/app/contact/page";

const mockOffices = [
  { id: 1, title: "New York Headquarters", address: "123 Fifth Avenue", email: "ny@estatein.com", phone: "+1 (212) 555-0100", order: 1, hours: { weekdays: "9:00 AM - 6:00 PM", weekends: "10:00 AM - 4:00 PM" } },
];

const mockGallery = [
  { id: 1, imageUrl: "/images/office-1.jpg", caption: "Office exterior", order: 1 },
];

const mockUseContactOffices = vi.hoisted(() => vi.fn());
const mockUseContactGallery = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api", () => ({
  useContactOffices: mockUseContactOffices,
  useContactGallery: mockUseContactGallery,
}));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

function renderAndHydrate(officesValue: ReturnType<typeof mockUseContactOffices>, galleryValue: ReturnType<typeof mockUseContactGallery>) {
  mockUseContactOffices.mockReturnValue(officesValue);
  mockUseContactGallery.mockReturnValue(galleryValue);
  render(<ContactPage />);
  vi.advanceTimersByTime(0);
}

describe("ContactPage", () => {
  it("renders loading state", () => {
    renderAndHydrate(
      { data: undefined, error: undefined, isLoading: true, mutate: vi.fn() },
      { data: undefined, error: undefined, isLoading: true, mutate: vi.fn() }
    );
    expect(screen.getByTestId("contact-page-loading")).toBeInTheDocument();
  });

  it("renders error state with retry button", async () => {
    const mutateOffices = vi.fn();
    const mutateGallery = vi.fn();
    renderAndHydrate(
      { data: undefined, error: new Error("boom"), isLoading: false, mutate: mutateOffices },
      { data: undefined, error: undefined, isLoading: false, mutate: mutateGallery }
    );
    expect(screen.getByTestId("contact-page-error")).toHaveTextContent("Unable to load contact information");
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() => {
      expect(mutateOffices).toHaveBeenCalled();
      expect(mutateGallery).toHaveBeenCalled();
    });
  });

  it("renders empty state when both arrays are empty", () => {
    renderAndHydrate(
      { data: [], error: undefined, isLoading: false, mutate: vi.fn() },
      { data: [], error: undefined, isLoading: false, mutate: vi.fn() }
    );
    expect(screen.getByTestId("contact-page-empty")).toBeInTheDocument();
  });

  it("renders contact page with fetched data", () => {
    renderAndHydrate(
      { data: mockOffices, error: undefined, isLoading: false, mutate: vi.fn() },
      { data: mockGallery, error: undefined, isLoading: false, mutate: vi.fn() }
    );
    expect(screen.getByTestId("contact-page")).toBeInTheDocument();
    expect(screen.getByTestId("contact-header")).toBeInTheDocument();
    expect(screen.getByTestId("office-locations")).toBeInTheDocument();
    expect(screen.getByTestId("photo-gallery-mosaic")).toBeInTheDocument();
    expect(screen.getByTestId("general-contact-form")).toBeInTheDocument();
  });
});
