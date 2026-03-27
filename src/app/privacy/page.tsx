import type { Metadata } from 'next';
import Link from 'next/link';
import { jsonLd, breadcrumbSchema, siteUrl, SITE_NAME, TWITTER_HANDLE, DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy | Constellation Marine Services',
  description:
    'Privacy policy for Constellation Marine Services LLC. How we collect, use, and protect your personal data in accordance with UAE data protection laws.',
  alternates: { canonical: siteUrl('/privacy') },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Privacy Policy | Constellation Marine Services',
    description: 'How Constellation Marine Services LLC collects, uses, and protects your personal data.',
    url: siteUrl('/privacy'),
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Constellation Marine Services' }],
  },
  twitter: {
    card: 'summary',
    site: TWITTER_HANDLE,
    title: 'Privacy Policy | Constellation Marine Services',
    description: 'How Constellation Marine Services LLC collects, uses, and protects your personal data.',
  },
};

const crumbsJsonLd = breadcrumbSchema([
  { name: 'Home',           href: '/' },
  { name: 'Privacy Policy', href: '/privacy' },
]);

const LAST_UPDATED = '1 March 2025';

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />

      {/* Hero */}
      <section
        className="pt-32 pb-12"
        style={{ background: 'linear-gradient(160deg, var(--navy) 0%, #0d2a50 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
            Legal
          </p>
          <h1
            className="text-white font-black mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--font-montserrat)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding" style={{ background: '#fff' }}>
        <div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ color: 'var(--dark)', lineHeight: '1.75' }}
        >
          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            1. Who We Are
          </h2>
          <p className="mb-4">
            Constellation Marine Services LLC (<strong>&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;</strong>) is an international ship and marine
            consultancy firm registered in Abu Dhabi, UAE (PO Box 27818). Our website is{' '}
            <a href="https://offshoremarinesurveyors.com" className="underline" style={{ color: 'var(--ocean)' }}>
              offshoremarinesurveyors.com
            </a>.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            2. Information We Collect
          </h2>
          <p className="mb-2">When you use our contact form, we collect:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Full name</li>
            <li>Company name (optional)</li>
            <li>Email address</li>
            <li>Phone number (optional)</li>
            <li>Service enquired about</li>
            <li>Message content</li>
            <li>IP address (for abuse prevention)</li>
          </ul>
          <p className="mb-4">
            We collect this information only when you voluntarily submit our contact form. We do not use
            tracking cookies, analytics scripts, or fingerprinting technologies at this time.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>To respond to your enquiry</li>
            <li>To provide the marine survey or consultancy services you requested</li>
            <li>To maintain a record of our correspondence for contractual purposes</li>
            <li>To detect and prevent spam or abusive submissions</li>
          </ul>
          <p className="mb-4">
            We do not sell, rent, or share your personal data with third parties for marketing purposes.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            4. Data Storage &amp; Security
          </h2>
          <p className="mb-4">
            Submissions are stored securely on our servers. We use HTTPS (TLS) for all data in transit.
            Access to submission data is restricted to authorised personnel only. We retain contact form
            data for up to 3 years or until you request deletion.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            5. Your Rights
          </h2>
          <p className="mb-2">
            Under applicable UAE and international data protection principles, you have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>
          <p className="mb-4">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:info@offshoremarinesurveyors.com" style={{ color: 'var(--ocean)' }} className="underline">
              info@offshoremarinesurveyors.com
            </a>.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            6. Third-Party Services
          </h2>
          <p className="mb-4">
            This website is hosted on Vercel Inc. (San Francisco, USA). Vercel may process request
            metadata (IP addresses, user-agent strings) for operational purposes. See{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ocean)' }}
              className="underline"
            >
              Vercel&apos;s privacy policy
            </a>.
          </p>
          <p className="mb-4">
            Fonts are served via Google Fonts (Google LLC). Google may log font requests. See{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ocean)' }}
              className="underline"
            >
              Google&apos;s privacy policy
            </a>.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            7. Cookies
          </h2>
          <p className="mb-4">
            This website does not set any first-party cookies. If you have browser cookies from a previous
            visit, they are not used by this site.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            8. Changes to This Policy
          </h2>
          <p className="mb-4">
            We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page
            will reflect when changes were made.
          </p>

          <h2 className="font-bold text-xl mb-3 mt-8" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
            9. Contact
          </h2>
          <p className="mb-8">
            For any privacy-related queries, contact us at{' '}
            <a href="mailto:info@offshoremarinesurveyors.com" style={{ color: 'var(--ocean)' }} className="underline">
              info@offshoremarinesurveyors.com
            </a>{' '}
            or by post: Constellation Marine Services LLC, Dar Al Salam Building, Cornish Street,
            Abu Dhabi, UAE — PO Box 27818.
          </p>

          <div className="pt-6" style={{ borderTop: '1px solid rgba(11,37,69,0.1)' }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--ocean)' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
