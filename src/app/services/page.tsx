import type { Metadata } from 'next';
import { services } from '@/lib/services-data';
import {
  jsonLd,
  breadcrumbSchema,
  itemListSchema,
  siteUrl,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  SITE_NAME,
} from '@/lib/seo';
import PageHero from '@/components/PageHero';
import ServicesGrid from './ServicesGrid';

export const metadata: Metadata = {
  title: 'Marine Survey Services | Constellation Marine Services',
  description:
    'Comprehensive marine survey and offshore consultancy services — Marine Warranty Survey, Rig Positioning, Cargo Survey, Marine Casualties, Project Management, Technical Due Diligence, eCMID Audits, and more.',
  keywords: [
    'marine survey services UAE',
    'marine warranty survey',
    'rig positioning moving',
    'cargo damage survey',
    'marine casualties survey',
    'eCMID audit',
    'offshore marine consultancy',
    'technical due diligence marine',
  ],
  alternates: { canonical: 'https://offshoremarinesurveyors.com/services' },
  openGraph: {
    title: 'Marine Survey Services | Constellation Marine Services',
    description:
      'Comprehensive marine survey and offshore consultancy — MWS, rig move, cargo, casualties, project management, and more.',
    url: 'https://offshoremarinesurveyors.com/services',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Marine Survey Services — Constellation Marine Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'Marine Survey Services | Constellation Marine Services',
    description: 'Comprehensive marine survey and offshore consultancy — MWS, rig move, cargo, casualties, project management, and more.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
]);

const servicesListJsonLd = itemListSchema(
  services.map((s) => ({
    name: s.name,
    url: siteUrl(`/services/${s.slug}`),
    description: s.tagline,
  }))
);

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(servicesListJsonLd) }}
      />
      <PageHero
        title="Comprehensive Marine Survey Solutions"
        subtitle="From marine warranty surveys and rig positioning to cargo inspection and casualty investigation — expert services delivered 24/7 across 9 global offices."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
        ]}
        badge="100+ Marine Services"
      />
      <ServicesGrid services={services} />
    </>
  );
}
