"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Testimonials } from "@/components/home/Testimonials";
import { Hero, FeatureCards } from "@/components/sections/Hero";
import { useHero } from "@/lib/api";
import { useMounted } from "@/lib/use-mounted";

interface Settings {
  properties_heading?: string;
  properties_subheading?: string;
  reviews_heading?: string;
  reviews_subheading?: string;
}

export default function Home() {
  const mounted = useMounted();
  const router = useRouter();
  const { data: hero, isLoading: heroLoading, error: heroError, mutate: retryHero } = useHero();
  const [settings, setSettings] = useState<Settings>({});

  const handlePropertyClick = (slug: string) => {
    router.push(`/properties/${slug}`);
  };

  // Hydration-safe initial render: server and first client paint must match.
  // After mount, reflect the real SWR loading/error state so the skeleton is shown.
  const heroData = mounted ? hero : null;
  const heroIsLoading = mounted ? heroLoading : false;
  const heroErrorState = mounted ? heroError : null;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Settings) => {
        if (!cancelled) setSettings(data);
      })
      .catch((err) => {
        console.error("[Home] settings fetch error:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-zinc-950 font-sans text-zinc-100">
      <Hero
        hero={heroData}
        isLoading={heroIsLoading}
        error={heroErrorState}
        retry={() => retryHero()}
      />
      <FeatureCards features={heroData?.features} isLoading={heroIsLoading} />
      <FeaturedProperties
        heading={settings.properties_heading}
        subheading={settings.properties_subheading}
        onPropertyClick={handlePropertyClick}
      />
      <Testimonials
        heading={settings.reviews_heading}
        subheading={settings.reviews_subheading}
      />
    </div>
  );
}
