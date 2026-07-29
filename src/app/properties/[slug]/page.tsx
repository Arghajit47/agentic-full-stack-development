"use client";

import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import {
  PropertyInquiryForm,
  type PropertyInquiryFormData,
} from "@/components/properties/PropertyInquiryForm";
import { type PropertyDetailedInfo } from "@/lib/schemas";

function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950">
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
        <div className="mt-12 h-80 animate-pulse rounded-lg bg-zinc-800" data-testid="property-inquiry-skeleton" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-8" data-testid="property-error-state">
          <h1 className="mb-4 text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mb-6 text-zinc-400">{message}</p>
          <button
            type="button"
            onClick={onRetry}
            data-testid="property-retry-button"
            className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white" data-testid="property-page-title">{data.title}</h1>
          <p className="mt-2 text-lg text-zinc-400">{data.location}</p>
          <p className="mt-4 text-3xl font-bold text-violet-500" data-testid="property-header-price">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(data.price)}
          </p>
        </div>

        {/* Gallery */}
        <PropertyGallery images={data.images} title={data.title} />

        {/* Property Details */}
        <div className="mt-12">
          <PropertyDetails property={data} />
        </div>

        {/* Inquiry Form */}
        <div className="mt-12">
          <PropertyInquiryForm
            propertySlug={data.slug}
            propertyTitle={data.title}
            onSubmit={handleInquirySubmit}
          />
        </div>
      </div>
    </div>
  );
}
