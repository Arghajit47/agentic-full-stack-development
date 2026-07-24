import {
  type ApiResponse,
  type FooterData,
  type HeroContentData,
  type HeroCta,
  type HeroFeature,
  type HeroStat,
  type NavigationData,
  type NavigationLink,
  type NewsletterInput,
  type NewsletterResponse,
  newsletterSchema,
} from "./api-types";

export type {
  ApiResponse,
  FooterData,
  HeroContentData,
  HeroCta,
  HeroFeature,
  HeroStat,
  NavigationData,
  NavigationLink,
  NewsletterInput,
  NewsletterResponse,
};
export { newsletterSchema };

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const payload: ApiResponse<T> = await res.json();
  if (!res.ok || !payload.success) {
    throw new Error(!payload.success ? payload.error : `Failed to fetch ${url}`);
  }
  return payload.data;
}

export const subscribeNewsletter = async (
  input: NewsletterInput,
): Promise<{ data: NewsletterResponse; message: string }> => {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await res.json()) as ApiResponse<NewsletterResponse>;
  if (!res.ok || !payload.success) {
    throw new Error(!payload.success ? payload.error : "Subscription failed");
  }
  return { data: payload.data, message: payload.message ?? "Subscribed successfully" };
};

// ponytail: using basic useSWR with same fetcher; no global provider needed.
import useSWR from "swr";

const isBrowser = typeof window !== "undefined";

export function useNavigation() {
  return useSWR<NavigationData, Error>(isBrowser ? "/api/navigation" : null, fetcher, {
    revalidateOnFocus: false,
  });
}

export function useFooter() {
  return useSWR<FooterData, Error>(isBrowser ? "/api/footer" : null, fetcher, {
    revalidateOnFocus: false,
  });
}

export function useHero() {
  return useSWR<HeroContentData, Error>(isBrowser ? "/api/hero" : null, fetcher, {
    revalidateOnFocus: false,
  });
}
