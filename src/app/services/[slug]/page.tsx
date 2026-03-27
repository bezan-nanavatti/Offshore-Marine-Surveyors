import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, getService, getRelatedServices } from '@/lib/services-data';
import { jsonLd, breadcrumbSchema, siteUrl, TWITTER_HANDLE, SITE_NAME, BASE_URL } from '@/lib/seo';
import ServicePageClient from './ServicePageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const url = siteUrl(`/services/${service.slug}`);
  const image = siteUrl(service.image);

  return {
    title: `${service.name} | Constellation Marine Services`,
    description: service.description.slice(0, 160),
    keywords: [
      service.name.toLowerCase(),
      `${service.name.toLowerCase()} UAE`,
      `${service.name.toLowerCase()} offshore`,
      'marine survey UAE',
      'Constellation Marine Services',
      ...service.keyPoints.slice(0, 3),
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${service.name} | Constellation Marine Services`,
      description: service.tagline,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: service.name }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: `${service.name} | Constellation Marine Services`,
      description: service.tagline,
      images: [image],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = getRelatedServices(slug);

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Constellation Marine Services LLC',
      url: BASE_URL,
    },
    areaServed: 'Worldwide',
    url: siteUrl(`/services/${service.slug}`),
  };

  const crumbsJsonLd = breadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.name, href: `/services/${service.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <ServicePageClient service={service} related={related} />
    </>
  );
}
