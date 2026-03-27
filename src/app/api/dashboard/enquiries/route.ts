/**
 * GET /api/dashboard/enquiries
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a paginated, filtered, sorted list of enquiry submissions.
 * Protected by middleware (valid session cookie required).
 *
 * QUERY PARAMETERS:
 *   status   — "open" | "in_progress" | "closed" | "" (all)
 *   service  — exact service name or "" (all)
 *   search   — searches name, company, email, location, message
 *   sort     — "desc" (newest first, default) | "asc" (oldest first)
 *   page     — page number, 1-indexed (default 1)
 *   limit    — items per page (default 25, max 100)
 *   from     — ISO date string — filter submissions on or after this date
 *   to       — ISO date string — filter submissions on or before this date
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, type Submission } from '@/lib/submissions';

export const runtime = 'nodejs';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const params = req.nextUrl.searchParams;

  const statusFilter  = params.get('status')  ?? '';
  const serviceFilter = params.get('service') ?? '';
  const searchTerm    = (params.get('search') ?? '').toLowerCase().trim();
  const sort          = params.get('sort')    ?? 'desc';
  const rawPage       = parseInt(params.get('page')  ?? '1',  10);
  const rawLimit      = parseInt(params.get('limit') ?? '25', 10);
  const page          = Number.isFinite(rawPage)  ? Math.max(1, rawPage)                    : 1;
  const limit         = Number.isFinite(rawLimit) ? Math.min(100, Math.max(1, rawLimit))    : 25;
  const fromDate      = params.get('from') ?? '';
  const toDate        = params.get('to')   ?? '';

  // Validate date strings before use — invalid dates silently become NaN comparisons
  if (fromDate && isNaN(new Date(fromDate).getTime())) {
    return NextResponse.json({ error: 'Invalid "from" date.' }, { status: 400 });
  }
  if (toDate && isNaN(new Date(toDate).getTime())) {
    return NextResponse.json({ error: 'Invalid "to" date.' }, { status: 400 });
  }

  let submissions = await getAllSubmissions();

  // Filter by status
  if (statusFilter) {
    submissions = submissions.filter((s) => s.status === statusFilter);
  }

  // Filter by service
  if (serviceFilter) {
    submissions = submissions.filter((s) => s.service === serviceFilter);
  }

  // Filter by date range
  if (fromDate) {
    const from = new Date(fromDate).getTime();
    submissions = submissions.filter((s) => new Date(s.timestamp).getTime() >= from);
  }
  if (toDate) {
    // Include the full "to" day by going to end of that day
    const to = new Date(toDate).getTime() + 86_400_000 - 1;
    submissions = submissions.filter((s) => new Date(s.timestamp).getTime() <= to);
  }

  // Full-text search across key fields
  if (searchTerm) {
    submissions = submissions.filter((s: Submission) => {
      const hay = [s.name, s.company, s.email, s.location, s.phone, s.message]
        .join(' ')
        .toLowerCase();
      return hay.includes(searchTerm);
    });
  }

  // Sort
  submissions.sort((a, b) => {
    const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return sort === 'asc' ? diff : -diff;
  });

  const total = submissions.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data  = submissions.slice(start, start + limit);

  return NextResponse.json({ submissions: data, total, page, pages, limit });
}
