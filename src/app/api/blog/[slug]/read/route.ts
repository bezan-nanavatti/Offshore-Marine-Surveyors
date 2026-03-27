/**
 * POST /api/blog/[slug]/read
 * Increments and returns the read count for a blog post.
 * Called by BlogPostClient on mount.
 */

import { NextRequest, NextResponse } from 'next/server';
import { incrementReadCount, getReadCount } from '@/lib/read-counts';
import { blogPosts } from '@/lib/blog-posts';

export const runtime = 'nodejs';

// Pre-compute valid slugs at module load for O(1) lookup
const VALID_SLUGS = new Set(blogPosts.map((p) => p.slug));

// ─── Rate limiter ─────────────────────────────────────────────────────────────
// Prevents artificial inflation of read counts.
// Keyed by IP+slug so each visitor can register one read per post per hour.
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const readRateMap = new Map<string, number>(); // key → windowStart

function isReadRateLimited(ip: string, slug: string): boolean {
  const key = `${ip}:${slug}`;
  const now = Date.now();
  const windowStart = readRateMap.get(key);
  if (windowStart && now - windowStart < RATE_WINDOW_MS) return true;
  readRateMap.set(key, now);
  return false;
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { slug } = await context.params;

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // Silently return current count without incrementing if already counted
  if (isReadRateLimited(ip, slug)) {
    return NextResponse.json({ slug, reads: getReadCount(slug) });
  }

  const reads = incrementReadCount(slug);
  return NextResponse.json({ slug, reads });
}
