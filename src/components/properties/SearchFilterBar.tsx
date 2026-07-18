"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchFilterBarProps {
  heading?: string;
  subheading?: string;
  onSearch: (query: string, type: string) => void;
  initialQuery?: string;
  initialType?: string;
}

export function SearchFilterBar({
  heading = "Discover a World of Possibilities",
  subheading = "Our portfolio of properties is designed to fulfill every dream. Browse through our handpicked selection of villas, mansions, cottages, and family estates.",
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
    <div className="mx-auto w-full max-w-[1920px] bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl text-left">
        <h1
          data-testid="properties-page-heading"
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {heading}
        </h1>
        <p
          data-testid="properties-page-subheading"
          className="mt-3 text-base text-zinc-400 sm:text-lg"
        >
          {subheading}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        data-testid="search-filter-form"
        className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search For A Property"
            data-testid="search-input"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-600 transition-colors"
          />
        </div>

        <div className="w-full lg:w-48">
          <select
            value={type}
            onChange={handleTypeChange}
            data-testid="property-type-filter"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-3 px-4 text-sm text-white outline-none focus:border-violet-600 transition-colors appearance-none cursor-pointer property-select"
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
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
