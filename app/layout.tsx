import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growthu.vercel.app";

export const metadata: Metadata = {
  title: "GrowthU | Strategy in Motion. Content with Purpose.",
  description: "GrowthU builds strategic social media and content systems designed to turn attention into measurable business growth.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "GrowthU | Turn attention into growth.",
    description: "Strategy, creative content and consistent execution for brands ready to grow beyond posting.",
    type: "website",
  },
  twitter: { card: "summary", title: "GrowthU | Turn attention into growth.", description: "Strategy, content and growth systems for ambitious brands." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
