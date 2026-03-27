import type { Metadata } from 'next';
import { blogPosts, blogCategories } from '@/lib/blog-posts';
import {
  jsonLd,
  breadcrumbSchema,
  itemListSchema,
  siteUrl,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  SITE_NAME,
} from '@/lib/seo';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Marine Surveying Blog | Constellation Marine Services',
  description:
    'Expert articles on marine warranty survey, cargo inspection, draft surveying, tanker operations, P&I claims, and offshore engineering — from the team at Constellation Marine Services.',
  keywords: [
    'marine survey blog',
    'offshore marine surveying articles',
    'cargo survey',
    'marine warranty survey',
    'P&I club survey',
    'tanker operations',
    'bunker survey',
    'marine engineering',
    'Constellation Marine Services',
  ],
  alternates: { canonical: 'https://offshoremarinesurveyors.com/blog' },
  openGraph: {
    title: 'Marine Surveying Blog | Constellation Marine Services',
    description:
      'Expert articles on marine warranty survey, cargo inspection, tanker operations, and offshore engineering.',
    url: 'https://offshoremarinesurveyors.com/blog',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Marine Surveying Blog — Constellation Marine Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'Marine Surveying Blog | Constellation Marine Services',
    description: 'Expert articles on marine warranty survey, cargo inspection, tanker operations, and offshore engineering.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
]);

const blogListJsonLd = itemListSchema(
  blogPosts.map((p) => ({
    name: p.title,
    url: siteUrl(`/blog/${p.slug}`),
    description: p.description,
  }))
);

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(blogListJsonLd) }}
      />
      <BlogListClient posts={blogPosts} categories={blogCategories} />
    </>
  );
}
