"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useNavigation, type NavigationLink } from "@/lib/api";

// Fallback used when API returns empty links or is unavailable.
const fallbackLinks: NavigationLink[] = [
  { id: "fb-home", href: "/", label: "Home", order: 0, isExternal: false },
  { id: "fb-about", href: "/about", label: "About Us", order: 1, isExternal: false },
  { id: "fb-properties", href: "/properties", label: "Properties", order: 2, isExternal: false },
  { id: "fb-services", href: "/services", label: "Services", order: 3, isExternal: false },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Estatein home">
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20V0Z" fill="#7C3AED" />
        <path d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0v40Z" fill="#A78BFA" />
      </svg>
      <span className="text-lg font-semibold text-white tracking-wide">Estatein</span>
    </Link>
  );
}

function BannerSkeleton() {
  return (
    <span className="inline-flex items-center justify-center gap-2" aria-live="polite">
      <Sparkles className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
      <span className="inline-block h-3 w-48 animate-pulse rounded bg-zinc-800" />
      <span className="sr-only">Loading navigation...</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, error, isLoading, mutate } = useNavigation();

  const links = data?.links?.length ? data.links : fallbackLinks;
  const banner = data?.banner;

  return (
    <div className="w-full" data-testid="navbar">
      {/* Top banner */}
      <div className="w-full border-b border-zinc-800/60 bg-zinc-950 px-4 py-2.5 text-center text-xs text-zinc-400 sm:px-6 lg:px-8">
        {isLoading ? (
          <BannerSkeleton />
        ) : error ? (
          <span className="inline-flex items-center justify-center gap-3">
            <span>Unable to load banner. </span>
            <button
              type="button"
              onClick={() => mutate()}
              className="font-medium text-white underline underline-offset-2 hover:text-violet-300"
            >
              Retry
            </button>
          </span>
        ) : banner ? (
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
            <span>{banner.text}</span>
            <Link
              href={banner.ctaHref}
              className="font-medium text-white underline underline-offset-2 hover:text-violet-300"
            >
              {banner.cta}
            </Link>
          </span>
        ) : (
          <BannerSkeleton />
        )}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900/60 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {isLoading ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block h-8 w-20 animate-pulse rounded-full bg-zinc-800"
                  />
                ))}
              </div>
            ) : (
              links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.id ?? link.href}
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                      active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })
            )}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            data-testid="mobile-menu-button"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div
            id="mobile-nav"
            className="border-t border-zinc-900/60 bg-zinc-950 px-4 py-4 md:hidden"
            data-testid="mobile-nav"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="inline-block h-10 rounded-lg bg-zinc-800" />
                ))
              ) : (
                links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.id ?? link.href}
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })
              )}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
