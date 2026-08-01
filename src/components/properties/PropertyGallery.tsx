"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type PropertyImage } from "@/lib/schemas";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const goToPreviousLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextLightbox = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div
        data-testid="property-gallery-empty"
        className="flex h-96 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40"
      >
        <p className="text-zinc-500">No images available</p>
      </div>
    );
  }

  return (
    <div data-testid="property-gallery" className="w-full">
      {/* Main Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-zinc-900/40">
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          fill
          className="cursor-pointer object-cover transition-opacity hover:opacity-90"
          onClick={() => openLightbox(currentIndex)}
          data-testid={`gallery-main-image-${currentIndex}`}
          priority={currentIndex === 0}
        />
      </div>

      {/* Navigation Bar — below image */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-6 rounded-b-xl border border-t-0 border-zinc-800 bg-zinc-900 px-6 py-5">
          <button
            type="button"
            onClick={goToPrevious}
            data-testid="gallery-prev-button"
            aria-label="Previous image"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Image navigation">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Image ${i + 1} of ${images.length}`}
                aria-current={i === currentIndex ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === currentIndex
                    ? "w-5 bg-violet-500"
                    : "w-5 bg-zinc-600 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            data-testid="gallery-next-button"
            aria-label="Next image"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          data-testid="gallery-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            data-testid="lightbox-close-button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToPreviousLightbox(); }}
                data-testid="lightbox-prev-button"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goToNextLightbox(); }}
                data-testid="lightbox-next-button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div
            className="relative mx-auto max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              width={1920}
              height={1080}
              className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
              data-testid={`lightbox-image-${lightboxIndex}`}
            />
            {images[lightboxIndex].caption && (
              <div className="mt-4 text-center text-white">
                <p data-testid={`lightbox-caption-${lightboxIndex}`}>
                  {images[lightboxIndex].caption}
                </p>
              </div>
            )}
            <div className="mt-2 text-center text-sm text-zinc-400">
              <span data-testid="lightbox-counter">
                {lightboxIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
