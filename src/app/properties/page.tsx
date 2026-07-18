"use client";

import { useState, useEffect, useMemo } from "react";
import { SearchFilterBar } from "@/components/properties/SearchFilterBar";
import { PropertyListings } from "@/components/properties/PropertyListings";
import { Pagination } from "@/components/properties/Pagination";
import { propertiesListings } from "@/mocks/properties-listings";

const ITEMS_PER_PAGE = 6;

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Trigger loading skeleton state on mount and when query/filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // 600ms simulation
    return () => clearTimeout(timer);
  }, [searchQuery, propertyType, currentPage]);

  const handleSearch = (query: string, type: string) => {
    setSearchQuery(query);
    setPropertyType(type);
    setCurrentPage(1); // Reset page to 1 on filter
  };

  // Filtered properties logic
  const filteredProperties = useMemo(() => {
    return propertiesListings.filter((property) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        propertyType === "All" ||
        property.propertyType.toLowerCase() === propertyType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [searchQuery, propertyType]);

  // Paginated properties logic
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

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
        <PropertyListings
          properties={paginatedProperties}
          isLoading={isLoading}
          onPropertyClick={handlePropertyClick}
        />
        
        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
