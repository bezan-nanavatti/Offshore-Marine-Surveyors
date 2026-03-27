/**
 * ════════════════════════════════════════════════════════════════
 *  Constellation Marine Services — Animation System
 * ════════════════════════════════════════════════════════════════
 *
 *  Single source of truth for all Framer Motion configuration.
 *
 *  Performance contract
 *  ─────────────────────────────────────────────────────────────
 *  • Only animate compositor-friendly properties: opacity, transform
 *    (translate, scale, rotate). Never animate width, height, top,
 *    left, margin, or padding — these trigger layout reflow.
 *  • All scroll-reveal triggers fire once (once: true).
 *  • Durations are calibrated to content weight — heavier / more
 *    prominent elements animate slower.
 *
 *  Stack: Framer Motion 12 · React 19 · Next.js 16
 * ════════════════════════════════════════════════════════════════
 */

// ─── Easing Curves ────────────────────────────────────────────────────────────

type Ease4 = [number, number, number, number];

/**
 * Spring-like cubic-bezier — fast out, no overshoot.
 * Default for reveals and entrances.
 */
export const EASE_SPRING: Ease4 = [0.16, 1, 0.3, 1];

/**
 * Smooth deceleration — elements that glide softly into place.
 * Used for split-layout reveals (e.g. ContactCTA panels).
 */
export const EASE_SMOOTH: Ease4 = [0.25, 0.46, 0.45, 0.94];

/**
 * Sharp — fast start, clean stop.
 * For UI feedback elements responding to input.
 */
export const EASE_SHARP: Ease4 = [0.4, 0, 0.2, 1];

/** Decelerate (ease-out) — elements entering the screen. */
export const EASE_ENTER: Ease4 = [0, 0, 0.2, 1];

/** Accelerate (ease-in) — elements leaving the screen. */
export const EASE_EXIT: Ease4 = [0.4, 0, 1, 1];

// ─── Duration Scale ───────────────────────────────────────────────────────────

/**
 * Calibrated duration scale in seconds.
 *
 * Rule: heavier / more important elements animate slower.
 * All values are compositor-budget-friendly (≤ 1 s).
 */
export const dur = {
  /** Immediate feedback — hover state transitions */
  instant: 0.15,
  /** Micro-interactions — icon hovers, button state */
  fast:    0.30,
  /** Card and list-item reveals */
  base:    0.55,
  /** Section header / body copy reveals */
  slow:    0.75,
  /** Hero headline — the most prominent entrance on the page */
  xslow:   0.85,
  /** Page transition — subtle, must not fight section animations */
  page:    0.38,
} as const;

// ─── Viewport Trigger Options ─────────────────────────────────────────────────

/**
 * once: true  — animation fires once and stays; no replay on scroll-back.
 * margin       — how far the element must enter the viewport before firing.
 */

/** Standard: element 60 px into viewport (default). */
export const inView      = { once: true, margin: '-60px'  } as const;
/** Early: fires sooner — for tall elements entering the viewport slowly. */
export const inViewEarly = { once: true, margin: '-20px'  } as const;
/** Deep: fires later — element well inside the viewport before animating. */
export const inViewDeep  = { once: true, margin: '-120px' } as const;

// ─── Motion Variants ──────────────────────────────────────────────────────────

/**
 * Framer Motion variant presets.
 *
 * ── Scroll-reveal (whileInView) ────────────────────────────────────────────
 *
 *   <motion.section variants={variants.stagger} initial="hidden" whileInView="visible" viewport={inView}>
 *     <motion.h2  variants={variants.rise}>Section heading</motion.h2>
 *     <motion.p   variants={variants.rise}>Body copy</motion.p>
 *   </motion.section>
 *
 * ── On-mount (hero, page) ───────────────────────────────────────────────────
 *
 *   <motion.div variants={variants.staggerHero} initial="hidden" animate="visible">
 *     <motion.h1 variants={variants.riseHero}>Hero headline</motion.h1>
 *   </motion.div>
 */
