import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { teamMembers, getTeamMember } from '@/lib/team-data';
import { blogPosts } from '@/lib/blog-posts';
import { jsonLd, breadcrumbSchema, siteUrl, TWITTER_HANDLE, SITE_NAME, BASE_URL } from '@/lib/seo';
import TeamMemberClient from './TeamMemberClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return teamMembers.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};

  const url = siteUrl(`/team/${member.slug}`);
  const image = siteUrl(member.photo);

  return {
    title: `${member.name} | Constellation Marine Services Team`,
    description: `${member.name} — ${member.title}. Marine surveying and offshore consultancy specialist with Constellation Marine Services, Abu Dhabi.`,
    keywords: [member.name, member.title, 'marine surveyor UAE', 'Constellation Marine Services'],
    alternates: { canonical: url },
    openGraph: {
      title: `${member.name} | Constellation Marine Services`,
      description: `${member.title} at Constellation Marine Services.`,
      url,
      siteName: SITE_NAME,
      type: 'profile',
      images: [{ url: image, width: 400, height: 400, alt: member.name }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: `${member.name} | Constellation Marine Services`,
      description: `${member.title} at Constellation Marine Services.`,
      images: [image],
    },
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const articles = blogPosts.filter((p) => p.authorSlug === member.slug);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.title,
    description: `${member.name} — ${member.title}. Marine surveying and offshore consultancy specialist with Constellation Marine Services.`,
    worksFor: {
      '@type': 'Organization',
      name: 'Constellation Marine Services LLC',
      url: BASE_URL,
    },
    image: siteUrl(member.photo),
    url: siteUrl(`/team/${member.slug}`),
    ...(member.email ? { email: member.email } : {}),
  };

  const crumbsJsonLd = breadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Our Team', href: '/team' },
    { name: member.name, href: `/team/${member.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <TeamMemberClient member={member} articles={articles} />
    </>
  );
}
