import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { OfficeLocations } from "../OfficeLocations";
import type { OfficeLocation } from "../OfficeLocationCard";

const mockOffices: OfficeLocation[] = [
  {
    id: 1,
    name: "New York Office",
    address: "123 Fifth Ave",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    phone: "+1 (212) 555-0100",
    email: "ny@test.com",
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      weekends: "10:00 AM - 4:00 PM",
    },
  },
  {
    id: 2,
    name: "LA Office",
    address: "456 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90028",
    phone: "+1 (323) 555-0200",
    email: "la@test.com",
    hours: {
      weekdays: "8:30 AM - 5:30 PM",
      weekends: "Closed",
    },
  },
];

describe("OfficeLocations", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders section with correct test id", () => {
    render(<OfficeLocations offices={mockOffices} />);
    expect(screen.getByTestId("office-locations")).toBeInTheDocument();
  });

  it("renders section title", () => {
    render(<OfficeLocations offices={mockOffices} />);
    const title = screen.getByTestId("office-locations-title");
    expect(title).toHaveTextContent("Our Offices");
  });

  it("renders section description", () => {
    render(<OfficeLocations offices={mockOffices} />);
    const description = screen.getByTestId("office-locations-description");
    expect(description).toHaveTextContent(
      "Visit us at any of our locations. Our experienced team is ready to assist you with all your real estate needs."
    );
  });

  it("renders all office cards", () => {
    render(<OfficeLocations offices={mockOffices} />);
    expect(screen.getByTestId("office-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("office-card-2")).toBeInTheDocument();
  });

  it("renders correct number of office cards", () => {
    render(<OfficeLocations offices={mockOffices} />);
    const cards = screen.getAllByTestId(/office-card-/);
    expect(cards).toHaveLength(2);
  });

  it("renders office names in cards", () => {
    render(<OfficeLocations offices={mockOffices} />);
    expect(screen.getByText("New York Office")).toBeInTheDocument();
    expect(screen.getByText("LA Office")).toBeInTheDocument();
  });

  it("uses default offices when no offices prop provided", () => {
    render(<OfficeLocations />);
    // Default offices include New York, LA, Chicago, Miami
    expect(screen.getByText("New York Headquarters")).toBeInTheDocument();
    expect(screen.getByText("Los Angeles Office")).toBeInTheDocument();
    expect(screen.getByText("Chicago Branch")).toBeInTheDocument();
    expect(screen.getByText("Miami Office")).toBeInTheDocument();
  });

  it("renders empty state when offices array is empty", () => {
    render(<OfficeLocations offices={[]} />);
    expect(screen.getByTestId("office-locations-empty")).toBeInTheDocument();
    expect(screen.getByText("No office locations available")).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    const { container } = render(<OfficeLocations offices={mockOffices} />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("md:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-2");
    expect(grid?.className).toContain("xl:grid-cols-4");
  });

  it("renders with proper spacing classes", () => {
    render(<OfficeLocations offices={mockOffices} />);
    const section = screen.getByTestId("office-locations");
    expect(section.className).toContain("py-16");
    expect(section.className).toContain("px-4");
  });

  it("renders max-width container", () => {
    const { container } = render(<OfficeLocations offices={mockOffices} />);
    const maxWidthContainer = container.querySelector(".max-w-7xl");
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it("renders with dark background", () => {
    render(<OfficeLocations offices={mockOffices} />);
    const section = screen.getByTestId("office-locations");
    expect(section.className).toContain("bg-[#141414]");
  });

  it("renders single office correctly", () => {
    render(<OfficeLocations offices={[mockOffices[0]]} />);
    expect(screen.getByTestId("office-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("office-card-2")).not.toBeInTheDocument();
  });

  it("renders four default offices by default", () => {
    render(<OfficeLocations />);
    const cards = screen.getAllByTestId(/office-card-/);
    expect(cards).toHaveLength(4);
  });
});
