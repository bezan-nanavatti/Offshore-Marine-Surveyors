/**
 * PATCH /api/dashboard/enquiries/[id]
 * ─────────────────────────────────────────────────────────────────────────────
 * Updates the status of a single enquiry and records the admin who changed it.
 * Protected by middleware (valid session cookie required).
 *
 * BODY: { "status": "open" | "in_progress" | "closed" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateSubmissionStatus, type SubmissionStatus } from '@/lib/submissions';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export const runtime = 'nodejs';

const VALID_STATUSES = new Set<string>(['open', 'in_progress', 'closed']);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID.' }, { status: 400 });
  }

  // Extract the logged-in admin's identity from the JWT cookie.
  // Middleware already validated the cookie — this is purely for the audit log.
  let adminId = 'unknown';
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) adminId = payload.adminId;
    }
  } catch {
    // Non-critical — proceed with "unknown" adminId
  }

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json(
      { error: 'status must be "open", "in_progress", or "closed".' },
      { status: 422 }
    );
  }

  const updated = await updateSubmissionStatus(id, body.status as SubmissionStatus, adminId);
  if (!updated) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
