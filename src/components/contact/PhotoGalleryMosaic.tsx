"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
}

export interface PhotoGalleryMosaicProps {
  images?: GalleryImage[];
  title?: string;
}

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: 1,
    url: "/images/properties/property-1.jpg",
    alt: "Modern office exterior",
    caption: "Our New York Headquarters",
  },
  {
    id: 2,
    url: "/images/properties/property-5.jpg",
    alt: "Office interior workspace",
    caption: "Collaborative work environment",
  },
  {
    id: 3,
    url: "/images/properties/property-10.jpg",
    alt: "Meeting room",
    caption: "Modern meeting spaces",
  },
  {
    id: 4,
    url: "/images/team/team-sarah.png",
    alt: "Team member",
    caption: "Our dedicated team",
  },
  {
    id: 5,
    url: "/images/properties/property-15.jpg",
    alt: "Office building",
    caption: "Los Angeles Office",
  },
  {
    id: 6,
    url: "/images/properties/property-3.jpg",
    alt: "Reception area",
    caption: "Welcoming reception",
  },
];

export function PhotoGalleryMosaic({
  images = DEFAULT_IMAGES,
  title = "Our Gallery",
}: PhotoGalleryMosaicProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    // Restore focus to the triggering button
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // Focus the close button when lightbox opens
    setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (images.length === 0) {
    return (
      <section
        data-testid="photo-gallery-empty"
        className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center rounded-lg bg-zinc-900">
            <p className="text-lg text-zinc-400">No gallery images available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        data-testid="photo-gallery-mosaic"
        className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12">
            <h2
              data-testid="photo-gallery-title"
              className="text-3xl font-semibold text-white sm:text-4xl lg:text-[40px]"
            >
              {title}
            </h2>
            <p
              data-testid="photo-gallery-description"
              className="mt-4 text-base text-[#999999] sm:text-lg"
            >
              Take a look at our offices, team, and the properties we&apos;ve helped clients find.
            </p>
          </div>

          {/* Mosaic Grid */}
          <div
            data-testid="photo-gallery-grid"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                ref={index === lightboxIndex ? triggerRef : undefined}
                type="button"
                data-testid={`gallery-image-${image.id}`}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-900 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
                aria-label={`View ${image.alt} in fullscreen`}
              >
                <Image
                  src={image.url}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-cover transition-opacity group-hover:opacity-80"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white">{image.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          data-testid="photo-gallery-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            data-testid="lightbox-close-button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-zinc-800/80 p-2 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              data-testid="lightbox-prev-button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-10 rounded-full bg-zinc-800/80 p-3 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              data-testid="lightbox-next-button"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-10 rounded-full bg-zinc-800/80 p-3 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full">
              <Image
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].alt}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-auto rounded-lg object-contain"
                data-testid="lightbox-image"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center">
              <p
                data-testid="lightbox-counter"
                className="text-sm text-zinc-400"
              >
                {lightboxIndex + 1} / {images.length}
              </p>
              {images[lightboxIndex].caption && (
                <p
                  data-testid="lightbox-caption"
                  className="mt-2 text-base text-white"
                >
                  {images[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
