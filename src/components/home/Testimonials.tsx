"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { type Review } from "@/mocks/testimonials";

function useResponsiveCardCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(3);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

interface TestimonialsProps {
  data?: Review[];
  isLoading?: boolean;
  heading?: string;
  subheading?: string;
  onRetry?: () => void;
}

export function Testimonials({
  data = [],
  isLoading = false,
  heading = "What Our Clients Say",
  subheading = "Read the success stories and heartfelt testimonials from our valued clients. Discover why they chose Estatein for their real estate needs.",
  onRetry,
}: TestimonialsProps) {
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
      aria-labelledby="testimonials-heading"
      data-testid="testimonials-section"
      className="mx-auto w-full max-w-[1920px] px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-10 text-left">
        <h2
          id="testimonials-heading"
          data-testid="testimonials-heading"
          className="text-[18px] font-semibold text-white md:text-[20px] xl:text-[24px]"
        >
          {heading}
        </h2>
        <p
          data-testid="testimonials-subheading"
          className="mt-3 max-w-2xl text-[14px] font-medium text-[#999999] md:text-[16px] xl:text-[18px]"
        >
          {subheading}
        </p>
      </div>

      {/* Card grid */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${cardsVisible}, minmax(0, 1fr))` }}
        data-testid="reviews-grid"
      >
        {isLoading
          ? Array.from({ length: cardsVisible }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                data-testid="review-skeleton"
                className="flex animate-pulse flex-col rounded-[12px] border border-[#1D1B1B] bg-[#141414] p-5 lg:rounded-[12px] md:rounded-[10px]"
              >
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-11 w-11 rounded-full bg-[#1D1B1B]" />
                  ))}
                </div>
                <div className="mt-4 h-6 w-32 rounded bg-[#1D1B1B]" />
                <div className="mt-3 h-4 w-full rounded bg-[#1D1B1B]" />
                <div className="mt-2 h-4 w-3/4 rounded bg-[#1D1B1B]" />
              </div>
            ))
          : visibleCards.map((review) => (
              <article
                key={review.id}
                data-testid="review-card"
                tabIndex={0}
                className="flex flex-col rounded-[10px] border border-[#1D1B1B] bg-[#141414] p-5 focus:outline-none focus:ring-2 focus:ring-[#6F3BF6] xl:rounded-[12px]"
              >
                {/* Star rating row */}
                <div
                  className="flex gap-2"
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                  data-testid={`review-stars-${review.id}`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1D1B1B] bg-[#191919]"
                    >
                      <Star
                        className="h-6 w-6"
                        style={i < review.rating ? { fill: "#FFE500", color: "#FFE500" } : { color: "#444" }}
                      />
                    </div>
                  ))}
                </div>
                {/* Review title (use propertyTitle if available) */}
                {review.propertyTitle && (
                  <h3
                    data-testid={`review-title-${review.id}`}
                    className="mt-4 text-[18px] font-semibold text-white md:text-[20px] xl:text-[24px]"
                  >
                    {review.propertyTitle}
                  </h3>
                )}
                {/* Review text in blockquote */}
                <blockquote
                  data-testid={`review-text-${review.id}`}
                  className="mt-3 text-[14px] font-medium text-white md:text-[16px] xl:text-[18px]"
                >
                  {review.reviewText}
                </blockquote>
                {/* Client info row */}
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={review.clientAvatarUrl}
                    alt={review.clientName}
                    className="h-[60px] w-[60px] rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p
                      data-testid={`review-name-${review.id}`}
                      className="text-[16px] font-medium text-white md:text-[18px] xl:text-[20px]"
                    >
                      {review.clientName}
                    </p>
                  </div>
                </div>
              </article>
            ))}
      </div>

      {/* Bottom navigation */}
      <div className="relative mt-10 flex items-center justify-center">
        <div className="absolute inset-x-0 h-px bg-[#1D1B1B]" />
        <div className="relative z-10 flex gap-3 bg-[#09090B] px-4">
          <button
            type="button"
            onClick={goLeft}
            disabled={!canGoLeft}
            aria-label="Previous reviews"
            data-testid="testimonials-prev-arrow"
            className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#1D1B1B] xl:h-[58px] xl:w-[58px] ${
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
            aria-label="Next reviews"
            data-testid="testimonials-next-arrow"
            className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#1D1B1B] xl:h-[58px] xl:w-[58px] ${
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
        <p data-testid="no-reviews" className="py-12 text-center text-lg text-[#999999]">
          No reviews yet
        </p>
      )}

      {/* Error state */}
      {onRetry && data.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <p className="text-lg text-[#999999]">Failed to load reviews</p>
          <button
            type="button"
            data-testid="testimonials-retry-button"
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