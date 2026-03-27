import type { Metadata } from 'next';
import { Suspense } from 'react';
import { jsonLd, breadcrumbSchema, DEFAULT_OG_IMAGE, TWITTER_HANDLE, SITE_NAME } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us | Constellation Marine Services — 9 Global Offices',
  description:
    'Contact Constellation Marine Services for marine warranty surveys, cargo inspections, casualty investigations, and offshore consultancy. 9 offices across UAE, UK, Singapore, Oman, Netherlands, China, and Egypt.',
  keywords: [
    'contact marine surveyors UAE',
    'offshore marine surveyors contact',
    'marine survey Abu Dhabi',
    'marine survey Dubai',
    'marine survey Fujairah',
    'marine warranty survey contact',
    'P&I surveyor UAE',
  ],
  alternates: { canonical: 'https://offshoremarinesurveyors.com/contact' },
  openGraph: {
    title: 'Contact Us | Constellation Marine Services',
    description: '9 offices worldwide. Available 24/7 for emergency survey response.',
    url: 'https://offshoremarinesurveyors.com/contact',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Contact Constellation Marine Services — 9 Global Offices' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'Contact Us | Constellation Marine Services',
    description: '9 offices worldwide. Available 24/7 for emergency survey response.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Constellation Marine Services LLC',
  alternateName: 'Offshore Marine Surveyors',
  url: 'https://offshoremarinesurveyors.com',
  logo: 'https://offshoremarinesurveyors.com/images/logo.png',
  image: 'https://offshoremarinesurveyors.com/images/hero_bg_1.jpg',
  description:
    'International marine warranty surveyors, rig move masters, cargo surveyors, and offshore consultants. 9 global offices, available 24/7.',
  foundingDate: '2007',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dar Al Salam Building, Cornish Street',
    addressLocality: 'Abu Dhabi',
    addressCountry: 'AE',
    postalCode: 'PO Box 27818',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.4672,
    longitude: 54.3686,
  },
  telephone: '+971-2671-3320',
  email: 'info@offshoremarinesurveyors.com',
  openingHours: 'Mo-Su 00:00-24:00',
  priceRange: '$$',
  areaServed: 'Worldwide',
  hasMap: 'https://maps.google.com/?q=Dar+Al+Salam+Building,+Cornish+Street,+Abu+Dhabi',
  sameAs: [
    'https://www.facebook.com/constellationms/',
    'https://www.instagram.com/constellationmarineservices/',
    'https://linkedin.com/company/constellation-marine-services/',
    'https://marinesurveyordubai.com/',
    'https://shipsurveyorsfujairah.com/',
  ],
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
]);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <Suspense fallback={null}>
        <ContactPageClient />
      </Suspense>
    </>
  );
}
