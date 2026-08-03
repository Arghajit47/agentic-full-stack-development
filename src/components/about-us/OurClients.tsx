"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ClientCard } from "./ClientCard";
import type { OurClientsContent } from "@/lib/types/our-clients";

interface OurClientsProps {
  data: OurClientsContent;
}

function useResponsiveCardCount() {
  const [count, setCount] = useState(2);
  useEffect(() => {
    const update = () => {
      setCount(window.innerWidth >= 1024 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export function OurClients({ data }: OurClientsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const cardsVisible = useResponsiveCardCount();
  const isPausedRef = useRef(false);
  const clients = data.testimonials;

  const visibleCards = useMemo(
    () => clients.slice(startIndex, startIndex + cardsVisible),
    [clients, startIndex, cardsVisible]
  );

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + cardsVisible < clients.length;

  const goLeft = () => canGoLeft && setStartIndex((i) => Math.max(0, i - cardsVisible));
  const goRight = () =>
    canGoRight && setStartIndex((i) => Math.min(clients.length - cardsVisible, i + cardsVisible));

  const totalPages = useMemo(
    () => (clients.length > 0 ? Math.ceil(clients.length / cardsVisible) : 0),
    [clients.length, cardsVisible]
  );
  const currentPage = useMemo(
    () => Math.floor(startIndex / cardsVisible),
    [startIndex, cardsVisible]
  );

  // Auto-advance every 4s; wraps to the beginning when at the last page
  useEffect(() => {
    if (clients.length <= cardsVisible) return;
    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      setStartIndex((i) => {
        const next = i + cardsVisible;
        return next >= clients.length ? 0 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [clients.length, cardsVisible]);

  return (
    <section
      aria-labelledby="our-clients-heading"
      data-testid="our-clients-section"
      className="bg-zinc-950"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <div className="mx-auto max-w-[1920px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="max-w-4xl">
          <h2
            id="our-clients-heading"
            data-testid="our-clients-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {data.heading}
          </h2>
          <p
            data-testid="our-clients-subheading"
            className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg"
          >
            {data.subheading}
          </p>
        </div>

        <div
          data-testid="our-clients-grid"
          className="mt-10 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-2 lg:gap-8 xl:gap-12"
          style={{ gridTemplateColumns: `repeat(${cardsVisible}, minmax(0, 1fr))` }}
        >
          {visibleCards.map((client) => (
            <ClientCard key={client.company} client={client} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goLeft}
              disabled={!canGoLeft}
              aria-label="Previous clients"
              data-testid="clients-prev-arrow"
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                canGoLeft
                  ? "border-[#383737] bg-[#262626] text-white hover:bg-zinc-700"
                  : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2" data-testid="clients-nav-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span
                  key={i}
                  data-testid={`clients-nav-dot-${i}`}
                  className={`block h-2 w-2 rounded-full ${
                    i === currentPage ? "bg-[#703BF7]" : "border border-[#383737] bg-transparent"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goRight}
              disabled={!canGoRight}
              aria-label="Next clients"
              data-testid="clients-next-arrow"
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                canGoRight
                  ? "border-[#383737] bg-[#262626] text-white hover:bg-zinc-700"
                  : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
