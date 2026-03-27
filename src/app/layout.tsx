import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import { jsonLd, websiteSchema, BASE_URL, LOGO_URL } from "@/lib/seo";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Constellation Marine Services | Offshore Marine Surveyors Since 2007",
    template: "%s | Constellation Marine Services",
  },
  description:
    "International offshore marine warranty surveyors, rig movers, cargo inspectors and marine consultants. Operating globally from UAE, UK, Singapore and beyond since 2007. Empanelled by all P&I club groups.",
  keywords: [
    "offshore marine surveyors",
    "marine warranty survey UAE",
    "rig moving UAE",
    "cargo survey Abu Dhabi",
    "marine consultancy",
    "Constellation Marine Services",
    "P&I surveyor UAE",
    "marine casualties investigation",
    "eCMID audit",
    "technical due diligence marine",
  ],
  authors: [{ name: "Constellation Marine Services LLC" }],
  creator: "Constellation Marine Services LLC",
  publisher: "Constellation Marine Services LLC",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Constellation Marine Services",
    title: "Constellation Marine Services | Offshore Marine Surveyors Since 2007",
    description:
      "International offshore marine warranty surveyors and consultants. 9 offices worldwide. Empanelled by all P&I club groups.",
    images: [
      {
        url: "/images/hero_bg_1.jpg",
        width: 1200,
        height: 630,
        alt: "Constellation Marine Services — Offshore Marine Surveyors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@constellationms",
    creator: "@constellationms",
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
  }),
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Constellation Marine Services LLC",
  alternateName: "Offshore Marine Surveyors",
  url: BASE_URL,
  logo: LOGO_URL,
  foundingDate: "2007",
  description:
    "International ship and marine consultancy and survey firm established in 2007, headquartered in Abu Dhabi, UAE.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dar Al Salam Building, Cornish Street",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
    postalCode: "PO Box 27818",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+971-2671-3320",
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      telephone: "+971-501-889-614",
      contactType: "emergency",
      availableLanguage: "English",
    },
  ],
  sameAs: [
    "https://www.facebook.com/constellationms/",
    "https://www.instagram.com/constellationmarineservices/",
    "https://linkedin.com/company/constellation-marine-services/",
    "https://x.com/constellationms/",
    "https://www.youtube.com/channel/UCnoVqGDLWuw6p9DQIBLIUjA",
    "https://marinesurveyordubai.com/",
    "https://shipsurveyorsfujairah.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-surface text-dark antialiased font-body">
        {/* Skip to main content — first focusable element for keyboard / screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
          style={{ background: 'var(--teal)', color: '#fff' }}
        >
          Skip to main content
        </a>
        <Navbar />
        <MotionProvider>
          <main id="main-content">{children}</main>
        </MotionProvider>
        <Footer />
      </body>
    </html>
  );
}
