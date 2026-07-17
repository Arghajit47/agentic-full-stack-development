"use client";

import { useEffect, useState } from "react";
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

interface HomeData {
  properties: Property[];
  reviews: Review[];
  settings: Settings;
}

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: boolean;
    data: HomeData;
  }>({
    isLoading: true,
    error: false,
    data: { properties: [], reviews: [], settings: {} },
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
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

        if (!cancelled) {
          setState({ isLoading: false, error: false, data: { properties, reviews, settings } });
        }
      } catch (err) {
        console.error("[Home] fetch error:", err);
        if (!cancelled) {
          setState((prev) => ({ ...prev, isLoading: false, error: true }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-950 px-4 py-24 text-center text-zinc-100">
        <p data-testid="home-error">Unable to load properties. Please try again later.</p>
      </div>
    );
  }

  const { properties, reviews, settings } = state.data;

  return (
    <div className="flex flex-col flex-1 bg-zinc-950 font-sans text-zinc-100">
      <FeaturedProperties
        data={properties}
        isLoading={state.isLoading}
        heading={settings.properties_heading}
        subheading={settings.properties_subheading}
      />
      <Testimonials
        data={reviews}
        isLoading={state.isLoading}
        heading={settings.reviews_heading}
        subheading={settings.reviews_subheading}
      />
    </div>
  );
}
