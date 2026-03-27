import type { Metadata } from 'next';
import { teamMembers } from '@/lib/team-data';
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
import TeamCard from '@/components/TeamCard';

export const metadata: Metadata = {
  title: 'Our Team | Constellation Marine Services — Master Mariners & Marine Engineers',
  description:
    'Meet the Constellation Marine Services team — master mariners, naval architects, marine engineers, and offshore specialists with decades of first-hand experience in marine survey and offshore consultancy.',
  keywords: [
    'marine surveyors UAE',
    'master mariner UAE',
    'offshore surveyor team',
    'P&I surveyors',
    'marine engineers UAE',
    'Constellation Marine team',
  ],
  alternates: { canonical: 'https://offshoremarinesurveyors.com/team' },
  openGraph: {
    title: 'Our Team | Constellation Marine Services',
    description: 'Master mariners, naval architects, and marine engineers delivering expert marine survey services.',
    url: 'https://offshoremarinesurveyors.com/team',
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Constellation Marine Services — Our Team' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    title: 'Our Team | Constellation Marine Services',
    description: 'Master mariners, naval architects, and marine engineers delivering expert marine survey services.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'Our Team', href: '/team' },
]);

const teamListJsonLd = itemListSchema(
  teamMembers.map((m) => ({
    name: m.name,
    url: siteUrl(`/team/${m.slug}`),
    description: m.title,
  }))
);

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(teamListJsonLd) }}
      />
      <PageHero
        title="Our Team of Professional Stars"
        subtitle="Master mariners, chief engineers, naval architects, and offshore specialists — united by a commitment to independent, expert marine survey services."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Our Team', href: '/team' },
        ]}
        badge="18+ Years Combined Expertise"
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, i) => (
              <TeamCard key={member.slug} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16" style={{ background: 'var(--navy)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
            Work With Us
          </p>
          <h2 className="text-white font-black mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontFamily: 'var(--font-montserrat)' }}>
            Join the Constellation Network
          </h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            We are always interested in connecting with experienced marine surveyors and offshore specialists. Contact us to explore collaboration opportunities.
          </p>
          <a
            href="mailto:info@offshoremarinesurveyors.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ background: 'var(--cta)', color: '#fff' }}
          >
            Get In Touch
          </a>
        </div>
      </section>
    </>
  );
}
