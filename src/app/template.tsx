/**
 * template.tsx — Next.js App Router page-transition hook
 * ─────────────────────────────────────────────────────────────────────────────
 * Unlike `layout.tsx` which persists across navigations, Next.js gives each
 * template a unique key per route, causing it to remount on every navigation.
 *
 * This is the canonical location for page-transition animations in the App
 * Router. No client-side router wrapping or custom history hacking required.
 *
 * Hierarchy: layout.tsx → template.tsx (remounts) → page.tsx
 */

import PageTransition from '@/components/PageTransition';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
