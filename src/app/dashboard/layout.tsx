/**
 * Dashboard layout — completely separate from the public site.
 * No public navbar or footer rendered here.
 * Route protection is handled by middleware.ts, not here.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:  'Dashboard — Constellation Marine Services',
  robots: { index: false, follow: false }, // Never index dashboard pages
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: 'system-ui, Arial, sans-serif' }}>
      {children}
    </div>
  );
}
