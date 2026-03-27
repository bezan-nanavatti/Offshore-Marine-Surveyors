'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { variants, inView } from '@/lib/design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeaserItem {
  /** Optional cover image (16 : 9) */
  image?: string;
  /** Chip label shown over image or above title */
  category?: string;
  title: string;
  description: string;
  href: string;
}

interface TeaserCardProps extends TeaserItem {
  /** Position in grid — drives stagger delay */
  index?: number;
  /**
   * `card`    — image-forward, white card with bottom teal bar on hover  (default)
   * `minimal` — text-only, compact, no image
   */
  variant?: 'card' | 'minimal';
}

// ─── Individual Card ──────────────────────────────────────────────────────────

export function TeaserCard({
  image,
  category,
  title,
  description,
  href,
  index = 0,
  variant = 'card',
}: TeaserCardProps) {
  const delay = (index % 3) * 0.09;

  /* ── Minimal variant ─────────────────────────────────────────────── */
  if (variant === 'minimal') {
    return (
      <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -3 }}
        className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-white border border-navy/[0.08] hover:border-teal/35 hover:shadow-md hover:shadow-navy/6 transition-all duration-300"
      >
        {category && (
          <span className="text-[11px] font-semibold text-teal tracking-[0.18em] uppercase font-heading">
            {category}
          </span>
        )}
        <h3 className="font-heading font-bold text-dark text-[1rem] leading-snug group-hover:text-ocean transition-colors duration-200">
          {title}
        </h3>
        <p className="text-dark/55 text-sm leading-relaxed flex-1">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-ocean text-sm font-semibold mt-1 group-hover:gap-2.5 transition-all duration-200"
          aria-label={`Learn more about ${title}`}
        >
          Learn More
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </m.div>
    );
  }

  /* ── Card variant (image-forward) ────────────────────────────────── */
  return (
    <m.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-navy/[0.08]"
      style={{
        boxShadow: '0 2px 16px rgba(11,37,69,0.06)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(11,37,69,0.14)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(11,37,69,0.06)';
      }}
    >
      {/* Cover image */}
      {image ? (
        <Link
          href={href}
          className="block relative aspect-[16/9] overflow-hidden flex-shrink-0"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{
                background: 'rgba(11,37,69,0.84)',
                color: 'var(--teal)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {category}
            </span>
          )}
          {/* Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
        </Link>
      ) : (
        /* Thin ocean-to-teal colour band when no image is supplied */
        <div className="h-1.5 gradient-ocean flex-shrink-0" />
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Show category as text when there is no image */}
        {category && !image && (
          <span className="text-[11px] font-semibold text-teal tracking-[0.18em] uppercase font-heading mb-2">
            {category}
          </span>
        )}

        <Link href={href} tabIndex={-1} aria-hidden="true">
          <h3
            className="font-heading font-bold text-dark leading-snug mb-3 group-hover:text-ocean transition-colors duration-200"
            style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}
          >
            {title}
          </h3>
        </Link>

        <p className="text-dark/58 text-sm leading-relaxed flex-1 mb-4">{description}</p>

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-ocean text-sm font-semibold mt-auto"
          aria-label={`Learn more about ${title}`}
        >
          Learn More
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Bottom teal accent bar — slides in on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: 'linear-gradient(90deg, var(--teal), var(--ocean))' }}
        aria-hidden="true"
      />
    </m.article>
  );
}

// ─── TeaserCards Section ──────────────────────────────────────────────────────

interface TeaserCardsSectionProps {
  items: TeaserItem[];
  badge?: string;
  title: string;
  subtitle?: string;
  /** Grid columns (default 3) */
  columns?: 2 | 3 | 4;
  /** Individual card style (default 'card') */
  variant?: 'card' | 'minimal';
  /** Section background (default 'surface') */
  theme?: 'surface' | 'white' | 'dark';
  cta?: { label: string; href: string };
}

const colMap: Record<2 | 3 | 4, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export default function TeaserCards({
  items,
  badge,
  title,
  subtitle,
  columns = 3,
  variant = 'card',
  theme = 'surface',
  cta,
}: TeaserCardsSectionProps) {
  const isDark = theme === 'dark';
  const bg = theme === 'dark' ? 'bg-dark' : theme === 'white' ? 'bg-white' : 'bg-surface';

  return (
    <section className={`section-padding ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ──────────────────────────────────────── */}
        <m.div
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mb-12 max-w-2xl"
        >
          {badge && (
            <m.div variants={variants.rise} className="mb-4">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase font-heading ${
                  isDark
                    ? 'bg-teal/12 border border-teal/30 text-teal'
                    : 'bg-teal/10 border border-teal/25 text-teal'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                {badge}
              </span>
            </m.div>
          )}

          <m.h2
            variants={variants.rise}
            className={`font-heading font-black leading-tight mb-4 ${
              isDark ? 'text-white' : 'text-dark'
            }`}
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}
          >
            {title}
          </m.h2>

          {subtitle && (
            <m.p
              variants={variants.rise}
              className={`text-lg leading-relaxed ${isDark ? 'text-white/60' : 'text-dark/60'}`}
            >
              {subtitle}
            </m.p>
          )}
        </m.div>

        {/* ── Grid ────────────────────────────────────────────────── */}
        <div className={`grid grid-cols-1 ${colMap[columns]} gap-6 lg:gap-8`}>
          {items.map((item, i) => (
            <TeaserCard key={item.href} {...item} index={i} variant={variant} />
          ))}
        </div>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        {cta && (
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-12 text-center"
          >
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-cta hover:bg-cta/90 text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-xl hover:shadow-cta/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              {cta.label}
              <ArrowRight size={16} />
            </Link>
          </m.div>
        )}
      </div>
    </section>
  );
}
