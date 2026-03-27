'use client';

/**
 * PageTransition
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps each page in a subtle fade-up entrance.
 *
 * How it works with Next.js 16 App Router:
 *   `template.tsx` (a Server Component) imports this Client Component.
 *   The App Router gives each template a unique key per route, causing it to
 *   remount on every navigation. That remount naturally re-triggers Framer
 *   Motion's `initial` → `animate` cycle — no `AnimatePresence` required.
 *
 * Reduced-motion:
 *   When `prefers-reduced-motion: reduce` is set in the OS, the y offset is
 *   removed and the fade duration collapses to near-instant.
 */

import { m, useReducedMotion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={reduce ? { opacity: 0 } : pageTransition.initial}
      animate={pageTransition.animate}
      transition={
        reduce
          ? { duration: 0.01 }
          : pageTransition.transition
      }
    >
      {children}
    </m.div>
  );
}
