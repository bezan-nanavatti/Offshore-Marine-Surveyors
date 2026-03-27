import type { Metadata } from 'next';
import { projects, projectCategoryLabels } from '@/lib/projects-data';
import {
  jsonLd,
  breadcrumbSchema,
  itemListSchema,
  siteUrl,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  SITE_NAME,
} from '@/lib/seo';
import ProjectsListClient from './ProjectsListClient';

export const metadata: Metadata = {
  title: 'Projects & Case Studies | Constellation Marine Services',
  description:
    'Selected case studies from Constellation Marine Services — marine warranty surveys, rig moves, casualty investigations, cargo claims, and offshore technical due diligence across the Middle East, Indian Ocean, and beyond.',
  keywords: [
    'marine survey case studies',
    'rig move case study UAE',
    'marine warranty survey project',
    'offshore survey projects Middle East',
    'marine casualty investigation case study',
    'cargo survey UAE',
    'Constellation Marine Services projects',
  ],
  alternates: { canonical: 'https://offshoremarinesurveyors.com/projects' },
  openGraph: {
    title: 'Projects & Case Studies | Constellation Marine Services',
    description:
      'Case studies from marine warranty surveys, rig moves, casualty investigations, and offshore due diligence across the Middle East and beyond.',
    url: 'https://offshoremarinesurveyors.com/projects',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Constellation Marine Services — Projects & Case Studies' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'Projects & Case Studies | Constellation Marine Services',
    description: 'Case studies from marine warranty surveys, rig moves, casualty investigations, and offshore due diligence.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
]);

const projectsListJsonLd = itemListSchema(
  projects.map((p) => ({
    name: p.title,
    url: siteUrl(`/projects/${p.slug}`),
    description: p.summary.slice(0, 160),
  }))
);

export default function ProjectsPage() {
  const categories = Object.values(projectCategoryLabels);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(projectsListJsonLd) }}
      />
      <ProjectsListClient projects={projects} categories={categories} />
    </>
  );
}
