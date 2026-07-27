"use client";

import { OurJourney } from "@/components/about-us/OurJourney";
import { OurValues } from "@/components/about-us/OurValues";
import { OurAchievements } from "@/components/about-us/OurAchievements";

export default function AboutUsPage() {
  return (
    <div data-testid="about-us-page" className="flex flex-1 flex-col bg-zinc-950 font-sans text-zinc-100">
      <OurJourney />
      <OurValues />
      <OurAchievements />
    </div>
  );
}
