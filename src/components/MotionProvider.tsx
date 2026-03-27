'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Wraps the app in Framer Motion's LazyMotion with the domAnimation feature
 * bundle. This defers loading the animation engine (~25 KB) until needed and
 * replaces the full `motion` import (~31 KB) across all components.
 *
 * All components must use `m.div`, `m.section`, etc. (from `import { m }`)
 * instead of `motion.div` for this to take effect.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
