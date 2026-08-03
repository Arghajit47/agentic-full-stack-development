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
  type ServicesData,
  type ServicesIntro,
  type ServicesQuickLink,
  type ServicesService,
  type ServicesCategory,
  type ServicesBottomCta,
  type Office,
  type GalleryImage,
  FeaturedProperty,
  FeaturedReview,
  newsletterSchema,
} from "./api-types";
import { type AboutUsData } from "./schemas";

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
  ServicesData,
  ServicesIntro,
  ServicesQuickLink,
  ServicesService,
  ServicesCategory,
  ServicesBottomCta,
  AboutUsData,
  Office,
  GalleryImage,
  FeaturedProperty,
  FeaturedReview,
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

export async function rawArrayFetcher<T>(url: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return res.json() as Promise<T[]>;
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

export function useServices() {
  return useSWR<ServicesData, Error>(isBrowser ? "/api/services" : null, fetcher, {
    revalidateOnFocus: false,
  });
}

const DEFAULT_ABOUT_US_DATA: AboutUsData = {
  journey: {
    heading: "Our Journey",
    body: "Our story is one of continuous growth and evolution. We started as a small team with a big vision: to transform the real estate experience for everyone.",
    imageUrl: "/images/about-hero.png",
    stats: [
      { value: "200+", label: "Happy Customers", icon: "Home" },
      { value: "10k+", label: "Properties For Clients", icon: "Home" },
      { value: "16+", label: "Years of Experience", icon: "Home" },
    ],
  },
  values: {
    heading: "Our Values",
    body: "Our values are the foundation of our service and everything we do at Estatein.",
    cards: [
      { title: "Trust", description: "Trust is the cornerstone of every successful real estate transaction.", icon: "ShieldCheck" },
      { title: "Excellence", description: "We strive for excellence in every interaction.", icon: "Star" },
      { title: "Client-Centric", description: "Your needs and goals are our top priority.", icon: "Heart" },
    ],
  },
  achievements: {
    heading: "Our Achievements",
    body: "Our track record speaks for itself, with notable achievements and milestones that reflect our commitment to excellence.",
    cards: [
      { title: "3+ Years of Excellence", description: "With over 3 years in the industry, we've amassed a wealth of knowledge." },
      { title: "Happy Clients", description: "We've helped hundreds of clients find their perfect properties." },
      { title: "Property Portfolio", description: "An extensive portfolio spanning residential and commercial properties." },
    ],
  },
  howItWorks: {
    heading: "Navigating the Estatein Experience",
    body: "At Estatein, we've streamlined the real estate journey for your convenience.",
    steps: [
      { stepNumber: "Step 01", title: "Discover a World of Possibilities", description: "Your journey begins with exploring our carefully curated property listings." },
      { stepNumber: "Step 02", title: "Narrowing Down Your Choices", description: "Once you've discovered your potential dream property, let's narrow down the choices." },
      { stepNumber: "Step 03", title: "Personalized Guidance", description: "With your shortlisted properties in hand, our dedicated agents guide you." },
    ],
  },
  team: {
    heading: "Meet the Estatein Team",
    body: "At Estatein, our success is driven by the dedication and expertise of our team.",
    members: [
      { name: "Max Mitchell", role: "Founder", imageUrl: "/images/team/team-max.jpg", twitterUrl: "https://twitter.com/estatein" },
      { name: "Sarah Johnson", role: "Chief Real Estate Officer", imageUrl: "/images/team/team-sarah.png", twitterUrl: "https://twitter.com/estatein" },
      { name: "David Park", role: "Head of Property Management", imageUrl: "/images/team/team-david.png", twitterUrl: "https://twitter.com/estatein" },
    ],
  },
  clients: {
    heading: "Our Valued Clients",
    subheading: "At Estatein, we have had the privilege of working with a diverse clientele.",
    testimonials: [
      { since: "Since 2019", company: "ABC Corporation", domain: "Commercial Real Estate", category: "Luxury Home Development", quote: "Estatein's expertise in finding the perfect office space for our growing team was outstanding.", websiteUrl: "https://example.com" },
    ],
  },
};

export function useAboutUs() {
  return useSWR<AboutUsData, Error>(isBrowser ? "/api/about-us" : null, fetcher, {
    revalidateOnFocus: false,
    fallbackData: DEFAULT_ABOUT_US_DATA,
  });
}

export function useContactOffices() {
  return useSWR<Office[], Error>(isBrowser ? "/api/offices" : null, fetcher, {
    revalidateOnFocus: false,
  });
}

export function useContactGallery() {
  return useSWR<GalleryImage[], Error>(isBrowser ? "/api/gallery" : null, fetcher, {
    revalidateOnFocus: false,
  });
}

export function useFeaturedProperties() {
  return useSWR<FeaturedProperty[], Error>(isBrowser ? "/api/properties/featured" : null, rawArrayFetcher, {
    revalidateOnFocus: false,
  });
}

export function useFeaturedReviews() {
  return useSWR<FeaturedReview[], Error>(isBrowser ? "/api/reviews/featured" : null, rawArrayFetcher, {
    revalidateOnFocus: false,
  });
}
