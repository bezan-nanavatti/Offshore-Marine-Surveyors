/**
 * GET /api/dashboard/metrics
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns aggregate counts and a 30-day submission trend for the dashboard.
 * Protected by middleware (valid session cookie required).
 */

import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/submissions';

export const runtime = 'nodejs';

export async function GET(): Promise<NextResponse> {
  const submissions = await getAllSubmissions();

  const now       = Date.now();
  const oneDay    = 86_400_000;
  const weekAgo   = now - 7  * oneDay;
  const thirtyAgo = now - 30 * oneDay;

  let open = 0, inProgress = 0, closed = 0, thisWeek = 0, last30 = 0;

  for (const s of submissions) {
    const ts = new Date(s.timestamp).getTime();
    if (s.status === 'open')             open++;
    else if (s.status === 'in_progress') inProgress++;
    else if (s.status === 'closed')      closed++;
    if (ts >= weekAgo)   thisWeek++;
    if (ts >= thirtyAgo) last30++;
  }

  // ── 30-day daily trend ────────────────────────────────────────────────────
  // Build a map keyed by YYYY-MM-DD for the last 30 days (oldest → newest).
  const trendMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * oneDay);
    trendMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const s of submissions) {
    const date = s.timestamp.slice(0, 10);
    if (trendMap.has(date)) {
      trendMap.set(date, (trendMap.get(date) ?? 0) + 1);
    }
  }
  const trend = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    total:       submissions.length,
    open,
    in_progress: inProgress,
    closed,
    thisWeek,
    last30,
    trend,
  });
}
