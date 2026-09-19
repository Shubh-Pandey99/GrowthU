import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowthU | Social Media Management Agency",
  description: "GrowthU helps brands grow beyond limits with strategic social media management, creative content, reels and consistent digital growth.",
  metadataBase: new URL("https://growthu.vercel.app"),
  openGraph: {
    title: "GrowthU | Grow Beyond Limits",
    description: "Strategic social media management, creative content, reels and consistent digital growth.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
