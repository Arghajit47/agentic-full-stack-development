import type { Metadata } from "next";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://estatein.vercel.app";
  try {
    const res = await fetch(`${baseUrl}/api/properties/${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      const property = json?.data;
      if (property) {
        return {
          title: property.title,
          description: (property.description as string)?.slice(0, 155) || `View ${property.title} on Estatein.`,
          openGraph: {
            title: `${property.title} | Estatein`,
            description: (property.description as string)?.slice(0, 155),
            url: `https://estatein.vercel.app/properties/${slug}`,
            images: property.imageUrl ? [{ url: property.imageUrl as string, alt: property.title as string }] : [],
          },
        };
      }
    }
  } catch {
    // fallback below
  }
  return {
    title: "Property Details",
    description: "View property details on Estatein.",
  };
}
export default function PropertySlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
