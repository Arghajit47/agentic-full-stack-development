import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import PropertyDetailsPage from "../page";

// ─── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "modern-villa-sunset-hills" }),
  notFound: () => {
    throw Object.assign(new Error("NEXT_NOT_FOUND"), { digest: "NEXT_NOT_FOUND" });
  },
}));

vi.mock("@/lib/api", () => ({
  fetcher: vi.fn(),
}));

import { fetcher } from "@/lib/api";

const mockFetcher = vi.mocked(fetcher);

const MOCK_PROPERTY = {
  id: 1,
  slug: "modern-villa-sunset-hills",
  title: "Modern Villa in Sunset Hills",
  description: "Beautiful modern villa with pool and garden.",
  longDescription: "This is the long description.",
  price: 1500000,
  location: "Sunset Hills, CA",
  address: "Modern Villa in Sunset Hills, Sunset Hills, CA",
  bedrooms: 4,
  bathrooms: 3,
  propertyType: "Villa",
  area: "3,500 sq ft",
  lotSize: "5,250 sq ft",
  yearBuilt: 2020,
  status: "For Sale",
  images: [
    { id: 1, url: "/images/properties/property-1.jpg", alt: "Image 1", caption: "Main" },
    { id: 2, url: "/images/properties/property-2.jpg", alt: "Image 2" },
  ],
  features: [
    { id: 1, name: "Bedrooms", icon: "Bed", value: "4" },
    { id: 2, name: "Bathrooms", icon: "Bath", value: "3" },
    { id: 3, name: "Area", icon: "Ruler", value: "3,500 sq ft" },
  ],
  amenities: [
    { id: 1, category: "Interior", items: ["Smart Home"] },
    { id: 2, category: "Exterior", items: ["Swimming Pool"] },
  ],
  agentName: "Sarah Johnson",
  agentPhone: "+1 (310) 555-0123",
  agentEmail: "sarah.johnson@realestate.com",
};

const MOCK_PRICING = {
  success: true,
  data: {
    propertySlug: "modern-villa-sunset-hills",
    additionalFees: {
      propertyTransferTax: 25000,
      legalFees: 3000,
      homeInspection: 500,
      propertyInsurance: 1200,
      mortgageFees: "Varies",
    },
    monthlyCosts: {
      propertyTaxesMonthly: 1250,
      hoaFeeMonthly: 300,
    },
    totalInitialCosts: {
      downPayment: 250000,
      downPaymentPct: 20,
      mortgageAmount: 1000000,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  error: null,
};

function renderPage() {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <PropertyDetailsPage />
    </SWRConfig>
  );
}

function mockFetchSuccess(data = MOCK_PROPERTY) {
  mockFetcher.mockResolvedValue(data);
}

function mockFetchError(message = "Network error") {
  mockFetcher.mockRejectedValue(new Error(message));
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Property Details Page integration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string | URL | Request) => {
      const urlString = typeof url === "string" ? url : url instanceof URL ? url.toString() : url.url;
      if (urlString.includes("/api/contact/property")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: { id: 1 }, message: "Submitted" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => MOCK_PRICING,
      });
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders loading skeleton while fetching", async () => {
    mockFetchSuccess();
    renderPage();

    expect(screen.getByTestId("property-title-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("property-gallery-skeleton")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("property-title-skeleton")).not.toBeInTheDocument();
    });
  });

  it("renders property title, price, gallery, and details after fetch", async () => {
    mockFetchSuccess();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("property-gallery")).toBeInTheDocument();
    });

    // Page header + PropertyDetails both render the title; use the header test id
    expect(screen.getByTestId("property-page-title")).toHaveTextContent("Modern Villa in Sunset Hills");
    expect(screen.getByTestId("property-header-price")).toHaveTextContent("$1,500,000");
    expect(screen.getByTestId("property-details")).toBeInTheDocument();
    expect(screen.getByTestId("property-inquiry-form")).toBeInTheDocument();
  });

  it("shows error state with retry button when fetch fails", async () => {
    mockFetchError("Failed to fetch property");
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("property-error-state")).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to fetch property")).toBeInTheDocument();

    // Retry behavior
    mockFetchSuccess();
    const retryButton = screen.getByTestId("property-retry-button");
    const user = userEvent.setup();
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.queryByTestId("property-error-state")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("property-gallery")).toBeInTheDocument();
    });
  });

  it("calls mutate when retry button is clicked", async () => {
    mockFetchError("Failed to fetch property");
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("property-retry-button")).toBeInTheDocument();
    });

    mockFetchSuccess();
    fireEvent.click(screen.getByTestId("property-retry-button"));

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalled();
    });
  });

  it("submits inquiry form to /api/contact/property", async () => {
    mockFetchSuccess();

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("property-inquiry-form")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId("input-first-name"), "QA");
    await userEvent.type(screen.getByTestId("input-last-name"), "Automation");
    await userEvent.type(screen.getByTestId("input-email"), "qa+test@example.com");
    await userEvent.type(screen.getByTestId("input-phone"), "+1 555 123 4567");
    await userEvent.type(screen.getByTestId("input-message"), "I am interested in scheduling a viewing for this property.");
    fireEvent.click(screen.getByTestId("input-agree-terms"));

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact/property",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("\"propertySlug\":\"modern-villa-sunset-hills\""),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("inquiry-form-success")).toBeInTheDocument();
    });
  });

  it("displays submission error when inquiry API fails", async () => {
    mockFetchSuccess();
    const mockedFetch = global.fetch as ReturnType<typeof vi.fn>;
    mockedFetch.mockImplementation((url: string | URL | Request) => {
      const urlString = typeof url === "string" ? url : url instanceof URL ? url.toString() : url.url;
      if (urlString.includes("/api/contact/property")) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ success: false, error: "Server error" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => MOCK_PRICING,
      });
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("property-inquiry-form")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByTestId("input-first-name"), "QA");
    await userEvent.type(screen.getByTestId("input-last-name"), "Automation");
    await userEvent.type(screen.getByTestId("input-email"), "qa+test@example.com");
    await userEvent.type(screen.getByTestId("input-phone"), "+1 555 123 4567");
    await userEvent.type(screen.getByTestId("input-message"), "I am interested in scheduling a viewing for this property.");
    fireEvent.click(screen.getByTestId("input-agree-terms"));

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });
});
