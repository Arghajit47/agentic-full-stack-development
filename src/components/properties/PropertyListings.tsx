"use client";

import { PropertyCard } from "./PropertyCard";
import { type Property } from "@/mocks/properties-listings";

interface PropertyListingsProps {
  properties: Property[];
  isLoading: boolean;
  onPropertyClick?: (slug: string) => void;
}

export function PropertyListings({
  properties,
  isLoading,
  onPropertyClick,
}: PropertyListingsProps) {
  if (isLoading) {
    return (
      <div
        data-testid="property-grid-loading"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            data-testid="property-skeleton"
            className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 animate-pulse"
          >
            <div className="aspect-[4/3] w-full rounded-lg bg-zinc-800" />
            <div className="mt-4 h-4 w-1/3 rounded bg-zinc-800" />
            <div className="mt-2 h-6 w-3/4 rounded bg-zinc-800" />
            <div className="mt-2 h-4 w-full rounded bg-zinc-800" />
            <div className="mt-4 flex gap-4 border-t border-zinc-800/80 pt-4">
              <div className="h-4 w-12 rounded bg-zinc-800" />
              <div className="h-4 w-12 rounded bg-zinc-800" />
              <div className="h-4 w-16 rounded bg-zinc-800" />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-8 rounded bg-zinc-800" />
                <div className="h-5 w-24 rounded bg-zinc-800" />
              </div>
              <div className="h-10 w-28 rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div
        data-testid="no-properties"
        className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/10 py-16 text-center"
      >
        <p className="text-lg font-medium text-zinc-300">No properties found</p>
        <p className="mt-1 text-sm text-zinc-500">
          Try adjusting your keywords or changing your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="property-grid"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onPropertyClick={onPropertyClick}
        />
      ))}
    </div>
  );
}
