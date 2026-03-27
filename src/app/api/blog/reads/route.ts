/**
 * GET /api/blog/reads
 * Returns all read counts as { [slug]: number }.
 * Used by BlogListClient when sorting by "Most Read".
 */

import { NextResponse } from 'next/server';
import { getAllReadCounts } from '@/lib/read-counts';

export const runtime = 'nodejs';

export function GET(): NextResponse {
  const counts = getAllReadCounts();
  return NextResponse.json(counts);
}
