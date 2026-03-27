/**
 * POST /api/contact
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles contact form submissions:
 *   1. Server-side validation (mirrors client-side rules)
 *   2. Saves the submission to MongoDB (primary) → data/submissions.json (fallback)
 *   3. Sends a notification email to the team via SMTP
 *   4. Sends an auto-reply confirmation email to the submitter
 *
 * ENVIRONMENT VARIABLES (set in .env.local):
 *   SMTP_HOST          e.g. smtp.gmail.com
 *   SMTP_PORT          e.g. 587
 *   SMTP_SECURE        "true" for port 465, "false" for STARTTLS
 *   SMTP_USER          your@email.com
 *   SMTP_PASS          app-password or SMTP password
 *   CONTACT_EMAIL_TO   where to send notifications (team inbox)
 *   CONTACT_EMAIL_FROM display "from" address for team notification
 *   NOREPLY_EMAIL_FROM "from" address for auto-reply (defaults to noreply@offshoremarinesurveyors.com)
 *
 * SECURITY:
 *   • Input length limits enforced server-side (DoS prevention)
 *   • Email regex validated server-side (bypass-proof)
 *   • Service is required and validated against an allowlist
 *   • Honeypot field: requests with `website` field set are silently discarded
 *   • IP address logged for abuse tracking (never exposed to client)
 *   • Node.js runtime (not Edge) required for nodemailer and file I/O
 */

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveSubmission } from '@/lib/submissions';

export const runtime = 'nodejs';

// ─── Rate limiting ────────────────────────────────────────────────────────────
// In-memory store — resets on Lambda cold start (acceptable for abuse deterrence).
// Upgrade to Vercel KV / Upstash Redis for durable rate limiting across instances.

const RATE_LIMIT_MAX   = 10;             // max requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

interface RateEntry { count: number; windowStart: number }
const rateLimitStore = new Map<string, RateEntry>();

/** Returns true if the IP has exceeded the rate limit. */
function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    // New window
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

// ─── Input sanitisation ───────────────────────────────────────────────────────

/**
 * Strip ASCII control characters (U+0000–U+001F, U+007F) and Unicode
 * direction-override / zero-width characters that could be used to spoof
 * log output or cause unexpected rendering in emails.
 *
 * Preserves normal whitespace (space, tab, CR, LF).
 */
function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    // Remove control chars except tab (09), LF (0A), CR (0D)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Remove Unicode BiDi overrides and zero-width chars
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g, '')
    .trim();
}

// ─── Validation ───────────────────────────────────────────────────────────────

