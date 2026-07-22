"use client";

import { useState, useEffect, useMemo } from "react";
import { Bed, Bath, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { type Property } from "@/mocks/featured-properties";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function useResponsiveCardCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCount(3);
      else if (w >= 1024) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

interface FeaturedPropertiesProps {
  data?: Property[];
  isLoading?: boolean;
  heading?: string;
  subheading?: string;
  onPropertyClick?: (slug: string) => void;
  onRetry?: () => void;
}

export function FeaturedProperties({
  data = [],
  isLoading = false,
  heading = "Featured Properties",
  subheading = "Explore our handpicked selection of featured properties. Each listing offers a glimpse into exceptional homes and investments available through Estatein.",
  onPropertyClick = () => {},
  onRetry,
}: FeaturedPropertiesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const cardsVisible = useResponsiveCardCount();

  const visibleCards = useMemo(
    () => data.slice(startIndex, startIndex + cardsVisible),
    [data, startIndex, cardsVisible]
  );

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + cardsVisible < data.length;

  const goLeft = () => canGoLeft && setStartIndex((i) => Math.max(0, i - cardsVisible));
  const goRight = () =>
    canGoRight && setStartIndex((i) => Math.min(data.length - cardsVisible, i + cardsVisible));

  return (
    <section
      aria-labelledby="featured-properties-heading"
      data-testid="featured-properties-section"
      className="mx-auto w-full max-w-[1920px] px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Header: heading + subheading left, View All Properties button right */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div className="text-left">
          <h2
            id="featured-properties-heading"
            data-testid="featured-properties-heading"
            className="text-[18px] font-semibold text-white md:text-[20px] xl:text-[24px]"
          >
            {heading}
          </h2>
          <p
            data-testid="featured-properties-subheading"
            className="mt-3 max-w-2xl text-[14px] font-medium text-[#999999] md:text-[16px] xl:text-[18px]"
          >
            {subheading}
          </p>
        </div>
        <button
          type="button"
          data-testid="view-all-properties"
          className="shrink-0 rounded-[10px] border border-[#1D1B1B] bg-[#191919] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#252525]"
        >
          View All Properties
        </button>
      </div>

      {/* Card grid */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${cardsVisible}, minmax(0, 1fr))` }}
        data-testid="property-grid"
      >
        {isLoading
          ? Array.from({ length: cardsVisible }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                data-testid="property-skeleton"
                className="flex animate-pulse flex-col rounded-[12px] border border-[#1D1B1B] bg-[#141414] p-5"
              >
                <div className="aspect-[4/3] w-full rounded-[10px] bg-[#1D1B1B]" />
                <div className="mt-4 h-6 w-32 rounded bg-[#1D1B1B]" />
                <div className="mt-2 h-4 w-48 rounded bg-[#1D1B1B]" />
                <div className="mt-3 flex gap-2">
                  <div className="h-[43px] w-24 rounded-[28px] bg-[#1D1B1B]" />
                  <div className="h-[43px] w-24 rounded-[28px] bg-[#1D1B1B]" />
                  <div className="h-[43px] w-20 rounded-[28px] bg-[#1D1B1B]" />
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-12 rounded bg-[#1D1B1B]" />
                    <div className="h-5 w-28 rounded bg-[#1D1B1B]" />
                  </div>
                  <div className="h-10 w-36 rounded-[10px] bg-[#1D1B1B]" />
                </div>
              </div>
            ))
          : visibleCards.map((property) => (
              <article
                key={property.id}
                data-testid="property-card"
                tabIndex={0}
                className="flex flex-col rounded-[12px] border border-[#1D1B1B] bg-[#141414] p-5 focus:outline-none focus:ring-2 focus:ring-[#6F3BF6]"
              >
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full rounded-[10px] object-cover"
                  loading="lazy"
                />
                <h3
                  data-testid={`property-title-${property.id}`}
                  className="mt-4 text-left text-[18px] font-semibold text-white md:text-[20px] xl:text-[24px]"
                >
                  {property.title}
                </h3>
                <p
                  data-testid={`property-description-${property.id}`}
                  className="mt-1 line-clamp-2 text-left text-[14px] font-medium text-[#999999] md:text-[16px] xl:text-[18px]"
                >
                  {property.description}
                </p>
                {/* Spec pills */}
                <div
                  className="mt-3 flex flex-wrap gap-2"
                  data-testid={`property-specs-${property.id}`}
                >
                  <span className="flex h-[43px] items-center gap-2 rounded-[28px] border border-[#1D1B1B] bg-[#191919] px-3 text-[14px] font-medium text-white md:text-[18px]">
                    <Bed className="h-6 w-6 text-white" />
                    {property.bedrooms}-Bedroom
                  </span>
                  <span className="flex h-[43px] items-center gap-2 rounded-[28px] border border-[#1D1B1B] bg-[#191919] px-3 text-[14px] font-medium text-white md:text-[18px]">
                    <Bath className="h-6 w-6 text-white" />
                    {property.bathrooms}-Bathroom
                  </span>
                  <span className="flex h-[43px] items-center gap-2 rounded-[28px] border border-[#1D1B1B] bg-[#191919] px-3 text-[14px] font-medium text-white md:text-[18px]">
                    <Home className="h-6 w-6 text-white" />
                    {property.propertyType}
                  </span>
                </div>
                {/* Price + button */}
                <div
                  className="mt-4 flex items-end justify-between gap-[50px]"
                  data-testid={`property-price-${property.id}`}
                >
                  <div>
                    <p
                      className="text-[14px] font-medium text-[#999999] md:text-[18px]"
                      data-testid={`price-label-${property.id}`}
                    >
                      Price
                    </p>
                    <p className="text-[20px] font-semibold text-white">
                      {priceFormatter.format(property.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid={`view-details-${property.id}`}
                    aria-label={`View details for ${property.title}`}
                    onClick={() => onPropertyClick(property.slug)}
                    className="flex-1 rounded-[10px] bg-[#6F3BF6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#5a2fd9]"
                  >
                    View Property Details
                  </button>
                </div>
              </article>
            ))}
      </div>

      {/* Bottom navigation: divider behind arrows */}
      <div className="relative mt-10 flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-[#1D1B1B]" data-testid="divider-line" />
        <div className="relative z-10 flex gap-3 bg-[#09090B] px-4">
          <button
            type="button"
            onClick={goLeft}
            disabled={!canGoLeft}
            aria-label="Previous properties"
            data-testid="prev-arrow"
            className={`flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#1D1B1B] transition-opacity md:h-[44px] md:w-[44px] xl:h-[58px] xl:w-[58px] ${
              canGoLeft
                ? "bg-transparent text-white hover:bg-[#191919]"
                : "cursor-not-allowed bg-transparent text-white opacity-40"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goRight}
            disabled={!canGoRight}
            aria-label="Next properties"
            data-testid="next-arrow"
            className={`flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#1D1B1B] transition-opacity md:h-[44px] md:w-[44px] xl:h-[58px] xl:w-[58px] ${
              canGoRight
                ? "bg-[#191919] text-white hover:bg-[#252525]"
                : "cursor-not-allowed bg-[#191919] text-white opacity-40"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!isLoading && data.length === 0 && (
        <p data-testid="no-properties" className="py-12 text-center text-lg text-[#999999]">
          No properties found
        </p>
      )}

      {/* Error state */}
      {onRetry && data.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <p className="text-lg text-[#999999]">Failed to load properties</p>
          <button
            type="button"
            data-testid="retry-button"
            onClick={onRetry}
            className="mt-4 rounded-[10px] bg-[#6F3BF6] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#5a2fd9]"
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
}