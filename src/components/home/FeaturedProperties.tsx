import { Bed, Bath, Maximize, MapPin, ArrowRight } from "lucide-react";
import { featuredProperties, type Property } from "@/mocks/featured-properties";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface FeaturedPropertiesProps {
  properties?: Property[];
  isLoading?: boolean;
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <article data-testid="property-card" className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-zinc-200 transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.imageUrl}
          alt={property.title}
          width={600}
          height={450}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-zinc-900">{property.title}</h3>
          <span className="shrink-0 text-lg font-bold text-indigo-600">
            {priceFormatter.format(property.price)}
          </span>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-zinc-500">
          <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
          {property.location}
        </p>
        <div className="mt-auto flex items-center gap-4 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
          <span className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-zinc-400" />
            {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-zinc-400" />
            {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-zinc-400" />
            {property.areaSqft.toLocaleString("en-US")} sqft
          </span>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-zinc-200">
      <div className="aspect-[4/3] w-full bg-zinc-200" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-zinc-200" />
          <div className="h-5 w-20 rounded bg-zinc-200" />
        </div>
        <div className="h-4 w-24 rounded bg-zinc-200" />
        <div className="flex gap-4 pt-4">
          <div className="h-4 w-16 rounded bg-zinc-200" />
          <div className="h-4 w-16 rounded bg-zinc-200" />
          <div className="h-4 w-20 rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProperties({
  properties = featuredProperties,
  isLoading = false,
}: FeaturedPropertiesProps) {
  const loading = isLoading;

  return (
    <section
      aria-labelledby="featured-properties-heading"
      data-testid="featured-properties-section"
      className="mx-auto w-full max-w-[1920px] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-10 text-center">
        <h2
          id="featured-properties-heading"
          className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl"
        >
          Featured Properties
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-500 sm:text-lg">
          Discover our handpicked selection of premium properties available right now.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p data-testid="no-properties" className="py-12 text-center text-lg text-zinc-500">No properties found</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="mt-12 text-center">
          <button
            type="button"
            data-testid="explore-properties-cta"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Explore Properties
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}