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
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPreviousLightbox = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextLightbox = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (images.length === 0) {
    return (
      <div 
        data-testid="property-gallery-empty"
        className="flex h-96 items-center justify-center rounded-xl bg-zinc-900/40 border border-zinc-800"
      >
        <p className="text-zinc-500">No images available</p>
      </div>
    );
  }

  return (
    <div data-testid="property-gallery" className="w-full">
      {/* Main Gallery */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-900/40">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            fill
            className="object-cover cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => openLightbox(currentIndex)}
            data-testid={`gallery-main-image-${currentIndex}`}
            priority={currentIndex === 0}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                data-testid="gallery-prev-button"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                data-testid="gallery-next-button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            <span data-testid="gallery-counter">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Caption */}
          {images[currentIndex].caption && (
            <div className="absolute bottom-4 left-4 max-w-md rounded-lg bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <p data-testid={`gallery-caption-${currentIndex}`}>
                {images[currentIndex].caption}
              </p>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" data-testid="gallery-thumbnails">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                data-testid={`gallery-thumbnail-${index}`}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  index === currentIndex
                    ? "border-violet-600 opacity-100"
                    : "border-zinc-800 opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          data-testid="gallery-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeLightbox}
            data-testid="lightbox-close-button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Navigation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousLightbox();
                }}
                data-testid="lightbox-prev-button"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextLightbox();
                }}
                data-testid="lightbox-next-button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Lightbox Image */}
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
            
            {/* Lightbox Caption */}
            {images[lightboxIndex].caption && (
              <div className="mt-4 text-center text-white">
                <p data-testid={`lightbox-caption-${lightboxIndex}`}>
                  {images[lightboxIndex].caption}
                </p>
              </div>
            )}

            {/* Lightbox Counter */}
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
