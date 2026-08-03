import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Learn More",
  description: "Learn more about Estatein — your trusted partner in finding the perfect property.",
  openGraph: {
    title: "Learn More | Estatein",
    description: "Learn more about Estatein — your trusted partner in finding the perfect property.",
    url: "https://real-estates-estatein.netlify.app/learn-more",
  },
};
export default function LearnMoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
