"use client";

import React, { useState } from "react";

interface SearchFilterBarProps {
  heading?: string;
  subheading?: string;
  onSearch: (query: string, type: string) => void;
  initialQuery?: string;
  initialType?: string;
}

export function SearchFilterBar({
  heading = "Find Your Dream Property",
  subheading = "Browse through our handpicked selection of luxury villas, mansions, and estates designed to fulfill your every dream.",
  onSearch,
  initialQuery = "",
  initialType = "All"
}: SearchFilterBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, type);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setType(selectedType);
    onSearch(query, selectedType);
  };

  return (
    <div className="relative mx-auto w-full max-w-[1920px]">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-b from-zinc-200 to-white px-4 py-16 text-zinc-900 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl">
          <h1
            data-testid="properties-page-heading"
            className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl"
          >
            Find Your Dream Property
          </h1>
          <p
            data-testid="properties-page-subheading"
            className="mt-4 text-base text-zinc-600 sm:text-lg"
          >
            Browse through our handpicked selection of luxury villas, mansions, and estates designed to fulfill your every dream.
          </p>
        </div>
      </div>

      {/* Search Container - Overlapping Banner */}
      <div className="relative z-10 flex justify-center px-4 sm:px-6 lg:px-8 -mt-12">
        <form
          onSubmit={handleSubmit}
          data-testid="search-filter-form"
          className="flex w-full max-w-4xl flex-col gap-4 rounded-xl bg-zinc-800 p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-6 shadow-2xl shadow-black/50"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search For A Property"
              data-testid="search-input"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 px-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          <div className="w-full lg:w-48">
            <select
              value={type}
              onChange={handleTypeChange}
              data-testid="property-type-filter"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 px-4 text-sm text-white outline-none focus:border-violet-600 transition-colors appearance-none cursor-pointer property-select"
            >
              <option value="All" className="bg-zinc-900">All Types</option>
              <option value="Villa" className="bg-zinc-900">Villa</option>
              <option value="Mansion" className="bg-zinc-900">Mansion</option>
              <option value="Cottage" className="bg-zinc-900">Cottage</option>
              <option value="Estate" className="bg-zinc-900">Estate</option>
              <option value="House" className="bg-zinc-900">House</option>
            </select>
          </div>

          <button
            type="submit"
            data-testid="search-submit-btn"
            className="rounded-lg bg-violet-600 py-3 px-6 text-sm font-semibold text-white hover:bg-violet-500 active:bg-violet-700 transition-colors flex items-center justify-center gap-2"
          >
            <span style={{ fontSize: '14px' }}>Find Property</span>
          </button>
        </form>
      </div>
    </div>
  );
}
