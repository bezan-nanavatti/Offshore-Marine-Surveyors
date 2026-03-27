'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { variants, inView } from '@/lib/design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeatureItem {
  /** Lucide icon component */
  icon: LucideIcon;
  title: string;
  description: string;
  /** Primary metric shown top-right of card (e.g. "18+") */
  stat?: string;
  statLabel?: string;
  /** Optional "Learn More" link */
  href?: string;
}

interface FeatureCardProps extends FeatureItem {
  /** Position in grid — drives stagger delay */
  index?: number;
  /**
   * `light` — white card, navy/teal palette          (default)
   * `dark`  — navy card, teal text
   * `glass` — frosted glass, for use on dark sections
   */
  variant?: 'light' | 'dark' | 'glass';
}

// ─── Individual Card ──────────────────────────────────────────────────────────

export function FeatureCard({
  icon: Icon,
  title,
  description,
  stat,
  statLabel,
  href,
  index = 0,
  variant = 'light',
}: FeatureCardProps) {
  const delay = (index % 4) * 0.09;

  /* Variant-based class sets */
  const cardCls = {
    light: 'bg-white border border-navy/[0.08] hover:border-teal/30 hover:shadow-lg hover:shadow-navy/8',
    dark:  'bg-navy/70 border border-white/10 hover:border-teal/30 hover:bg-navy/85',
    glass: 'bg-white/6 border border-white/12 hover:border-teal/35 hover:bg-white/10 backdrop-blur-sm',
  }[variant];

  const iconWrapCls = {
    light: 'bg-teal/10 border border-teal/20',
    dark:  'bg-teal/15 border border-teal/30',
    glass: 'bg-teal/12 border border-teal/28',
  }[variant];

  const titleCls   = variant === 'light' ? 'text-dark group-hover:text-ocean'   : 'text-white group-hover:text-teal';
  const bodyCls    = variant === 'light' ? 'text-dark/58'   : 'text-white/58';
  const statCls    = 'text-teal';
  const linkCls    = variant === 'light' ? 'text-ocean'     : 'text-teal';

  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col rounded-2xl p-6 overflow-hidden transition-all duration-300 ${cardCls}`}
    >
      {/* ── Icon ─────────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl mb-5 flex-shrink-0 ${iconWrapCls}`}
      >
        <Icon className="w-5 h-5 text-teal" strokeWidth={1.75} />
      </div>

      {/* ── Stat (top-right) ──────────────────────────────────────── */}
      {stat && (
        <div className="absolute top-5 right-5 text-right" aria-label={statLabel}>
          <p className={`font-heading font-black text-xl leading-none ${statCls}`}>{stat}</p>
          {statLabel && (
            <p className={`text-[10px] font-medium tracking-[0.14em] uppercase mt-0.5 ${bodyCls}`}>
              {statLabel}
            </p>
          )}
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────── */}
      <h3
        className={`font-heading font-bold text-[1rem] leading-snug mb-2.5 transition-colors duration-200 ${titleCls}`}
      >
        {title}
      </h3>

      <p className={`text-sm leading-relaxed flex-1 ${bodyCls}`}>{description}</p>

      {/* ── Optional link ─────────────────────────────────────────── */}
      {href && (
        <Link
          href={href}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold mt-4 ${linkCls}`}
          aria-label={title}
        >
          Learn More
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}

      {/* ── Corner glow decoration ────────────────────────────────── */}
      <div
        className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(28,167,166,0.20) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </m.div>
  );
}

// ─── FeatureCards Section ─────────────────────────────────────────────────────

interface FeatureCardsSectionProps {
  items: FeatureItem[];
  badge?: string;
  title: string;
  subtitle?: string;
  /** Grid columns (default 3) */
  columns?: 2 | 3 | 4;
  /**
   * Override card variant. Defaults to 'light' on light themes,
   * 'glass' on dark themes.
   */
  variant?: 'light' | 'dark' | 'glass';
  /** Section background (default 'surface') */
  theme?: 'surface' | 'white' | 'dark' | 'navy';
  /** Align section header left (default) or center */
  align?: 'left' | 'center';
  cta?: { label: string; href: string };
}

const colMap: Record<2 | 3 | 4, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

export default function FeatureCards({
  items,
  badge,
  title,
  subtitle,
  columns = 3,
  variant,
  theme = 'surface',
  align = 'center',
  cta,
}: FeatureCardsSectionProps) {
  const isDark = theme === 'dark' || theme === 'navy';
  const bg =
    theme === 'dark'  ? 'bg-dark'    :
    theme === 'navy'  ? 'gradient-navy' :
    theme === 'white' ? 'bg-white'   :
    'bg-surface';

  /* Auto-select card variant that reads well on this background */
  const cardVariant = variant ?? (isDark ? 'glass' : 'light');

  const headerAlign = align === 'center'
    ? 'text-center mx-auto'
    : '';

  return (
    <section className={`section-padding ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ──────────────────────────────────────── */}
        <m.div
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className={`mb-12 max-w-3xl ${headerAlign}`}
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
        <div className={`grid grid-cols-1 ${colMap[columns]} gap-6`}>
          {items.map((item, i) => (
            <FeatureCard key={item.title} {...item} index={i} variant={cardVariant} />
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
