"use client";

import React, { useState } from "react";

interface SearchFilterBarProps {
  heading?: string;
  subheading?: string;
  onSearch: (query: string, type: string) => void;
  initialQuery?: string;
}

export function SearchFilterBar({
  heading = "Find Your Dream Property",
  subheading = "Welcome to Estatein, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life. With categories to suit every dreamer, your journey ",
  onSearch,
  initialQuery = "",
}: SearchFilterBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, "All");
  };

  return (
    <div className="relative mx-auto w-full max-w-[1920px]">
      {/* Banner Section */}
      <div data-testid="search-banner" className="relative bg-[#141414] px-4 py-16 text-white sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="relative mx-auto max-w-3xl">
          <h1
            data-testid="properties-page-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {heading}
          </h1>
          <p
            data-testid="properties-page-subheading"
            className="mt-4 text-base text-zinc-400 sm:text-lg"
          >
            {subheading}
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
              placeholder="Search Properties"
              data-testid="search-input"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-3 px-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-600 transition-colors"
            />
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
