"use client";

import { useEffect, useState, useCallback } from "react";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Testimonials } from "@/components/home/Testimonials";
import { type Property } from "@/mocks/featured-properties";
import { type Review } from "@/mocks/testimonials";

interface Settings {
  properties_heading?: string;
  properties_subheading?: string;
  reviews_heading?: string;
  reviews_subheading?: string;
}

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: boolean;
    properties: Property[];
    reviews: Review[];
    settings: Settings;
  }>({
    isLoading: true,
    error: false,
    properties: [],
    reviews: [],
    settings: {},
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: false }));
    try {
      const [propertiesRes, reviewsRes, settingsRes] = await Promise.all([
        fetch("/api/properties/featured", { cache: "no-store" }),
        fetch("/api/reviews/featured", { cache: "no-store" }),
        fetch("/api/settings", { cache: "no-store" }),
      ]);

      if (!propertiesRes.ok || !reviewsRes.ok || !settingsRes.ok) {
        throw new Error("Failed to fetch home page data");
      }

      const [properties, reviews, settings] = await Promise.all([
        propertiesRes.json() as Promise<Property[]>,
        reviewsRes.json() as Promise<Review[]>,
        settingsRes.json() as Promise<Settings>,
      ]);

      setState({ isLoading: false, error: false, properties, reviews, settings });
    } catch (err) {
      console.error("[Home] fetch error:", err);
      setState((prev) => ({ ...prev, isLoading: false, error: true }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#09090B] px-4 py-24 text-center text-zinc-100">
        <div>
          <p data-testid="home-error" className="text-lg text-[#999999]">Unable to load content. Please try again later.</p>
          <button
            type="button"
            data-testid="home-retry"
            onClick={load}
            className="mt-4 rounded-[10px] bg-[#6F3BF6] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#5a2fd9]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { properties, reviews, settings } = state;

  return (
    <div className="flex flex-col flex-1 bg-[#09090B] font-sans text-zinc-100">
      <FeaturedProperties
        data={properties}
        isLoading={state.isLoading}
        heading={settings.properties_heading}
        subheading={settings.properties_subheading}
        onRetry={load}
      />
      <Testimonials
        data={reviews}
        isLoading={state.isLoading}
        heading={settings.reviews_heading}
        subheading={settings.reviews_subheading}
        onRetry={load}
      />
    </div>
  );
}