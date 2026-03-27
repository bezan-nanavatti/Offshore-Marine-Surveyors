/**
 * Centralised, type-safe environment variable access.
 *
 * WHY THIS FILE EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 * Scattering `process.env.XYZ` calls throughout the codebase has two failure
 * modes: (1) typos in key names are silently `undefined`, and (2) there is no
 * single place to audit what config the app actually needs.
 *
 * This module solves both problems:
 *   • Every env var is declared exactly once.
 *   • Missing REQUIRED vars throw at module load, not silently at runtime.
 *   • Optional vars have typed fallbacks.
 *   • Callers import `env.SITE_URL` rather than raw `process.env.*`, so
 *     IDE autocomplete catches typos before the build does.
 *
 * RULES
 * ─────────────────────────────────────────────────────────────────────────────
 *   • Public vars (sent to the browser) use NEXT_PUBLIC_ prefix.
 *   • Server-only secrets MUST NOT use NEXT_PUBLIC_ prefix.
 *   • All vars must be documented in .env.example.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the value of `key` from `process.env`.
 * Throws a descriptive error at module load time if the var is absent and no
 * fallback is provided — surface config problems immediately, not at runtime.
 */
function get(key: string, fallback: string): string;
function get(key: string): string;
function get(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(
    `[env] Missing required environment variable "${key}".\n` +
    `Add it to your .env.local file (see .env.example for reference).`
  );
}

// ─── Public env (available in browser bundle) ────────────────────────────────

export const env = {
  /**
   * Canonical origin used in all absolute URLs, sitemaps, OG images, and
   * JSON-LD schemas.  No trailing slash.
   *
   * @example 'https://offshoremarinesurveyors.com'
   */
  SITE_URL: get(
    'NEXT_PUBLIC_SITE_URL',
    'https://offshoremarinesurveyors.com'
  ),

  /** Human-readable brand name used in meta titles and schemas. */
  SITE_NAME: get('NEXT_PUBLIC_SITE_NAME', 'Constellation Marine Services'),

  // ─── Runtime helpers ─────────────────────────────────────────────────────
  NODE_ENV:      process.env.NODE_ENV ?? 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEV:        process.env.NODE_ENV === 'development',

  // ─── SMTP (optional — contact form emails degrade gracefully without these) ──
  // These are read directly by src/app/api/contact/route.ts.  They are listed
  // here for documentation and to emit a startup warning in development.
  SMTP_CONFIGURED: !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ),

  // ─── Future: analytics ───────────────────────────────────────────────────
  // GA_ID: get('NEXT_PUBLIC_GA_MEASUREMENT_ID', ''),
} as const;

// ─── Development startup warnings ─────────────────────────────────────────────
// Image validation runs lazily on first import in dev — safe to call here
// because env.ts is only imported in Node (server) contexts.
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  // Deferred via setImmediate so all data modules finish loading first
  setImmediate(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { checkImagesInDev } = require('./image-check') as { checkImagesInDev: () => void };
      checkImagesInDev();
    } catch {
      // Non-fatal — dev convenience only
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      '[env] SMTP not configured — contact form will save submissions but skip email notifications.\n' +
      'Set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT, SMTP_SECURE,\n' +
      'CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM) in .env.local to enable email.'
    );
  }
  if (!process.env.CONTACT_EMAIL_TO) {
    console.warn(
      '[env] CONTACT_EMAIL_TO not set — team notification emails will be skipped even if SMTP is configured.'
    );
  }
}

export type Env = typeof env;
