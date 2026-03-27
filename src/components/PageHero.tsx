'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { eyebrow } from '@/lib/design-system';

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: Breadcrumb[];
  badge?: string;
  image?: string;
}

export default function PageHero({ title, subtitle, breadcrumbs, badge, image }: PageHeroProps) {
  const bg = image ?? '/images/hero_bg_1.jpg';

  return (
    <section
      className="relative flex items-end justify-start overflow-hidden"
      style={{ minHeight: '38vh', paddingTop: '7rem', paddingBottom: '3.5rem' }}
    >
      {/* Background image */}
      <Image
        src={bg}
        alt=""
        fill
        priority
        quality={85}
        className="object-cover object-center"
        aria-hidden={true}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(110deg, rgba(11,37,69,0.94) 0%, rgba(14,47,90,0.85) 60%, rgba(28,167,166,0.25) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle technical grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Teal left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <m.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-white/60 mb-4"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i < breadcrumbs.length - 1 ? (
                <>
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight size={13} className="text-teal" />
                </>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </m.nav>

        {/* Badge */}
        {badge && (
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-4"
          >
            <span className={eyebrow.teal}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              {badge}
            </span>
          </m.div>
        )}

        {/* Title */}
        <m.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading font-black text-white leading-tight tracking-tight max-w-[800px]"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
        >
          {title}
        </m.h1>

        {/* Subtitle */}
        {subtitle && (
          <m.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 text-base sm:text-lg leading-relaxed text-white/70 max-w-[640px]"
          >
            {subtitle}
          </m.p>
        )}

        {/* Teal rule */}
        <m.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-5 h-0.5 w-20 rounded-full bg-teal"
        />
      </div>
    </section>
  );
}
