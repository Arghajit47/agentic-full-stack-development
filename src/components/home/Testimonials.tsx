import { Star } from "lucide-react";
import { testimonials, type Review } from "@/mocks/testimonials";

interface TestimonialsProps {
  reviews?: Review[];
  isLoading?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-zinc-300"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article data-testid="review-card" className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-md ring-1 ring-zinc-200">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.clientAvatarUrl}
          alt={review.clientName}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-zinc-100"
          loading="lazy"
        />
        <div className="flex flex-col">
          <span className="text-base font-semibold text-zinc-900">
            {review.clientName}
          </span>
          {review.propertyTitle && (
            <span className="text-sm text-zinc-400">{review.propertyTitle}</span>
          )}
        </div>
      </div>
      <StarRating rating={review.rating} />
      <p className="text-sm leading-relaxed text-zinc-600">&ldquo;{review.reviewText}&rdquo;</p>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow-md ring-1 ring-zinc-200">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-zinc-200" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded bg-zinc-200" />
          <div className="h-3 w-20 rounded bg-zinc-200" />
        </div>
      </div>
      <div className="mt-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-5 w-5 rounded bg-zinc-200" />
        ))}
      </div>
      <div className="mt-4 h-4 w-full rounded bg-zinc-200" />
      <div className="mt-2 h-4 w-3/4 rounded bg-zinc-200" />
    </div>
  );
}

export default function Testimonials({
  reviews = testimonials,
  isLoading = false,
}: TestimonialsProps) {
  const loading = isLoading;

  return (
    <section
      aria-labelledby="testimonials-heading"
      data-testid="testimonials-section"
      className="mx-auto w-full max-w-[1920px] bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-center">
        <h2
          id="testimonials-heading"
          className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl"
        >
          What Our Clients Say
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500 sm:text-lg">
          Real stories from real clients who found their perfect home with us.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p data-testid="no-reviews" className="py-12 text-center text-lg text-zinc-500">No reviews yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}