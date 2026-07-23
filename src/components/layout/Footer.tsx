"use client";

import Link from "next/link";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { useFooter, newsletterSchema, subscribeNewsletter } from "@/lib/api";

const socialLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    path: "M24 12.07C24 5.66 18.63.33 12.23.33S.46 5.66.46 12.07c0 5.96 4.35 10.91 10.07 11.82v-8.36H7.5v-3.46h2.91V9.41c0-2.88 1.71-4.47 4.34-4.47 1.26 0 2.57.22 2.57.22v2.83h-1.45c-1.43 0-1.87.89-1.87 1.8v2.16h3.18l-.51 3.46h-2.67v8.36C19.65 22.98 24 18.03 24 12.07z",
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    path: "M20.45 20.45h-3.48v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.5V9h3.34v1.55h.05c.46-.88 1.6-1.8 3.3-1.8 3.52 0 4.17 2.32 4.17 5.34v6.36zM5.34 7.43a2.02 2.02 0 1 1 0-4.04 2.02 2.02 0 0 1 0 4.04zM7.09 20.45H3.6V9h3.49v11.45zM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46A1.77 1.77 0 0 0 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0z",
  },
  {
    href: "https://twitter.com",
    label: "Twitter",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23zm-1.16 17.52h1.84L7.08 4.13H5.12l12.96 15.64z",
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    path: "M23.5 6.19a3.02 3.02 0 0 0-2.13-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.55A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.13 2.14c1.87.55 9.37.55 9.37.55s7.5 0 9.37-.55a3.02 3.02 0 0 0 2.13-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.81zM9.55 15.5V8.5l6.27 3.5-6.27 3.5z",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { data, isLoading, error } = useFooter();

  const cta = data?.cta;
  const newsletter = data?.newsletter;
  const bottom = data?.bottom;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    try {
      const result = await subscribeNewsletter(parsed.data);
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="w-full bg-zinc-950" data-testid="footer">
      {/* Top CTA */}
      <div className="border-t border-zinc-900/60 px-4 py-12 sm:px-6 md:py-16 lg:px-8 xl:px-12">
        <div className="mx-auto flex max-w-[1920px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            {isLoading ? (
              <div className="space-y-3">
                <span className="inline-block h-8 w-3/4 animate-pulse rounded bg-zinc-800" />
                <span className="inline-block h-24 w-full animate-pulse rounded bg-zinc-800" />
              </div>
            ) : error ? (
              <p className="text-sm text-red-400">Failed to load footer content. Please refresh the page.</p>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                  {cta?.title ?? "Start Your Real Estate Journey Today"}
                </h2>
                <p className="mt-3 text-sm text-zinc-400 sm:text-base">
                  {cta?.body ??
                    "Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Estatein is here to assist you every step of the way."}
                </p>
              </>
            )}
          </div>
          {isLoading ? (
            <span className="inline-block h-12 w-40 animate-pulse rounded-xl bg-zinc-800" />
          ) : error ? null : (
            <Link
              href={cta?.ctaHref ?? "/properties"}
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              {cta?.ctaText ?? "Explore Properties"}
            </Link>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-zinc-900/60 px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <form
          className="mx-auto flex max-w-[1920px] flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={handleSubmit}
          aria-label="Newsletter signup"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-zinc-950 px-4 py-3 ring-1 ring-zinc-800">
            <Mail className="h-5 w-5 shrink-0 text-zinc-500" aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletter?.placeholder ?? "Enter Your Email"}
              className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              aria-label="Email address"
              disabled={status === "loading"}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 p-3 text-white transition-colors hover:bg-zinc-800 sm:px-6 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Subscribe"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Send className="h-5 w-5 sm:hidden" aria-hidden="true" />
                <span className="hidden text-sm font-medium sm:inline">Subscribe</span>
              </>
            )}
          </button>
        </form>
        {message && (
          <p
            className={`mx-auto mt-2 max-w-[1920px] text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
            role={status === "error" ? "alert" : "status"}
            data-testid="newsletter-message"
          >
            {message}
          </p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900/60 px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 sm:gap-6">
            <span>{bottom?.copyright ?? "©2024 Estatein. All Rights Reserved."}</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              {bottom?.legalText ?? "Terms & Conditions"}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, path }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                aria-label={label}
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d={path} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
