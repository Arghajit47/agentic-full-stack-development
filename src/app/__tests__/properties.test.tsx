import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup as cleanupReact, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PropertiesPage from "@/app/properties/page";

describe("Properties Page integration", () => {
  afterEach(() => {
    cleanupReact();
  });

  it("renders the page and transitions from loading skeleton to property list", async () => {
    render(<PropertiesPage />);
    
    // Check for loading skeletons initially
    expect(screen.getByTestId("property-grid-loading")).toBeInTheDocument();
    expect(screen.getAllByTestId("property-skeleton").length).toBe(6);

    // Verify properties list is rendered after the simulated delay
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByTestId("properties-page-heading")).toHaveTextContent("Discover a World of Possibilities");
    expect(screen.getByTestId("property-grid")).toBeInTheDocument();
    
    // We have 10 mock items, page size is 6, so first page should have 6 items
    expect(screen.getAllByTestId("property-card").length).toBe(6);
  });

  it("filters properties when the property type dropdown changes", async () => {
    render(<PropertiesPage />);
    
    // Wait for initial load to finish
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    // Get type select filter dropdown
    const select = screen.getByTestId("property-type-filter");
    
    // Select Mansion filter (should contain Royal Oak Mansion and Whispering Pines Mansion)
    fireEvent.change(select, { target: { value: "Mansion" } });
    
    // Wait for the new load to complete
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getAllByTestId("property-card").length).toBe(2);
    expect(screen.getByText("Royal Oak Mansion")).toBeInTheDocument();
    expect(screen.getByText("Whispering Pines Mansion")).toBeInTheDocument();
  });

  it("filters properties based on search query when submitting search", async () => {
    render(<PropertiesPage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    const searchInput = screen.getByTestId("search-input");
    const form = screen.getByTestId("search-filter-form");

    // Search for "Malibu" (should match Beachfront Estate)
    fireEvent.change(searchInput, { target: { value: "Malibu" } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getAllByTestId("property-card").length).toBe(1);
    expect(screen.getByText("Beachfront Estate")).toBeInTheDocument();
  });

  it("handles empty results state correctly", async () => {
    render(<PropertiesPage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    const searchInput = screen.getByTestId("search-input");
    const form = screen.getByTestId("search-filter-form");

    // Search for non-matching query
    fireEvent.change(searchInput, { target: { value: "NonMatchingQueryString" } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByTestId("no-properties")).toBeInTheDocument();
    expect(screen.getByText("No properties found")).toBeInTheDocument();
  });

  it("handles pagination next and prev pages correctly", async () => {
    render(<PropertiesPage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    // Initial page shows page indicator "Page 1 of 2"
    expect(screen.getByTestId("pagination-indicator")).toHaveTextContent("Page 1 of 2");

    // Click Next button
    const nextBtn = screen.getByTestId("next-page-btn");
    fireEvent.click(nextBtn);

    // Wait for next page to load
    await waitFor(() => {
      expect(screen.queryByTestId("property-grid-loading")).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByTestId("pagination-indicator")).toHaveTextContent("Page 2 of 2");

    // The remaining 4 properties should be shown on page 2
    expect(screen.getAllByTestId("property-card").length).toBe(4);
  });
});
