import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, getProject, getRelatedProjects } from '@/lib/projects-data';
import { jsonLd, breadcrumbSchema, siteUrl, TWITTER_HANDLE, SITE_NAME, BASE_URL } from '@/lib/seo';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = siteUrl(`/projects/${project.slug}`);
  const image = siteUrl(project.image);
  const description = project.summary.slice(0, 160);

  return {
    title: `${project.title} | Constellation Marine Services`,
    description,
    keywords: [
      project.categoryLabel.toLowerCase(),
      `${project.categoryLabel.toLowerCase()} ${project.region}`,
      'marine survey case study',
      'Constellation Marine Services',
      project.asset.toLowerCase(),
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | Constellation Marine Services`,
      description: project.summary,
      url,
      siteName: SITE_NAME,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: `${project.title} | Constellation Marine Services`,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(slug, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.summary,
    image: siteUrl(project.image),
    url: siteUrl(`/projects/${project.slug}`),
    datePublished: `${project.year}-01-01`,
    dateModified: `${project.year}-01-01`,
    publisher: {
      '@type': 'Organization',
      name: 'Constellation Marine Services LLC',
      url: BASE_URL,
    },
    about: {
      '@type': 'Service',
      name: project.categoryLabel,
    },
  };

  const crumbsJsonLd = breadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: project.title, href: `/projects/${project.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <ProjectDetailClient project={project} related={related} />
    </>
  );
}
