"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedReviews, type FeaturedReview } from "@/lib/api";
import { useMounted } from "@/lib/use-mounted";

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
  data?: FeaturedReview[];
  isLoading?: boolean;
  heading?: string;
  subheading?: string;
}

export function Testimonials({
  data,
  isLoading: isLoadingProp,
  heading = "What Our Clients Say",
  subheading = "Read the success stories and heartfelt testimonials from our valued clients. Discover why they chose Estatein for their real estate needs.",
}: TestimonialsProps) {
  const mounted = useMounted();
  const { data: fetchedData, isLoading: isFetching, error, mutate } = useFeaturedReviews();
  const reviews = useMemo(() => data ?? fetchedData ?? [], [data, fetchedData]);
  const isLoading = isLoadingProp ?? (mounted ? isFetching : true);

  const [startIndex, setStartIndex] = useState(0);
  const cardsVisible = useResponsiveCardCount();

  const visibleCards = useMemo(
    () => reviews.slice(startIndex, startIndex + cardsVisible),
    [reviews, startIndex, cardsVisible]
  );

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + cardsVisible < reviews.length;

  const goLeft = () => canGoLeft && setStartIndex((i) => Math.max(0, i - cardsVisible));
  const goRight = () =>
    canGoRight && setStartIndex((i) => Math.min(reviews.length - cardsVisible, i + cardsVisible));

  return (
    <section
      aria-labelledby="testimonials-heading"
      data-testid="testimonials-section"
      className="mx-auto w-full max-w-[1920px] bg-zinc-950 px-4 py-16 text-zinc-100 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-left">
        <h2
          id="testimonials-heading"
          data-testid="testimonials-heading"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {heading}
        </h2>
        <p
          data-testid="testimonials-subheading"
          className="mt-3 max-w-2xl text-base text-[#999999] sm:text-lg"
        >
          {subheading}
        </p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cardsVisible}, minmax(0, 1fr))` }} data-testid="reviews-grid">
        {isLoading
          ? Array.from({ length: cardsVisible }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                data-testid="review-skeleton"
                className="h-[260px] animate-pulse rounded-xl border border-zinc-800/60 p-6 md:h-[300px] lg:h-[340px]"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-5 w-5 rounded bg-zinc-800" />
                  ))}
                </div>
                <div className="mt-4 h-5 w-40 rounded bg-zinc-800" />
                <div className="mt-4 h-4 w-full rounded bg-zinc-800" />
                <div className="mt-2 h-4 w-3/4 rounded bg-zinc-800" />
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-zinc-800" />
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 rounded bg-zinc-800" />
                    <div className="h-3 w-20 rounded bg-zinc-800" />
                  </div>
                </div>
              </div>
            ))
          : visibleCards.map((review) => (
              <article
                key={review.id}
                data-testid="review-card"
                className="flex h-[260px] flex-col rounded-xl border border-zinc-800/60 p-6 md:h-[300px] lg:h-[340px]"
              >
                <div
                  className="flex gap-0.5"
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                  data-testid={`review-stars-${review.id}`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <h3
                  data-testid={`review-title-${review.id}`}
                  className="mt-4 text-lg font-semibold text-white"
                >
                  {review.reviewTitle ?? "Great Experience"}
                </h3>
                <p
                  data-testid={`review-text-${review.id}`}
                  className="mt-2 line-clamp-3 flex-1 text-sm text-[#999999]"
                >
                  {review.reviewText}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={review.clientAvatarUrl}
                    alt={review.clientName}
                    className="h-14 w-14 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p
                      data-testid={`review-name-${review.id}`}
                      className="review-card-name font-semibold text-white"
                    >
                      {review.clientName}
                    </p>
                    <p
                      data-testid={`review-location-${review.id}`}
                      className="text-sm text-[#666666]"
                    >
                      {review.clientLocation}
                    </p>
                  </div>
                </div>
              </article>
            ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={goLeft}
          disabled={!canGoLeft}
          aria-label="Previous reviews"
          data-testid="testimonials-prev-arrow"
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            canGoLeft
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-900 text-zinc-600"
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
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            canGoRight
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "cursor-not-allowed bg-zinc-900 text-zinc-600"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {!isLoading && reviews.length === 0 && (
        <p data-testid="no-reviews" className="py-12 text-center text-lg text-zinc-400">
          No reviews yet
        </p>
      )}

      {!isLoading && error && (
        <div data-testid="testimonials-error" className="py-12 text-center">
          <p className="text-lg text-zinc-400">Unable to load reviews. Please try again.</p>
          <button
            type="button"
            data-testid="testimonials-retry"
            onClick={() => mutate()}
            className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
}
