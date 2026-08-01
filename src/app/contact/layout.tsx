import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Estatein. Find our offices, send a message, or explore partnership opportunities.",
  openGraph: {
    title: "Contact Us | Estatein",
    description: "Get in touch with Estatein. Find our offices, send a message, or explore partnership opportunities.",
    url: "https://estatein.vercel.app/contact",
  },
};
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
