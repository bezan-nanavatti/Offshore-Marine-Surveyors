/**
 * POST /api/auth/logout
 * Clears the admin session cookie.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, cookieOptions } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
  return NextResponse.json({ ok: true });
}
