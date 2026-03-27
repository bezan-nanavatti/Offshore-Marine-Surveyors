import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import BelowFold from "@/components/BelowFold";
import { DEFAULT_OG_IMAGE, SITE_NAME, TWITTER_HANDLE, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Constellation Marine Services | Offshore Marine Surveyors Since 2007",
  description:
    "Professional offshore marine warranty surveyors, rig movers, cargo inspectors and marine consultants. Operating globally from UAE, UK, Singapore and beyond since 2007. Empanelled by all P&I club groups.",
  alternates: {
    canonical: siteUrl("/"),
  },
  openGraph: {
    title: "Constellation Marine Services | Offshore Marine Surveyors Since 2007",
    description:
      "International offshore marine warranty surveyors and consultants. 9 offices worldwide. Empanelled by all P&I club groups.",
    url: siteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Constellation Marine Services — Offshore Marine Surveyors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    title: "Constellation Marine Services | Offshore Marine Surveyors Since 2007",
    description: "International offshore marine warranty surveyors. 9 offices worldwide. 24/7 emergency response.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <BelowFold />
    </>
  );
}