export const variants = {

  // ── Stagger containers ──────────────────────────────────────────────────────

  /** Standard: 0.10 s between children — sections, card grids */
  stagger: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
  },

  /** Slow: 0.14 s — longer lists, deliberate sequential reveals */
  staggerSlow: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.10 } },
  },

  /** Hero: 0.16 s — generous pacing for full-viewport entrance */
  staggerHero: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
  },

  // ── Content reveals ─────────────────────────────────────────────────────────

  /**
   * Rise — standard scroll-reveal: fades up from 40 px below.
   * Use for section headings, body paragraphs, card grids.
   */
  rise: {
    hidden:  { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.slow, ease: EASE_SPRING },
    },
  },

  /**
   * Rise Quick — dense grids, secondary supporting text.
   * Shorter offset and duration keeps dense layouts feeling snappy.
   */
  riseQuick: {
    hidden:  { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.base, ease: EASE_SPRING },
    },
  },

  /**
   * Rise Hero — full-viewport hero headline entrance.
   * Larger y offset (48 px) and longer duration (0.85 s) give it weight.
   */
  riseHero: {
    hidden:  { opacity: 0, y: 48 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: dur.xslow, ease: EASE_SPRING },
    },
  },

  /**
   * Fade — opacity only. Use for decorative elements, overlays,
   * background layers, or stat strips that should not jump.
   */
  fade: {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: dur.slow, ease: 'easeOut' as const },
    },
  },

  /**
   * Fade Fast — quick reveal for supplementary items in dense layouts.
   */
  fadeFast: {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: dur.base, ease: 'easeOut' as const },
    },
  },

  /**
   * Slide Left — enters from the left.
   * Use for split-layout left panels, sidebar content.
   */
  slideLeft: {
    hidden:  { opacity: 0, x: -32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: dur.slow, ease: EASE_SPRING },
    },
  },

  /**
   * Slide Right — enters from the right.
   * Use for split-layout right panels, contact cards.
   */
  slideRight: {
    hidden:  { opacity: 0, x: 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: dur.slow, ease: EASE_SPRING },
    },
  },

  /**
   * Scale Up — scales from 94% to 100% while fading in.
   * Use for modal entries, feature highlights, map overlays.
   */
  scaleUp: {
    hidden:  { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: dur.slow, ease: EASE_SPRING },
    },
  },

} as const;

// ─── Card Hover Effects ───────────────────────────────────────────────────────

/**
 * Spread directly into Framer Motion's `whileHover` prop.
 * Only compositor-safe properties (transform) are used.
 *
 * @example
 *   <motion.div whileHover={hover.lift} transition={hoverTransition}>
 *     <ServiceCard />
 *   </motion.div>
 */
export const hover = {
  /** Standard card lift — 4 px upward. Use on most cards. */
  lift:       { y: -4 },
  /** Strong lift — 6 px, for larger hero-style cards. */
  liftStrong: { y: -6 },
  /** Subtle scale — icon containers, avatar badges. */
  scale:      { scale: 1.06 },
  /** Scale + slight rotate — icon marks, brand glyphs. */
  icon:       { scale: 1.08, rotate: 3 },
  /** Combined lift + scale — for prominently featured cards. */
  liftScale:  { y: -4, scale: 1.02 },
} as const;

/**
 * Transition to pair with `hover.*` objects.
 * Snappy and immediate — feedback must feel instantaneous.
 */
export const hoverTransition = {
  duration: dur.fast,
  ease: EASE_SPRING,
} as const;

// ─── Page Transition Config ───────────────────────────────────────────────────

/**
 * Used by `PageTransition.tsx` which is rendered inside `template.tsx`.
 *
 * The Next.js App Router `template` file remounts on every navigation,
 * so Framer Motion's `initial` → `animate` naturally fires on each route change
 * without requiring `AnimatePresence`.
 *
 * Design intent: subtle fade-up — barely perceptible but polishes the feel.
 * Must not fight the hero entrance or section reveals beneath it.
 */
export const pageTransition = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: dur.page, ease: EASE_SPRING },
} as const;

// ─── Scroll Indicator ─────────────────────────────────────────────────────────

/**
 * Bouncing chevron at the bottom of the hero — cues the user to scroll.
 * Spread as props onto a `motion.div` wrapping the icon.
 *
 * @example
 *   <motion.div {...scrollIndicator}>
 *     <ChevronDown className="w-4 h-4" />
 *   </motion.div>
 */
export const scrollIndicator = {
  animate:    { y: [0, 7, 0] as number[] },
  transition: { repeat: Infinity, duration: 1.9, ease: 'easeInOut' as const },
};

// ─── Stagger Delay Helper ─────────────────────────────────────────────────────

/**
 * Returns the Framer Motion `delay` (in seconds) for a grid card at `index`.
 * Resets every row — prevents cumulative delays from growing in large grids.
 *
 * @param index  — zero-based card index in the grid
 * @param perRow — number of columns (default 3)
 *
 * @example
 *   // 3-col grid
 *   transition={{ duration: dur.base, delay: staggerDelay(i) }}
 *   // 4-col grid
 *   transition={{ duration: dur.base, delay: staggerDelay(i, 4) }}
 */
export function staggerDelay(index: number, perRow: 2 | 3 | 4 = 3): number {
  return (index % perRow) * 0.09;
}
