"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SearchFilterBar } from "@/components/properties/SearchFilterBar";
import { PropertyListings } from "@/components/properties/PropertyListings";
import { Pagination } from "@/components/properties/Pagination";
import { type Property } from "@/mocks/properties-listings";

const ITEMS_PER_PAGE = 6;
const DEBOUNCE_MS = 300;

// API response shape from GET /api/properties (KAN-10)
interface PropertiesApiResponse {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

// Map a raw API row to the Property type components expect
function toProperty(row: Record<string, unknown>): Property {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    price: row.price as number,
    location: row.location as string,
    bedrooms: row.bedrooms as number,
    bathrooms: row.bathrooms as number,
    propertyType: row.propertyType as Property["propertyType"],
    imageUrl: row.imageUrl as string,
    area: `${(row.areaSqft as number).toLocaleString("en-US")} sq ft`,
  };
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch from real API ──────────────────────────────────────────────────
  const fetchProperties = useCallback(
    async (query: string, type: string, page: number) => {
      const params = new URLSearchParams({
        search: query,
        type,
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
      });

      try {
        const res = await fetch(`/api/properties?${params.toString()}`);

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        setApiError(null);
        const json: PropertiesApiResponse = await res.json();
        setProperties(json.items.map(toProperty));
        setTotalItems(json.total);
      } catch (err) {
        console.error("[PropertiesPage] fetch error:", err);
        setApiError("Unable to load properties. Please try again later.");
        setProperties([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Initial load — inline fetch to avoid setState-in-effect lint
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      search: "",
      type: "All",
      page: "1",
      limit: String(ITEMS_PER_PAGE),
    });

    fetch(`/api/properties?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json() as Promise<PropertiesApiResponse>;
      })
      .then((json) => {
        if (cancelled) return;
        setProperties(json.items.map(toProperty));
        setTotalItems(json.total);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[PropertiesPage] initial fetch error:", err);
        setApiError("Unable to load properties. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Search handler (debounced 300ms per AC) ──────────────────────────────
  const handleSearch = useCallback(
    (query: string, type: string) => {
      setSearchQuery(query);
      setPropertyType(type);
      setCurrentPage(1);
      setIsLoading(true);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchProperties(query, type, 1);
      }, DEBOUNCE_MS);
    },
    [fetchProperties],
  );

  // ─── Pagination handler ───────────────────────────────────────────────────
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setIsLoading(true);
      fetchProperties(searchQuery, propertyType, page);
    },
    [fetchProperties, searchQuery, propertyType],
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const handlePropertyClick = (slug: string) => {
    console.log("Viewing property:", slug);
  };

  return (
    <main
      data-testid="properties-page-main"
      className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100"
    >
      <SearchFilterBar
        onSearch={handleSearch}
        initialQuery={searchQuery}
        initialType={propertyType}
      />

      <div className="mx-auto w-full max-w-[1920px] flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        {apiError ? (
          <div
            data-testid="api-error"
            className="py-20 text-center text-zinc-400"
          >
            {apiError}
          </div>
        ) : (
          <>
            <PropertyListings
              properties={properties}
              isLoading={isLoading}
              onPropertyClick={handlePropertyClick}
            />

            {!isLoading && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}