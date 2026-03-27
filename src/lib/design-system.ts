/**
 * ════════════════════════════════════════════════════════════════
 *  Constellation Marine Services — Global Design System
 * ════════════════════════════════════════════════════════════════
 *
 *  Single source of truth for design tokens, animation presets,
 *  and shared component configuration.
 *
 *  Stack: Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion 12
 * ════════════════════════════════════════════════════════════════
 */

// ─── Color Palette ──────────────────────────────────────────────────────────
/**
 * Raw hex values. Tailwind utilities (bg-navy, text-teal, etc.) are
 * registered via @theme inline in globals.css — prefer those in JSX.
 * Use these values only for inline styles (gradients, boxShadow, etc.).
 */
export const palette = {
  /** Deep navy — primary brand dark */
  navy:       '#0B2545',
  navyLight:  '#122e58',
  /** Ocean blue — secondary brand */
  ocean:      '#1E5A8A',
  oceanLight: '#2570aa',
  /** Teal — brand accent */
  teal:       '#1CA7A6',
  tealLight:  '#5dd6d5',
  /** CTA orange — primary action colour */
  cta:        '#FF6B35',
  /** Page backgrounds */
  surface:    '#F5F7FA',
  dark:       '#0E1B2A',
  /** Premium accent */
  gold:       '#C9A84C',
} as const;

// ─── Typography Scale ────────────────────────────────────────────────────────
/**
 * Fluid font sizes via CSS clamp().
 * Apply via style={{ fontSize: type.display }} on the element.
 *
 * Typefaces:
 *   Headings → font-heading  (Montserrat 700–900, var(--font-montserrat))
 *   Body     → font-body     (Inter 400–600,      var(--font-inter))
 */
export const type = {
  /** Full-screen hero headline */
  display:  'clamp(2.9rem,  7.5vw, 5.8rem)',
  /** Page-level H1 (PageHero) */
  h1:       'clamp(1.8rem,  4vw,   3.2rem)',
  /** Section H2 */
  h2:       'clamp(1.5rem,  2.8vw, 2.2rem)',
  /** Sub-section H3 */
  h3:       'clamp(1.15rem, 1.8vw, 1.4rem)',
  /** Card heading */
  h4:       '1.0625rem',
  /** Lead / body large */
  bodyLg:   '1.125rem',
  /** Default body */
  body:     '1rem',
  /** Meta, captions */
  bodySm:   '0.875rem',
  /** Badge / eyebrow label */
  label:    '0.6875rem',
} as const;

// ─── Spacing Scale ────────────────────────────────────────────────────────────
/**
 * Key layout values. Uses Tailwind's 4px base unit (1 unit = 0.25rem).
 * Prefer Tailwind utility classes (p-6, gap-8, etc.) over this object.
 * Here for documentation and for inline style edge cases.
 *
 *   Section vertical padding: py-20 (80px) → lg:py-28 (112px)
 *                             `.section-padding` utility in globals.css
 *   Standard container:       max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
 *   Card padding:             p-6  (24px)
 *   Card gap:                 gap-6 → lg:gap-8
 *   Section header margin-b:  mb-12 (48px)
 */
export const space = {
  sectionY: { base: '5rem', lg: '7rem' },
  cardPad:  '1.5rem',
} as const;

// ─── Border Radii (as Tailwind class strings) ─────────────────────────────────
export const radius = {
  sm:   'rounded-lg',    // 8px  — chips, inputs
  md:   'rounded-xl',    // 12px — buttons
  lg:   'rounded-2xl',   // 16px — cards
  xl:   'rounded-3xl',   // 24px — large feature cards
  full: 'rounded-full',  //      — pills, badges
} as const;

// ─── Animation Easing ────────────────────────────────────────────────────────
/** Spring-like ease — fast out, no overshoot. Use for content reveals. */
export const EASE_SPRING = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── Framer Motion Variants ───────────────────────────────────────────────────
/**
 * Shared Framer Motion variant presets.
 *
 * Usage (scroll-reveal):
 *   <motion.div variants={variants.stagger} initial="hidden" whileInView="visible" viewport={inView}>
 *     <motion.p variants={variants.rise}>...</motion.p>
 *   </motion.div>
 *
 * Usage (on-mount):
 *   <motion.div variants={variants.stagger} initial="hidden" animate="visible">
 */
export const variants = {
  /** Parent container that staggers its children */
  stagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  },

  /** Slower stagger — for longer lists or deliberate reveals */
  staggerSlow: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
  },

  /** Rise up from below — standard scroll-reveal */
  rise: {
    hidden:  { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: EASE_SPRING },
    },
  },

  /** Quick rise — for denser grids */
  riseQuick: {
    hidden:  { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_SPRING },
    },
  },

  /** Fade only — backgrounds, overlays */
  fade: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  },

  /** Slide in from left */
  slideLeft: {
    hidden:  { opacity: 0, x: -32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: EASE_SPRING },
    },
  },

  /** Slide in from right */
  slideRight: {
    hidden:  { opacity: 0, x: 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: EASE_SPRING },
    },
  },

  /** Scale up from slightly smaller */
  scaleUp: {
    hidden:  { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: EASE_SPRING },
    },
  },
} as const;

// ─── Viewport Options (whileInView) ──────────────────────────────────────────
/**
 * Standard viewport config for scroll-triggered animations.
 * Triggers when element is 60px into the viewport; fires once only.
 */
export const inView = { once: true, margin: '-60px' } as const;

