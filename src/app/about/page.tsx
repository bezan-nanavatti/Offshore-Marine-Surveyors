import type { Metadata } from 'next';
import { jsonLd, breadcrumbSchema, DEFAULT_OG_IMAGE, TWITTER_HANDLE, SITE_NAME } from '@/lib/seo';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us | Constellation Marine Services — Offshore Marine Surveyors Since 2007',
  description:
    'Learn about Constellation Marine Services LLC — an international marine survey and consultancy firm established in 2007. 9 global offices, 18+ years of excellence, empanelled by all P&I club groups worldwide.',
  keywords: [
    'about Constellation Marine Services',
    'offshore marine surveyors UAE',
    'marine survey company Abu Dhabi',
    'P&I club surveyors',
    'marine warranty survey company',
    'IIMS marine surveyors',
    'offshore consultancy UAE',
  ],
  alternates: { canonical: 'https://offshoremarinesurveyors.com/about' },
  openGraph: {
    title: 'About Us | Constellation Marine Services',
    description:
      'International marine survey and consultancy firm established in 2007. 9 global offices, empanelled by all P&I club groups worldwide.',
    url: 'https://offshoremarinesurveyors.com/about',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Constellation Marine Services — About Us' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'About Us | Constellation Marine Services',
    description:
      'International marine survey and consultancy firm established in 2007. 9 global offices, empanelled by all P&I club groups worldwide.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Constellation Marine Services',
  url: 'https://offshoremarinesurveyors.com/about',
  description:
    'International marine survey and consultancy firm established in 2007. 9 global offices, empanelled by all P&I club groups worldwide.',
  about: {
    '@type': 'Organization',
    name: 'Constellation Marine Services LLC',
    foundingDate: '2007',
    url: 'https://offshoremarinesurveyors.com',
    logo: 'https://offshoremarinesurveyors.com/images/logo.png',
  },
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
]);

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <AboutPageClient />
    </>
  );
}
