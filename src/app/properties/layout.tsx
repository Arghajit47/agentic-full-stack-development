import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Properties",
  description: "Browse Estatein's curated property listings. Filter by type, location, and price to find your dream home.",
  openGraph: {
    title: "Properties | Estatein",
    description: "Browse Estatein's curated property listings.",
    url: "https://estatein.vercel.app/properties",
  },
};
export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
