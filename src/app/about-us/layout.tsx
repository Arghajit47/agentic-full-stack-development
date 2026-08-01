import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Estatein's mission, team, and journey in real estate since 2002.",
  openGraph: {
    title: "About Us | Estatein",
    description: "Learn about Estatein's mission, team, and journey in real estate since 2002.",
    url: "https://estatein.vercel.app/about-us",
  },
};
export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
