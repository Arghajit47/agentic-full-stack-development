import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Services",
  description: "Explore Estatein's property selling, property management, and investment advisory services.",
  openGraph: {
    title: "Services | Estatein",
    description: "Explore Estatein's property selling, property management, and investment advisory services.",
    url: "https://estatein.vercel.app/services",
  },
};
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
