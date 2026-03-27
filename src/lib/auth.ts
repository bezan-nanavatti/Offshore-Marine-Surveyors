/**
 * Authentication helpers — JWT signing/verification and cookie configuration.
 *
 * Uses `jose` (Web Crypto API) so this module works in both Node.js and Edge
 * runtimes (required for Next.js middleware).
 *
 * SESSION SECURITY:
 *   • Tokens are signed HS256 with DASHBOARD_JWT_SECRET (32-byte hex key)
 *   • Stored in an HttpOnly, Secure, SameSite=Strict cookie — JS can't read it
 *   • 7-day expiry with no silent refresh (admin must re-login after expiry)
 *
 * ENVIRONMENT VARIABLES:
 *   DASHBOARD_JWT_SECRET — 32-byte random hex. Generate with:
 *     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { SignJWT, jwtVerify } from 'jose';

// ─── Constants ───────────────────────────────────────────────────────────────

export const COOKIE_NAME         = 'oms_admin_session';
export const SESSION_DURATION_S  = 7 * 24 * 60 * 60; // 7 days
const JWT_ALG                    = 'HS256';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminTokenPayload {
  sub:     string; // admin UUID
  adminId: string; // human-readable admin username
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSecret(): Uint8Array {
  const s = process.env.DASHBOARD_JWT_SECRET;
  if (!s) throw new Error('[auth] DASHBOARD_JWT_SECRET is not set. Add it to .env.local.');
  return new TextEncoder().encode(s);
}

// ─── Token operations ────────────────────────────────────────────────────────

export async function signToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_S}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [JWT_ALG],
    });
    return {
      sub:     payload.sub as string,
      adminId: payload.adminId as string,
    };
  } catch {
    return null;
  }
}

// ─── Cookie options ──────────────────────────────────────────────────────────

export const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path:     '/',
  maxAge:   SESSION_DURATION_S,
};
