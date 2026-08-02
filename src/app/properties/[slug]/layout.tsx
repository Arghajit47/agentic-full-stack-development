import type { Metadata } from "next";
import prisma from "@/lib/prisma";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      select: { title: true, description: true, imageUrl: true },
    });
    if (property) {
      return {
        title: property.title,
        description: property.description?.slice(0, 155) || `View ${property.title} on Estatein.`,
        openGraph: {
          title: `${property.title} | Estatein`,
          description: property.description?.slice(0, 155) ?? undefined,
          images: property.imageUrl ? [{ url: property.imageUrl, alt: property.title }] : [],
        },
      };
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