// ─── Eyebrow / Badge Class Strings ───────────────────────────────────────────
/**
 * Small uppercase label displayed above section headings.
 * Include a 6px coloured dot before the text for brand consistency.
 *
 * Usage:
 *   <span className={eyebrow.teal}>
 *     <span className="w-1.5 h-1.5 rounded-full bg-teal" />
 *     Section Label
 *   </span>
 */
export const eyebrow = {
  /** On dark backgrounds (navy, dark, teal sections) */
  teal:  'inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal/12 border border-teal/30 rounded-full text-teal text-[11px] font-semibold tracking-[0.18em] uppercase font-heading',
  /** On light backgrounds (surface, white sections) */
  navy:  'inline-flex items-center gap-2 px-3.5 py-1.5 bg-navy/7 border border-navy/18 rounded-full text-navy text-[11px] font-semibold tracking-[0.18em] uppercase font-heading',
  ocean: 'inline-flex items-center gap-2 px-3.5 py-1.5 bg-ocean/8 border border-ocean/22 rounded-full text-ocean text-[11px] font-semibold tracking-[0.18em] uppercase font-heading',
} as const;

// ─── Button Class Strings ─────────────────────────────────────────────────────
/**
 * Reusable button class sets.
 * These align with the site's brand CTAs — use the right variant for each context.
 */
export const btn = {
  /** High-contrast CTA — orange, use for primary actions */
  primary:
    'inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-cta hover:bg-cta/90 text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-xl hover:shadow-cta/35 hover:-translate-y-0.5 active:translate-y-0',

  /** Secondary / outlined — ocean border, for paired CTAs */
  secondary:
    'inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border border-ocean text-ocean hover:bg-ocean hover:text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0',

  /** Ghost — semi-transparent white, for use on dark backgrounds */
  ghost:
    'inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white/8 hover:bg-white/16 text-white font-semibold rounded-xl text-sm border border-white/18 hover:border-white/38 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0',

  /** Outline — for use on light backgrounds */
  outline:
    'inline-flex items-center justify-center gap-2.5 px-7 py-3.5 border border-navy/22 hover:border-navy text-navy hover:bg-navy/5 font-semibold rounded-xl text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0',

  /** Teal filled — alternative strong CTA */
  teal:
    'inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-teal hover:bg-teal/88 text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-xl hover:shadow-teal/30 hover:-translate-y-0.5 active:translate-y-0',
} as const;

// ─── Card Base Class Strings ──────────────────────────────────────────────────
/** Base rounded + overflow for card elements. Combine with a surface variant. */
export const card = {
  /** White card, light border + subtle shadow — for surface/white sections */
  light:  'rounded-2xl bg-white border border-navy/[0.08] shadow-sm',
  /** Navy dark card — for dark/navy sections */
  dark:   'rounded-2xl bg-navy/70 border border-white/10',
  /** Frosted glass — for dark backgrounds with depth */
  glass:  'rounded-2xl bg-white/6 border border-white/12 backdrop-blur-sm',
  /** Off-white tinted — for surface sections with structure */
  tinted: 'rounded-2xl bg-surface border border-navy/[0.08]',
} as const;

// ─── Section Backgrounds ──────────────────────────────────────────────────────
/**
 * Standard section background classes.
 * Pairs with `.section-padding` from globals.css.
 */
export const sectionBg = {
  surface: 'bg-surface',
  white:   'bg-white',
  dark:    'bg-dark',
  navy:    'gradient-navy',
  ocean:   'gradient-ocean',
  teal:    'gradient-teal',
  darkNav: 'gradient-dark',
} as const;

// ─── Box Shadows (inline style values) ────────────────────────────────────────
/**
 * Use these in inline `style` props or Framer Motion `whileHover` objects.
 * For static shadows prefer Tailwind's `shadow-*` utilities.
 */
export const shadows = {
  /** Card resting state */
  card:      '0 2px 16px rgba(11,37,69,0.06)',
  /** Card lifted on hover */
  cardHover: '0 12px 40px rgba(11,37,69,0.14)',
  /** Elevated panel / modal */
  elevated:  '0 20px 60px rgba(11,37,69,0.15)',
  /** CTA (orange) button glow */
  ctaGlow:   '0 10px 40px rgba(255,107,53,0.35)',
  /** Teal button glow */
  tealGlow:  '0 10px 32px rgba(28,167,166,0.30)',
} as const;

// ─── Z-Index Scale ────────────────────────────────────────────────────────────
/**
 * Centralised z-index ladder. Prefer Tailwind `z-*` utilities where possible;
 * use these values for inline styles or dynamic z-index logic.
 */
export const zIndex = {
  base:    0,
  raised:  10,
  overlay: 20,
  modal:   30,
  toast:   40,
  /** Navbar — matches `z-50` on the fixed header */
  nav:     50,
} as const;

// ─── Stagger Delay Helper ──────────────────────────────────────────────────────
/**
 * Returns the Framer Motion `delay` (seconds) for a grid card at `index`.
 * Resets every row so delays never grow beyond ~0.27 s in a large list.
 *
 * @example
 *   transition={{ duration: 0.55, delay: staggerDelay(i) }}      // 3-col grid
 *   transition={{ duration: 0.55, delay: staggerDelay(i, 4) }}   // 4-col grid
 */
export function staggerDelay(index: number, perRow: 2 | 3 | 4 = 3): number {
  return (index % perRow) * 0.09;
}

// ─── Grid Patterns ────────────────────────────────────────────────────────────
/**
 * Standard responsive grid column class strings.
 * Usage: <div className={`grid grid-cols-1 ${grid[3]} gap-6 lg:gap-8`}>
 */
export const grid = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;
