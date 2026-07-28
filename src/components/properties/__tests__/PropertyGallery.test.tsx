import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PropertyGallery } from "../PropertyGallery";
import { type PropertyImage } from "@/mocks/property-details";

describe("PropertyGallery", () => {
  const mockImages: PropertyImage[] = [
    {
      id: 1,
      url: "/images/properties/property-1.jpg",
      alt: "Property exterior",
      caption: "Beautiful exterior view"
    },
    {
      id: 2,
      url: "/images/properties/property-2.jpg",
      alt: "Property interior",
      caption: "Spacious living room"
    },
    {
      id: 3,
      url: "/images/properties/property-3.jpg",
      alt: "Property kitchen",
      caption: "Modern kitchen"
    }
  ];

  it("renders the gallery with images", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    expect(screen.getByTestId("property-gallery")).toBeInTheDocument();
  });

  it("shows empty state when no images provided", () => {
    render(<PropertyGallery images={[]} title="Test Property" />);
    expect(screen.getByTestId("property-gallery-empty")).toBeInTheDocument();
  });

  it("displays image counter correctly", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const counters = screen.getAllByTestId("gallery-counter");
    expect(counters[0].textContent).toContain("1");
    expect(counters[0].textContent).toContain("3");
  });

  it("navigates to next image when next button clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const nextButton = screen.getAllByTestId("gallery-next-button")[0];
    
    fireEvent.click(nextButton);
    const counters = screen.getAllByTestId("gallery-counter");
    expect(counters[0].textContent).toContain("2");
  });

  it("navigates when thumbnail clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const thumbnail2 = screen.getAllByTestId("gallery-thumbnail-1")[0];
    
    fireEvent.click(thumbnail2);
    const counters = screen.getAllByTestId("gallery-counter");
    expect(counters[0].textContent).toContain("2");
  });

  it("opens lightbox when main image clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const mainImage = screen.getAllByTestId("gallery-main-image-0")[0];
    
    fireEvent.click(mainImage);
    expect(screen.getAllByTestId("gallery-lightbox")[0]).toBeInTheDocument();
  });

  it("closes lightbox when close button clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    
    // Open lightbox
    const mainImage = screen.getAllByTestId("gallery-main-image-0")[0];
    fireEvent.click(mainImage);
    
    // Close lightbox
    const closeButton = screen.getAllByTestId("lightbox-close-button")[0];
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId("gallery-lightbox")).not.toBeInTheDocument();
  });

  it("has proper accessibility labels", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const prevButtons = screen.getAllByLabelText("Previous image");
    const nextButtons = screen.getAllByLabelText("Next image");
    expect(prevButtons.length).toBeGreaterThan(0);
    expect(nextButtons.length).toBeGreaterThan(0);
  });
});
