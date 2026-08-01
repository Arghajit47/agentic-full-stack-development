import type { MetadataRoute } from "next";
const BASE_URL = "https://estatein.vercel.app";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/properties`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];
  try {
    const res = await fetch(`${BASE_URL}/api/properties?limit=100`, { next: { revalidate: 86400 } });
    if (res.ok) {
      const json = await res.json();
      const properties: Array<{ slug: string; updatedAt?: string }> = json?.data?.items || json?.items || [];
      const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
        url: `${BASE_URL}/properties/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
      return [...staticRoutes, ...propertyRoutes];
    }
  } catch {
    // return static routes only
  }
  return staticRoutes;
}
