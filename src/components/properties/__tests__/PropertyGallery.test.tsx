import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PropertyGallery } from "../PropertyGallery";
import { type PropertyImage } from "@/lib/schemas";

describe("PropertyGallery", () => {
  afterEach(() => {
    cleanup();
  });

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
    expect(screen.getAllByTestId("property-gallery")[0]).toBeInTheDocument();
  });

  it("shows empty state when no images provided", () => {
    render(<PropertyGallery images={[]} title="Test Property" />);
    expect(screen.getAllByTestId("property-gallery-empty")[0]).toBeInTheDocument();
  });

  it("renders the first image initially", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    expect(screen.getAllByTestId("gallery-main-image-0")[0]).toBeInTheDocument();
  });

  it("navigates to next image when next button clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const nextButton = screen.getAllByTestId("gallery-next-button")[0];
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId("gallery-main-image-1")[0]).toBeInTheDocument();
  });

  it("navigates to previous image when previous button clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    expect(screen.getAllByTestId("gallery-main-image-0").length).toBeGreaterThan(0);
    const prevButton = screen.getAllByTestId("gallery-prev-button")[0];
    fireEvent.click(prevButton);
    // After clicking prev from index 0, the main image should no longer be image 0
    expect(screen.queryAllByTestId("gallery-main-image-0").length).toBe(0);
  });

  it("renders indicator pills for navigation", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const indicators = screen.getAllByLabelText(/Image \d+ of \d+/);
    expect(indicators.length).toBeGreaterThanOrEqual(mockImages.length);
  });

  it("navigates via indicator pill click", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const indicator2s = screen.getAllByLabelText(`Image 2 of ${mockImages.length}`);
    fireEvent.click(indicator2s[0]);
    expect(screen.getAllByTestId("gallery-main-image-1")[0]).toBeInTheDocument();
  });

  it("opens lightbox when main image clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const mainImage = screen.getAllByTestId("gallery-main-image-0")[0];
    fireEvent.click(mainImage);
    expect(screen.getAllByTestId("gallery-lightbox")[0]).toBeInTheDocument();
  });

  it("closes lightbox when close button clicked", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    const mainImage = screen.getAllByTestId("gallery-main-image-0")[0];
    fireEvent.click(mainImage);
    const closeButton = screen.getAllByTestId("lightbox-close-button")[0];
    fireEvent.click(closeButton);
    expect(screen.queryByTestId("gallery-lightbox")).not.toBeInTheDocument();
  });

  it("has proper accessibility labels on nav buttons", () => {
    render(<PropertyGallery images={mockImages} title="Test Property" />);
    expect(screen.getAllByLabelText("Previous image")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("Next image")[0]).toBeInTheDocument();
  });

  it("does not render nav bar for single image", () => {
    render(<PropertyGallery images={[mockImages[0]]} title="Test Property" />);
    expect(screen.queryAllByTestId("gallery-prev-button").length).toBe(0);
    expect(screen.queryAllByTestId("gallery-next-button").length).toBe(0);
  });
});
