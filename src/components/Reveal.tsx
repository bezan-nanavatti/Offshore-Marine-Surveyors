'use client';

/**
 * Reveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable scroll-reveal wrapper component.
 *
 * Wraps any content in a `m.div` that animates into view when the element
 * enters the viewport. All animation parameters come from `@/lib/motion`.
 *
 * Reduced-motion: when the user has `prefers-reduced-motion: reduce` set, all
 * directional motion is removed and only a fast opacity fade is applied.
 *
 * @example — basic (rise from below)
 *   <Reveal>
 *     <ServiceCard />
 *   </Reveal>
 *
 * @example — slide in from left with 0.2 s delay
 *   <Reveal variant="slideLeft" delay={0.2}>
 *     <AboutPanel />
 *   </Reveal>
 *
 * @example — use inside a stagger parent (inherits parent orchestration)
 *   <m.div variants={variants.stagger} initial="hidden" whileInView="visible" viewport={inView}>
 *     <m.div variants={variants.rise}>
 *       <p>Content — animates as part of a stagger sequence</p>
 *     </m.div>
 *   </m.div>
 *   Note: for stagger sequences use m.* directly; Reveal is for standalone reveals.
 */

import { m, useReducedMotion, type Transition } from 'framer-motion';
import { dur, EASE_SPRING, inView, inViewEarly, inViewDeep } from '@/lib/motion';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Content-reveal variants only (excludes stagger containers). */
export type RevealVariant =
  | 'rise'
  | 'riseQuick'
  | 'riseHero'
  | 'fade'
  | 'fadeFast'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp';

type ViewportPreset = 'standard' | 'early' | 'deep';

interface RevealProps {
  children: React.ReactNode;
  /** Animation variant (default: 'rise') */
  variant?: RevealVariant;
  /** Additional delay in seconds */
  delay?: number;
  /** Override animation duration in seconds */
  duration?: number;
  /** When in viewport to trigger (default: 'standard') */
  viewport?: ViewportPreset;
  className?: string;
}

// ─── Variant definitions (duplicated here so Reveal has no design-system dep) ──

import type { Variants } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimVariant = { hidden: any; visible: any };

const contentVariants: Record<RevealVariant, AnimVariant> = {
  rise: {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0,    transition: { duration: dur.slow,  ease: EASE_SPRING } },
  },
  riseQuick: {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0,    transition: { duration: dur.base,  ease: EASE_SPRING } },
  },
  riseHero: {
    hidden:  { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0,    transition: { duration: dur.xslow, ease: EASE_SPRING } },
  },
  fade: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1,          transition: { duration: dur.slow,  ease: 'easeOut' } },
  },
  fadeFast: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1,          transition: { duration: dur.base,  ease: 'easeOut' } },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0,    transition: { duration: dur.slow,  ease: EASE_SPRING } },
  },
  slideRight: {
    hidden:  { opacity: 0, x:  32 },
    visible: { opacity: 1, x: 0,    transition: { duration: dur.slow,  ease: EASE_SPRING } },
  },
  scaleUp: {
    hidden:  { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1,   transition: { duration: dur.slow,  ease: EASE_SPRING } },
  },
};

/** Reduced-motion fallback — opacity fade only, no directional movement. */
const reducedVariant: AnimVariant = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: dur.fast, ease: 'easeOut' } },
};

const viewportMap = {
  standard: inView,
  early:    inViewEarly,
  deep:     inViewDeep,
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Reveal({
  children,
  variant = 'rise',
  delay,
  duration,
  viewport = 'standard',
  className,
}: RevealProps) {
  const reduce = useReducedMotion();

  const base = reduce ? reducedVariant : contentVariants[variant];

  // Override transition if delay or duration props are supplied
  const resolvedVariant =
    delay !== undefined || duration !== undefined
      ? {
          hidden: base.hidden,
          visible: {
            ...(base.visible as object),
            transition: {
              duration: duration ?? dur.slow,
              ease: EASE_SPRING,
              ...(delay !== undefined ? { delay } : {}),
            } satisfies Transition,
          },
        }
      : base;

  return (
    <m.div
      variants={resolvedVariant as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportMap[viewport]}
      className={className}
    >
      {children}
    </m.div>
  );
}
