"use client";

import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import { MapPin } from "lucide-react";
import { fetcher } from "@/lib/api";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import {
  PricingBreakdown,
  type PricingBreakdownData,
} from "@/components/properties/PricingBreakdown";
import {
  PropertyInquiryForm,
  type PropertyInquiryFormData,
} from "@/components/properties/PropertyInquiryForm";
import { type PropertyDetailedInfo } from "@/lib/schemas";

// ponytail: pricing endpoint uses {success,data,error} envelope; unwrap .data here
class PricingFetchError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "PricingFetchError";
  }
}

async function pricingFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new PricingFetchError(
      payload.error || `Failed to fetch ${url}`,
      res.status,
    );
  }
  const json = await res.json();
  // API returns { success, data, error } envelope — unwrap data
  return (json.data ?? json) as T;
}

function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950" role="status" aria-label="Loading property details...">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-zinc-800" data-testid="property-title-skeleton" />
          <div className="h-6 w-1/3 animate-pulse rounded-lg bg-zinc-800" data-testid="property-location-skeleton" />
          <div className="h-8 w-1/4 animate-pulse rounded-lg bg-zinc-800" data-testid="property-price-skeleton" />
        </div>
        <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-zinc-800" data-testid="property-gallery-skeleton" />
        <div className="mt-12 space-y-6">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-zinc-800" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-40 animate-pulse rounded-xl bg-zinc-800" />
            <div className="h-40 animate-pulse rounded-xl bg-zinc-800" />
            <div className="h-40 animate-pulse rounded-xl bg-zinc-800" />
          </div>
        </div>
        <div className="mt-12 h-80 animate-pulse rounded-lg bg-zinc-800" data-testid="pricing-breakdown-skeleton" />
        <div className="mt-12 h-80 animate-pulse rounded-lg bg-zinc-800" data-testid="property-inquiry-skeleton" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-8" data-testid="property-error-state" role="alert">
          <h1 className="mb-4 text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mb-6 text-zinc-400">{message}</p>
          <button
            type="button"
            onClick={onRetry}
            data-testid="property-retry-button"
            aria-label="Retry loading property details"
            className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function PricingErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-6" data-testid="pricing-error-state" role="alert">
      <h3 className="mb-2 text-lg font-semibold text-white">Pricing unavailable</h3>
      <p className="mb-4 text-zinc-400">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        data-testid="pricing-retry-button"
        aria-label="Retry loading pricing breakdown"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        Retry
      </button>
    </div>
  );
}

function PricingEmptyState() {
  return (
    <div className="rounded-xl bg-zinc-900/50 p-6" data-testid="pricing-empty-state">
      <p className="text-zinc-400">Pricing breakdown is not available for this property.</p>
    </div>
  );
}

function PricingSection({
  slug,
  listingPrice,
}: {
  slug: string;
  listingPrice?: number;
}) {
  const pricingUrl = `/api/properties/${encodeURIComponent(slug)}/pricing`;
  const {
    data: pricingData,
    error: pricingError,
    isLoading: pricingLoading,
    mutate: mutatePricing,
  } = useSWR<PricingBreakdownData, PricingFetchError>(pricingUrl, pricingFetcher, {
    revalidateOnFocus: false,
  });

  if (pricingLoading) {
    return <div className="mt-12 h-80 animate-pulse rounded-lg bg-zinc-800" data-testid="pricing-breakdown-skeleton" role="status" aria-label="Loading pricing breakdown..." />;
  }

  if (pricingError) {
    if (pricingError.status === 404) {
      return <PricingEmptyState />;
    }
    return (
      <PricingErrorState
        message={pricingError.message || "Failed to load pricing breakdown."}
        onRetry={() => mutatePricing()}
      />
    );
  }

  if (!pricingData) {
    return <PricingEmptyState />;
  }

  return <PricingBreakdown data={pricingData} listingPrice={listingPrice} />;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const url = slug ? `/api/properties/${encodeURIComponent(slug)}` : null;

  const { data, error, isLoading, mutate } = useSWR<PropertyDetailedInfo, Error>(url, fetcher, {
    revalidateOnFocus: false,
  });

  const handleInquirySubmit = async (formData: PropertyInquiryFormData & { propertySlug: string }) => {
    const res = await fetch("/api/contact/property", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || "Submission failed");
    }
  };

  if (!slug) {
    notFound();
  }

  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error) {
    return <ErrorState message={error.message || "Failed to load property details."} onRetry={() => mutate()} />;
  }

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Property Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl" data-testid="property-page-title">{data.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-zinc-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <p className="text-sm">{data.location}</p>
            </div>
          </div>
          <div className="sm:shrink-0 sm:text-right">
            <p className="text-sm uppercase tracking-wider text-zinc-500">Price</p>
            <p className="mt-1 text-2xl font-bold text-white" data-testid="property-header-price">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(data.price)}
            </p>
          </div>
        </div>

        {/* Gallery */}
        <PropertyGallery images={data.images} title={data.title} />

        {/* Property Details */}
        <div className="mt-12">
          <PropertyDetails property={data} />
        </div>

        {/* Pricing Breakdown */}
        <div className="mt-12">
          <PricingSection slug={slug} listingPrice={data.price} />
        </div>

        {/* Inquiry Form */}
        <div className="mt-12">
          <PropertyInquiryForm
            propertySlug={data.slug}
            propertyTitle={data.title}
            propertyLocation={data.location}
            onSubmit={handleInquirySubmit}
          />
        </div>
      </div>
    </div>
  );
}
