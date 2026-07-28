import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PhotoGalleryMosaic, type GalleryImage } from "../PhotoGalleryMosaic";

const mockImages: GalleryImage[] = [
  {
    id: 1,
    url: "/images/test-1.jpg",
    alt: "Test image 1",
    caption: "Caption 1",
  },
  {
    id: 2,
    url: "/images/test-2.jpg",
    alt: "Test image 2",
    caption: "Caption 2",
  },
  {
    id: 3,
    url: "/images/test-3.jpg",
    alt: "Test image 3",
  },
];

describe("PhotoGalleryMosaic", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders gallery section with correct test id", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      expect(screen.getByTestId("photo-gallery-mosaic")).toBeInTheDocument();
    });

    it("renders gallery title", () => {
      render(<PhotoGalleryMosaic images={mockImages} title="Test Gallery" />);
      const title = screen.getByTestId("photo-gallery-title");
      expect(title).toHaveTextContent("Test Gallery");
    });

    it("renders default title when not provided", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const title = screen.getByTestId("photo-gallery-title");
      expect(title).toHaveTextContent("Our Gallery");
    });

    it("renders gallery description", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const description = screen.getByTestId("photo-gallery-description");
      expect(description).toBeInTheDocument();
    });

    it("renders all gallery images", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      expect(screen.getByTestId("gallery-image-1")).toBeInTheDocument();
      expect(screen.getByTestId("gallery-image-2")).toBeInTheDocument();
      expect(screen.getByTestId("gallery-image-3")).toBeInTheDocument();
    });

    it("renders correct number of images", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const images = screen.getAllByTestId(/gallery-image-/);
      expect(images).toHaveLength(3);
    });

    it("renders with responsive grid classes", () => {
      const { container } = render(<PhotoGalleryMosaic images={mockImages} />);
      const grid = screen.getByTestId("photo-gallery-grid");
      expect(grid.className).toContain("grid-cols-2");
      expect(grid.className).toContain("sm:grid-cols-3");
      expect(grid.className).toContain("lg:grid-cols-4");
    });

    it("uses default images when no images prop provided", () => {
      render(<PhotoGalleryMosaic />);
      const images = screen.getAllByTestId(/gallery-image-/);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe("Empty State", () => {
    it("renders empty state when images array is empty", () => {
      render(<PhotoGalleryMosaic images={[]} />);
      expect(screen.getByTestId("photo-gallery-empty")).toBeInTheDocument();
      expect(screen.getByText("No gallery images available")).toBeInTheDocument();
    });

    it("does not render grid when images are empty", () => {
      render(<PhotoGalleryMosaic images={[]} />);
      expect(screen.queryByTestId("photo-gallery-grid")).not.toBeInTheDocument();
    });
  });

  describe("Lightbox Functionality", () => {
    it("does not show lightbox initially", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      expect(screen.queryByTestId("photo-gallery-lightbox")).not.toBeInTheDocument();
    });

    it("opens lightbox when image is clicked", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      expect(screen.getByTestId("photo-gallery-lightbox")).toBeInTheDocument();
    });

    it("displays correct image in lightbox", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-2");
      fireEvent.click(image);
      const lightboxImage = screen.getByTestId("lightbox-image");
      expect(lightboxImage).toHaveAttribute("alt", "Test image 2");
    });

    it("closes lightbox when close button is clicked", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const closeButton = screen.getByTestId("lightbox-close-button");
      fireEvent.click(closeButton);
      expect(screen.queryByTestId("photo-gallery-lightbox")).not.toBeInTheDocument();
    });

    it("closes lightbox when backdrop is clicked", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const lightbox = screen.getByTestId("photo-gallery-lightbox");
      fireEvent.click(lightbox);
      expect(screen.queryByTestId("photo-gallery-lightbox")).not.toBeInTheDocument();
    });

    it("displays image counter in lightbox", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const counter = screen.getByTestId("lightbox-counter");
      expect(counter).toHaveTextContent("1 / 3");
    });

    it("displays caption in lightbox when available", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const caption = screen.getByTestId("lightbox-caption");
      expect(caption).toHaveTextContent("Caption 1");
    });

    it("does not display caption when not available", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-3");
      fireEvent.click(image);
      expect(screen.queryByTestId("lightbox-caption")).not.toBeInTheDocument();
    });
  });

  describe("Lightbox Navigation", () => {
    it("shows navigation buttons when multiple images exist", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      expect(screen.getByTestId("lightbox-prev-button")).toBeInTheDocument();
      expect(screen.getByTestId("lightbox-next-button")).toBeInTheDocument();
    });

    it("navigates to next image when next button is clicked", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const nextButton = screen.getByTestId("lightbox-next-button");
      fireEvent.click(nextButton);
      const counter = screen.getByTestId("lightbox-counter");
      expect(counter).toHaveTextContent("2 / 3");
    });

    it("navigates to previous image when prev button is clicked", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-2");
      fireEvent.click(image);
      const prevButton = screen.getByTestId("lightbox-prev-button");
      fireEvent.click(prevButton);
      const counter = screen.getByTestId("lightbox-counter");
      expect(counter).toHaveTextContent("1 / 3");
    });

    it("wraps to first image when navigating next from last image", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-3");
      fireEvent.click(image);
      const nextButton = screen.getByTestId("lightbox-next-button");
      fireEvent.click(nextButton);
      const counter = screen.getByTestId("lightbox-counter");
      expect(counter).toHaveTextContent("1 / 3");
    });

    it("wraps to last image when navigating prev from first image", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const prevButton = screen.getByTestId("lightbox-prev-button");
      fireEvent.click(prevButton);
      const counter = screen.getByTestId("lightbox-counter");
      expect(counter).toHaveTextContent("3 / 3");
    });

    it("does not close lightbox when clicking on image container", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const lightboxImage = screen.getByTestId("lightbox-image");
      fireEvent.click(lightboxImage.parentElement!);
      expect(screen.getByTestId("photo-gallery-lightbox")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels on image buttons", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const imageButton = screen.getByTestId("gallery-image-1");
      expect(imageButton).toHaveAttribute("aria-label", "View Test image 1 in fullscreen");
    });

    it("lightbox has dialog role and modal attribute", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const lightbox = screen.getByTestId("photo-gallery-lightbox");
      expect(lightbox).toHaveAttribute("role", "dialog");
      expect(lightbox).toHaveAttribute("aria-modal", "true");
    });

    it("close button has proper aria-label", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const closeButton = screen.getByTestId("lightbox-close-button");
      expect(closeButton).toHaveAttribute("aria-label", "Close lightbox");
    });

    it("navigation buttons have proper aria-labels", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image = screen.getByTestId("gallery-image-1");
      fireEvent.click(image);
      const prevButton = screen.getByTestId("lightbox-prev-button");
      const nextButton = screen.getByTestId("lightbox-next-button");
      expect(prevButton).toHaveAttribute("aria-label", "Previous image");
      expect(nextButton).toHaveAttribute("aria-label", "Next image");
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive spacing classes", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const section = screen.getByTestId("photo-gallery-mosaic");
      expect(section.className).toContain("px-4");
      expect(section.className).toContain("sm:px-6");
      expect(section.className).toContain("lg:px-8");
    });

    it("has max-width container", () => {
      const { container } = render(<PhotoGalleryMosaic images={mockImages} />);
      const maxWidthContainer = container.querySelector(".max-w-7xl");
      expect(maxWidthContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles single image gallery", () => {
      render(<PhotoGalleryMosaic images={[mockImages[0]]} />);
      const images = screen.getAllByTestId(/gallery-image-/);
      expect(images).toHaveLength(1);
    });

    it("opens correct image when clicked in any order", () => {
      render(<PhotoGalleryMosaic images={mockImages} />);
      const image3 = screen.getByTestId("gallery-image-3");
      fireEvent.click(image3);
      const counter = screen.getByTestId("lightbox-counter");
      expect(counter).toHaveTextContent("3 / 3");
    });
  });
});
