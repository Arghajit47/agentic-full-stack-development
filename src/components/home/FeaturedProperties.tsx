"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bed, Bath, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { featuredProperties, type Property } from "@/mocks/featured-properties";

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
}

export function FeaturedProperties({
  data = featuredProperties,
  isLoading = false,
  heading = "Featured Properties",
  subheading = "Explore our handpicked selection of featured properties. Each listing offers a glimpse into exceptional homes and investments available through Estatein.",
  onPropertyClick = (slug: string) => console.log(slug),
}: FeaturedPropertiesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const cardsVisible = useResponsiveCardCount();

  const visibleCards = useMemo(
    () => data.slice(startIndex, startIndex + cardsVisible),
    [data, startIndex, cardsVisible]
  );

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + cardsVisible < data.length;
  const isMobile = cardsVisible === 1;

  const goLeft = () => canGoLeft && setStartIndex((i) => Math.max(0, i - cardsVisible));
  const goRight = () =>
    canGoRight && setStartIndex((i) => Math.min(data.length - cardsVisible, i + cardsVisible));

  return (
    <section
      aria-labelledby="featured-properties-heading"
      data-testid="featured-properties-section"
      className="mx-auto w-full max-w-[1920px] bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-left">
        <h2
          id="featured-properties-heading"
          data-testid="featured-properties-heading"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {heading}
        </h2>
        <p
          data-testid="featured-properties-subheading"
          className="mt-3 max-w-2xl text-base text-[#999999] sm:text-lg"
        >
          {subheading}
        </p>
      </div>

      <div
        className={`flex items-center gap-4 ${isMobile ? "justify-end" : "justify-center"}`}
        data-testid="carousel-container"
      >
        <button
          type="button"
          onClick={goLeft}
          disabled={!canGoLeft}
          aria-label="Previous properties"
          data-testid="prev-arrow"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            canGoLeft
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-900 text-zinc-600"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="grid flex-1 gap-6"
          style={{ gridTemplateColumns: `repeat(${cardsVisible}, minmax(0, 1fr))` }}
          data-testid="property-grid"
        >
          {isLoading
            ? Array.from({ length: cardsVisible }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  data-testid="property-skeleton"
                  className="h-[480px] animate-pulse md:h-[520px] lg:h-[580px] xl:h-[620px]"
                >
                  <div className="aspect-[4/3] w-full bg-zinc-800" />
                  <div className="mt-4 h-5 w-32 rounded bg-zinc-800" />
                  <div className="mt-2 h-4 w-48 rounded bg-zinc-800" />
                  <div className="mt-3 flex gap-4">
                    <div className="h-4 w-16 rounded bg-zinc-800" />
                    <div className="h-4 w-16 rounded bg-zinc-800" />
                    <div className="h-4 w-20 rounded bg-zinc-800" />
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-12 rounded bg-zinc-800" />
                      <div className="h-6 w-32 rounded bg-zinc-800" />
                    </div>
                    <div className="h-10 w-36 rounded bg-zinc-800" />
                  </div>
                </div>
              ))
            : visibleCards.map((property) => (
                <article
                  key={property.id}
                  data-testid="property-card"
                  className="flex h-[480px] flex-col md:h-[520px] lg:h-[580px] xl:h-[620px]"
                >
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="mt-4 flex flex-col">
                    <h3
                      data-testid={`property-title-${property.id}`}
                      className="text-left text-lg font-semibold text-white"
                    >
                      {property.title}
                    </h3>
                    <p
                      data-testid={`property-description-${property.id}`}
                      className="mt-1 line-clamp-2 text-left text-sm text-[#999999]"
                    >
                      {property.description}
                    </p>
                    <div
                      className="mt-3 flex items-center gap-4 text-sm text-[#999999]"
                      data-testid={`property-specs-${property.id}`}
                    >
                      <span className="flex items-center gap-1 text-[#999999]">
                        <Bed className="h-4 w-4 text-[#999999]" />
                        {property.bedrooms} bedrooms
                      </span>
                      <span className="flex items-center gap-1 text-[#999999]">
                        <Bath className="h-4 w-4 text-[#999999]" />
                        {property.bathrooms} bathrooms
                      </span>
                      <span className="flex items-center gap-1 text-[#999999]">
                        <Home className="h-4 w-4 text-[#999999]" />
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between" data-testid={`property-price-${property.id}`}>
                      <div>
                        <p className="text-xs text-[#666666]" data-testid={`price-label-${property.id}`}>
                          Price
                        </p>
                        <p className="text-xl font-bold text-white">
                          {priceFormatter.format(property.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        data-testid={`view-details-${property.id}`}
                        onClick={() => onPropertyClick(property.slug ?? "")}
                        className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                      >
                        View property details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
        </div>

        <button
          type="button"
          onClick={goRight}
          disabled={!canGoRight}
          aria-label="Next properties"
          data-testid="next-arrow"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            canGoRight
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-900 text-zinc-600"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-10 text-left">
        <Link
          href="/properties"
          data-testid="explore-properties-cta"
          className="inline-block rounded-md border border-zinc-700 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Explore Properties
        </Link>
      </div>

      {!isLoading && data.length === 0 && (
        <p data-testid="no-properties" className="py-12 text-center text-lg text-zinc-400">
          No featured properties
        </p>
      )}
    </section>
  );
}