const LIMITS = {
  name:     { min: 2,  max: 100  },
  company:  { min: 0,  max: 100  },
  email:    { min: 5,  max: 254  },
  phone:    { min: 0,  max: 30   },
  location: { min: 0,  max: 100  },
  message:  { min: 10, max: 2000 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const KNOWN_SERVICES = new Set([
  'Marine Warranty Survey',
  'Rig Positioning & Moving',
  'Cargo & Damage Survey',
  'Marine Casualties',
  'Project Management',
  'Technical Due Diligence',
  'eCMID Audits',
  'Dispute & Litigation Support',
  'Offshore Survey',
  'Hull & Machinery Survey',
  'Other',
]);

interface ContactPayload {
  name:     string;
  company:  string;
  email:    string;
  phone:    string;
  location: string;
  service:  string;
  message:  string;
  website?: string; // honeypot
}

function validate(body: ContactPayload): string | null {
  const { name, company, email, phone, location, message, service } = body;

  if (!name || name.trim().length < LIMITS.name.min)
    return 'Name is required (min 2 characters).';
  if (name.length > LIMITS.name.max)
    return `Name must be ${LIMITS.name.max} characters or fewer.`;

  if (company && company.length > LIMITS.company.max)
    return `Company must be ${LIMITS.company.max} characters or fewer.`;

  if (!email || !EMAIL_RE.test(email))
    return 'A valid email address is required.';
  if (email.length > LIMITS.email.max)
    return `Email must be ${LIMITS.email.max} characters or fewer.`;

  if (phone && phone.length > LIMITS.phone.max)
    return `Phone must be ${LIMITS.phone.max} characters or fewer.`;

  if (location && location.length > LIMITS.location.max)
    return `Location must be ${LIMITS.location.max} characters or fewer.`;

  if (!service || !KNOWN_SERVICES.has(service))
    return 'Please select a valid service.';

  if (!message || message.trim().length < LIMITS.message.min)
    return `Message must be at least ${LIMITS.message.min} characters.`;
  if (message.length > LIMITS.message.max)
    return `Message must be ${LIMITS.message.max} characters or fewer.`;

  return null;
}

// ─── Email helpers ────────────────────────────────────────────────────────────

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host:   SMTP_HOST,
    port:   Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === 'true',
    auth:   { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// Team notification email
function buildNotificationHtml(data: ContactPayload, ip: string, id: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Enquiry</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0E1B2A;">
  <div style="background:#0B2545;padding:24px;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">New Website Enquiry</h1>
    <p style="color:#1CA7A6;margin:4px 0 0;font-size:13px;">Constellation Marine Services — offshoremarinesurveyors.com</p>
  </div>
  <div style="background:#F5F7FA;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e0e5ec;border-top:none;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;font-weight:bold;width:130px;color:#0B2545;">Name</td><td style="padding:8px 0;">${esc(data.name)}</td></tr>
      ${data.company ? `<tr><td style="padding:8px 0;font-weight:bold;color:#0B2545;">Company</td><td style="padding:8px 0;">${esc(data.company)}</td></tr>` : ''}
      <tr><td style="padding:8px 0;font-weight:bold;color:#0B2545;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}" style="color:#1E5A8A;">${esc(data.email)}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:8px 0;font-weight:bold;color:#0B2545;">Phone</td><td style="padding:8px 0;">${esc(data.phone)}</td></tr>` : ''}
      ${data.location ? `<tr><td style="padding:8px 0;font-weight:bold;color:#0B2545;">Location</td><td style="padding:8px 0;">${esc(data.location)}</td></tr>` : ''}
      <tr><td style="padding:8px 0;font-weight:bold;color:#0B2545;">Service</td><td style="padding:8px 0;">${esc(data.service)}</td></tr>
    </table>
    <div style="margin-top:16px;padding:16px;background:#fff;border-radius:6px;border:1px solid #dde3ed;">
      <p style="font-weight:bold;margin:0 0 8px;color:#0B2545;">Message</p>
      <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${esc(data.message)}</p>
    </div>
    <p style="margin:16px 0 0;font-size:11px;color:#8895a7;">
      Submission ID: ${esc(id)} &nbsp;|&nbsp; IP: ${esc(ip)} &nbsp;|&nbsp; ${new Date().toUTCString()}
    </p>
  </div>
</body>
</html>`;
}

// Auto-reply to submitter
function buildAutoReplyHtml(data: ContactPayload, id: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Enquiry Received</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0E1B2A;">
  <div style="background:#0B2545;padding:28px 24px;border-radius:8px 8px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">Enquiry Received</h1>
    <p style="color:#1CA7A6;margin:6px 0 0;font-size:13px;">Constellation Marine Services LLC</p>
  </div>
  <div style="background:#ffffff;padding:28px 24px;border-radius:0 0 8px 8px;border:1px solid #e0e5ec;border-top:none;">
    <p style="font-size:15px;margin:0 0 16px;">Dear ${esc(data.name)},</p>
    <p style="font-size:14px;line-height:1.7;margin:0 0 16px;color:#333;">
      Thank you for getting in touch with Constellation Marine Services. We have received your enquiry
      regarding <strong>${esc(data.service)}</strong> and a member of our team will review it
      and respond to you as soon as possible.
    </p>
    <p style="font-size:14px;line-height:1.7;margin:0 0 24px;color:#333;">
      For urgent matters, please contact us directly:
    </p>
    <div style="background:#F5F7FA;padding:16px;border-radius:6px;border-left:3px solid #1CA7A6;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:13px;"><strong>Abu Dhabi (HQ):</strong> <a href="tel:+97126713320" style="color:#1E5A8A;">+971 2671 3320</a></p>
      <p style="margin:0 0 6px;font-size:13px;"><strong>Email:</strong> <a href="mailto:info@offshoremarinesurveyors.com" style="color:#1E5A8A;">info@offshoremarinesurveyors.com</a></p>
      <p style="margin:0;font-size:13px;"><strong>WhatsApp 24/7:</strong> <a href="https://wa.me/971501889614" style="color:#1E5A8A;">+971 501 889 614</a></p>
    </div>
    <p style="font-size:12px;color:#8895a7;margin:0;">
      Reference: ${esc(id)}<br>
      Please quote this reference in any follow-up communication.
    </p>
  </div>
  <div style="padding:16px 24px;text-align:center;">
    <p style="font-size:11px;color:#aab4c0;margin:0;">
      This is an automated confirmation. Please do not reply to this email.<br>
      Constellation Marine Services LLC — <a href="https://offshoremarinesurveyors.com" style="color:#1E5A8A;">offshoremarinesurveyors.com</a>
    </p>
  </div>
</body>
</html>`;
}

async function sendEmails(
  data: ContactPayload,
  ip: string,
  id: string
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      '[api/contact] SMTP not configured — skipping email notifications.\n' +
      'Set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_TO in .env.local'
    );
    return;
  }

  const { CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM, NOREPLY_EMAIL_FROM, SMTP_USER } = process.env;

  // 1. Team notification
  if (CONTACT_EMAIL_TO) {
    const fromAddr  = CONTACT_EMAIL_FROM ?? SMTP_USER ?? '';
    const subject   = `New enquiry — ${data.service} from ${data.name}`;
    await transporter.sendMail({
      from:    `"Constellation Marine Services Website" <${fromAddr}>`,
      to:      CONTACT_EMAIL_TO,
      replyTo: `"${data.name}" <${data.email}>`,
      subject,
      html:    buildNotificationHtml(data, ip, id),
      text:
        `New enquiry from ${data.name} (${data.email})\n` +
        `Company: ${data.company || 'N/A'}\n` +
        `Phone: ${data.phone || 'N/A'}\n` +
        `Location: ${data.location || 'N/A'}\n` +
        `Service: ${data.service}\n\n` +
        `Message:\n${data.message}\n\n` +
        `ID: ${id} | IP: ${ip} | ${new Date().toUTCString()}`,
    });
  }

  // 2. Auto-reply to submitter
  const noreplyFrom = NOREPLY_EMAIL_FROM ?? 'noreply@offshoremarinesurveyors.com';
  await transporter.sendMail({
    from:    `"Constellation Marine Services" <${noreplyFrom}>`,
    to:      `"${data.name}" <${data.email}>`,
    subject: `Enquiry Received — Ref: ${id}`,
    html:    buildAutoReplyHtml(data, id),
    text:
      `Dear ${data.name},\n\n` +
      `Thank you for your enquiry regarding ${data.service}.\n` +
      `We have received your message and will get back to you shortly.\n\n` +
      `For urgent matters, please call us on +971 2671 3320 or WhatsApp +971 501 889 614.\n\n` +
      `Reference: ${id}\n\n` +
      `Constellation Marine Services LLC\n` +
      `offshoremarinesurveyors.com\n\n` +
      `--- This is an automated confirmation. Please do not reply to this email. ---`,
  });
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid content type.' }, { status: 415 });
  }

  // Extract IP early — needed for rate limiting before body parsing
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit — checked early, before body parsing
  if (isRateLimited(ip)) {
    console.warn(`[api/contact] Rate limit exceeded for IP ${ip}`);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // Honeypot — bots fill the hidden "website" field; humans never see it
  if (body.website) {
    return NextResponse.json({ ok: true }); // Silent discard
  }

  const error = validate(body);
  if (error) {
    return NextResponse.json({ error }, { status: 422 });
  }

  // Build one sanitized payload used for both storage and email sending.
  // CR/LF are stripped from name and email specifically to prevent SMTP
  // header injection (sanitizeText preserves them for DB storage but they
  // must not appear in To:, Subject:, or Reply-To: headers).
  const clean: ContactPayload = {
    name:     sanitizeText(body.name).replace(/[\r\n]/g, ' ').trim(),
    company:  sanitizeText(body.company ?? ''),
    email:    sanitizeText(body.email).toLowerCase().replace(/[\r\n]/g, ''),
    phone:    sanitizeText(body.phone ?? ''),
    location: sanitizeText(body.location ?? ''),
    service:  body.service,   // already validated against allowlist
    message:  sanitizeText(body.message),
  };

  const submission = await saveSubmission({ ...clean, ip });

  // Send emails (non-blocking — don't fail the request if email fails)
  sendEmails(clean, ip, submission.id).catch((err) => {
    console.error('[api/contact] Email send failed:', err);
  });

  return NextResponse.json({ ok: true, id: submission.id });
}
