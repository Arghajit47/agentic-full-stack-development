"use client";

import { useEffect, useState } from "react";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulate async data fetch with setTimeout — static mock data, no API calls.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-white font-sans">
      <FeaturedProperties isLoading={loading} />
      <Testimonials isLoading={loading} />
    </div>
  );
}