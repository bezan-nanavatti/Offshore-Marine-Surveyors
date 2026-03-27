'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { variants, inView } from '@/lib/design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CTALink {
  label: string;
  href: string;
  /** Render as <a href="tel:…"> and show Phone icon */
  tel?: boolean;
}

interface CTASectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCTA?: CTALink;
  secondaryCTA?: CTALink;
  /**
   * Layout variant:
   * - `centered` (default) — full-width, centred, decorative glows
   * - `split`              — left text + right slot (pass `children`)
   * - `banner`             — compact horizontal strip
   */
  variant?: 'centered' | 'split' | 'banner';
  /**
   * Background theme:
   * - `navy`  (default) — gradient-navy
   * - `dark`            — gradient-dark
   * - `teal`            — gradient-teal (ocean → teal)
   * - `light`           — surface bg, dark text
   */
  theme?: 'navy' | 'dark' | 'teal' | 'light';
  /** Right-side slot used by the `split` variant */
  children?: React.ReactNode;
}

// ─── Decorative glows (stateless, hoisted to avoid recreating on each render) ─

function Glows() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(28,167,166,0.40) 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(30,90,138,0.50) 0%, transparent 65%)' }}
      />
    </div>
  );
}

// ─── Content block (hoisted with explicit props to avoid recreating on render) ─

interface ContentProps {
  eyebrow?:     string;
  title:        string;
  subtitle?:    string;
  primaryCTA?:  CTALink;
  secondaryCTA?: CTALink;
  isDark:       boolean;
  textCol:      string;
  subCol:       string;
  align?:       'left' | 'center';
  titleSize?:   string;
}

function CTAContent({
  eyebrow, title, subtitle, primaryCTA, secondaryCTA,
  isDark, textCol, subCol,
  align     = 'center',
  titleSize = 'clamp(1.7rem, 3.5vw, 2.8rem)',
}: ContentProps) {
  return (
    <m.div
      variants={variants.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      className={align === 'center' ? 'text-center max-w-3xl mx-auto' : ''}
    >
      {eyebrow && (
        <m.div variants={variants.rise} className="mb-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal/12 border border-teal/30 rounded-full text-teal text-[11px] font-semibold tracking-[0.18em] uppercase font-heading">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            {eyebrow}
          </span>
        </m.div>
      )}
      <m.h2
        variants={variants.rise}
        className={`font-heading font-black leading-tight mb-5 ${textCol}`}
        style={{ fontSize: titleSize }}
      >
        {title}
      </m.h2>
      {subtitle && (
        <m.p variants={variants.rise} className={`text-lg leading-relaxed mb-8 ${subCol}`}>
          {subtitle}
        </m.p>
      )}
      {(primaryCTA || secondaryCTA) && (
        <m.div
          variants={variants.rise}
          className={`flex flex-col sm:flex-row gap-4 ${align === 'center' ? 'justify-center' : ''}`}
        >
          {primaryCTA   && <CTAButton cta={primaryCTA}   style={isDark ? 'primary' : 'primary'} />}
          {secondaryCTA && <CTAButton cta={secondaryCTA} style={isDark ? 'ghost'   : 'outline-light'} />}
        </m.div>
      )}
    </m.div>
  );
}

// ─── Internal button helper ───────────────────────────────────────────────────

function CTAButton({
  cta,
  style,
}: {
  cta: CTALink;
  style: 'primary' | 'ghost' | 'outline-light';
}) {
  const base =
    'inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-semibold rounded-xl text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0';

  const cls =
    style === 'primary'
      ? `${base} bg-cta hover:bg-cta/90 text-white hover:shadow-xl hover:shadow-cta/35`
      : style === 'ghost'
      ? `${base} bg-white/8 hover:bg-white/16 text-white border border-white/20 hover:border-white/40`
      : /* outline-light */
        `${base} border border-navy/22 hover:border-navy text-dark hover:bg-navy/5`;

  const icon = cta.tel ? (
    <Phone size={15} />
  ) : (
    <ArrowRight size={15} />
  );

  if (cta.tel) {
    return (
      <a href={cta.href} className={cls}>
        {icon}
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={cls}>
      {cta.label}
      {icon}
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CTASection({
  eyebrow,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  variant = 'centered',
  theme   = 'navy',
  children,
}: CTASectionProps) {
  const isDark = theme !== 'light';

  const bgCls =
    theme === 'teal'  ? 'gradient-teal'  :
    theme === 'dark'  ? 'gradient-dark'  :
    theme === 'light' ? 'bg-surface'     :
    'gradient-navy';

  const textCol = isDark ? 'text-white' : 'text-dark';
  const subCol  = isDark ? 'text-white/65' : 'text-dark/60';

  /* ════════════════════════════════════════════════════════════════
     VARIANT: Centered
     Full-width section with centred text and ambient glows.
  ════════════════════════════════════════════════════════════════ */
  if (variant === 'centered') {
    return (
      <section className={`relative section-padding overflow-hidden ${bgCls}`}>
        {isDark && <Glows />}

        {/* Subtle grid overlay */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-[0.028] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CTAContent align="center" titleSize="clamp(1.7rem, 3.5vw, 2.8rem)"
            eyebrow={eyebrow} title={title} subtitle={subtitle}
            primaryCTA={primaryCTA} secondaryCTA={secondaryCTA}
            isDark={isDark} textCol={textCol} subCol={subCol}
          />
        </div>
      </section>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     VARIANT: Banner
     Compact horizontal strip — title on left, buttons on right.
  ════════════════════════════════════════════════════════════════ */
  if (variant === 'banner') {
    return (
      <section className={`relative py-8 overflow-hidden ${bgCls}`}>
        {/* Thin teal left accent line */}
        <div className="teal-line-l" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.55 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            {/* Text */}
            <div className="max-w-xl">
              {eyebrow && (
                <p className="text-teal text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5 font-heading">
                  {eyebrow}
                </p>
              )}
              <h2
                className={`font-heading font-bold leading-tight ${textCol}`}
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
              >
                {title}
              </h2>
              {subtitle && (
                <p className={`text-sm mt-1.5 leading-relaxed ${subCol}`}>{subtitle}</p>
              )}
            </div>

            {/* Buttons */}
            {(primaryCTA || secondaryCTA) && (
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                {primaryCTA   && <CTAButton cta={primaryCTA}   style="primary" />}
                {secondaryCTA && <CTAButton cta={secondaryCTA} style={isDark ? 'ghost' : 'outline-light'} />}
              </div>
            )}
          </m.div>
        </div>
      </section>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     VARIANT: Split
     Two-column layout — text on left, `children` slot on right.
     Use for forms, contact cards, stats panels, etc.
  ════════════════════════════════════════════════════════════════ */
  return (
    <section className={`relative section-padding overflow-hidden ${bgCls}`}>
      {/* Teal left accent line */}
      <div className="teal-line-l" aria-hidden="true" />

      {/* Ambient glows */}
      {isDark && <Glows />}

      {/* Subtle grid */}
      {isDark && (
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: text ─────────────────────────────────────── */}
          <CTAContent align="left" titleSize="clamp(1.7rem, 3.2vw, 2.6rem)"
            eyebrow={eyebrow} title={title} subtitle={subtitle}
            primaryCTA={primaryCTA} secondaryCTA={secondaryCTA}
            isDark={isDark} textCol={textCol} subCol={subCol}
          />

          {/* ── Right: children slot ───────────────────────────── */}
          {children && (
            <m.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inView}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </m.div>
          )}
        </div>
      </div>
    </section>
  );
}
