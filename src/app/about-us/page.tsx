"use client";

import { OurJourney } from "@/components/about-us/OurJourney";
import { OurValues } from "@/components/about-us/OurValues";
import { OurAchievements } from "@/components/about-us/OurAchievements";
import { useAboutUs } from "@/lib/api";

export default function AboutUsPage() {
  const { data, error, isLoading, mutate } = useAboutUs();

  if (isLoading) {
    return (
      <div data-testid="about-us-loading" className="flex flex-1 flex-col bg-zinc-950 font-sans text-zinc-100">
        <div className="mx-auto grid max-w-[1920px] flex-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6 lg:px-8 xl:px-12">
          <div className="order-2 space-y-4 md:order-1">
            <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="h-24 max-w-2xl animate-pulse rounded bg-zinc-800" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-800" />
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-zinc-800 md:aspect-square" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="about-us-error" className="flex flex-1 flex-col items-center justify-center bg-zinc-950 px-4 text-center font-sans text-zinc-100">
        <h2 className="text-2xl font-semibold text-white">Unable to load About Us</h2>
        <p className="mt-2 text-zinc-400">{error.message}</p>
        <button
          onClick={() => void mutate()}
          className="mt-6 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400"
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div data-testid="about-us-empty" className="flex flex-1 flex-col items-center justify-center bg-zinc-950 px-4 text-center font-sans text-zinc-100">
        <h2 className="text-2xl font-semibold text-white">No About Us content available</h2>
        <p className="mt-2 text-zinc-400">Check back later.</p>
      </div>
    );
  }

  return (
    <div data-testid="about-us-page" className="flex flex-1 flex-col bg-zinc-950 font-sans text-zinc-100">
      <OurJourney data={data.journey} />
      <OurValues data={data.values} />
      <OurAchievements data={data.achievements} />
    </div>
  );
}
