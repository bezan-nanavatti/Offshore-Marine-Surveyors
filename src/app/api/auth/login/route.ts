/**
 * POST /api/auth/login
 * ─────────────────────────────────────────────────────────────────────────────
 * Authenticates an admin and sets a session cookie.
 *
 * SECURITY:
 *   • Rate limited: 5 attempts per IP per 15 minutes (brute-force protection)
 *   • Passwords compared with bcrypt.compare (timing-safe)
 *   • Generic error message — never reveals whether adminId or password is wrong
 *   • JWT stored in HttpOnly, Secure, SameSite=Strict cookie
 *   • For multi-instance/Vercel deployments: replace the in-memory rate limiter
 *     with a Redis-backed one (the Map resets on server restart)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findAdmin, verifyPassword } from '@/lib/admins';
import { signToken, COOKIE_NAME, cookieOptions } from '@/lib/auth';

export const runtime = 'nodejs';

// ─── In-memory rate limiter (per IP) ─────────────────────────────────────────
// Resets on server restart — acceptable for single-instance deployments.
// For multi-instance (Vercel / Docker swarm): replace with Redis.

const MAX_ATTEMPTS  = 5;
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes

interface RateEntry { count: number; resetAt: number }
const rateMap = new Map<string, RateEntry>();

function checkRate(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now   = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true };
}

function clearRate(ip: string): void {
  rateMap.delete(ip);
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit check
  const rate = checkRate(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rate.retryAfterSec} seconds.` },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSec) },
      }
    );
  }

  // Parse body
  let body: { adminId?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { adminId, password } = body;
  if (!adminId || !password) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Consistent delay on every failed attempt — prevents timing-based
  // enumeration of whether the adminId exists or the password is wrong.
  const delay = () => new Promise((r) => setTimeout(r, 150 + Math.random() * 200));

  // Look up admin
  const admin = await findAdmin(adminId.trim());
  if (!admin) {
    await delay();
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Verify password
  const valid = await verifyPassword(admin, password);
  if (!valid) {
    await delay();
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Success — clear rate limit and issue session
  clearRate(ip);

  const token = await signToken({ sub: admin.id, adminId: admin.adminId });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, cookieOptions);

  return NextResponse.json({ ok: true, adminId: admin.adminId });
}
