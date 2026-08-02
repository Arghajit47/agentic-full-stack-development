import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for Estatein - real estate services and platform usage terms.",
  openGraph: {
    title: "Terms of Use | Estatein",
    description: "Terms of Use for Estatein - real estate services and platform usage terms.",
    url: "https://estatein.vercel.app/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
