"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials, type Review } from "@/mocks/testimonials";

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

interface TestimonialsProps {
  data?: Review[];
  isLoading?: boolean;
}

export function Testimonials({
  data = testimonials,
  isLoading = false,
}: TestimonialsProps) {
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
      aria-labelledby="testimonials-heading"
      data-testid="testimonials-section"
      className="mx-auto w-full max-w-[1920px] bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-left">
        <h2
          id="testimonials-heading"
          data-testid="testimonials-heading"
          className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl"
        >
          What Our Clients Say
        </h2>
        <p
          data-testid="testimonials-subheading"
          className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg"
        >
          Real stories from real clients who found their perfect home with us
        </p>
      </div>

      <div
        className={`flex items-center gap-4 ${isMobile ? "justify-end" : "justify-center"}`}
        data-testid="testimonials-carousel"
      >
        <button
          type="button"
          onClick={goLeft}
          disabled={!canGoLeft}
          aria-label="Previous reviews"
          data-testid="testimonials-prev-arrow"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            canGoLeft
              ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-900 text-zinc-600"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="grid flex-1 gap-6"
          style={{ gridTemplateColumns: `repeat(${cardsVisible}, minmax(0, 1fr))` }}
          data-testid="reviews-grid"
        >
          {isLoading
            ? Array.from({ length: cardsVisible }).map((_, i) => (
                <div key={`skeleton-${i}`} data-testid="review-skeleton" className="animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-zinc-800" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-24 rounded bg-zinc-800" />
                      <div className="h-3 w-20 rounded bg-zinc-800" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="h-5 w-5 rounded bg-zinc-800" />
                    ))}
                  </div>
                  <div className="mt-4 h-4 w-full rounded bg-zinc-800" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-zinc-800" />
                </div>
              ))
            : visibleCards.map((review) => (
                <article key={review.id} data-testid="review-card" className="flex flex-col">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.clientAvatarUrl}
                      alt={review.clientName}
                      className="h-14 w-14 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3
                        data-testid={`review-name-${review.id}`}
                        className="font-semibold text-zinc-100"
                      >
                        {review.clientName}
                      </h3>
                      {review.propertyTitle && (
                        <p
                          data-testid={`review-property-${review.id}`}
                          className="text-sm text-zinc-500"
                        >
                          {review.propertyTitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="mt-4 flex gap-0.5"
                    role="img"
                      aria-label={`${review.rating} out of 5 stars`}
                      data-testid={`review-stars-${review.id}`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? "fill-violet-500 text-violet-500" : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    data-testid={`review-text-${review.id}`}
                    className="mt-4 text-sm text-zinc-400"
                  >
                    {review.reviewText}
                  </p>
                </article>
              ))}
        </div>

        <button
          type="button"
          onClick={goRight}
          disabled={!canGoRight}
          aria-label="Next reviews"
          data-testid="testimonials-next-arrow"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            canGoRight
              ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-900 text-zinc-600"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {!isLoading && data.length === 0 && (
        <p data-testid="no-reviews" className="py-12 text-center text-lg text-zinc-400">
          No reviews yet
        </p>
      )}
    </section>
  );
}