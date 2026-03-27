/**
 * HTML Sanitisation — Constellation Marine Services
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHY THIS EXISTS
 * ───────────────
 * Any HTML string rendered via `dangerouslySetInnerHTML` is an injection
 * surface if the content ever comes from outside the codebase (a CMS, an API,
 * user input).  This module provides:
 *
 *   1. A branded `TrustedHtml` type — makes trust explicit in the type system.
 *   2. `asTrustedHtml()` — for content authored in source code (blog-posts.ts
 *      etc.) where you own the HTML and can guarantee it is safe.
 *   3. `sanitizeHtml()` — strips the most dangerous patterns from a string
 *      before marking it trusted.  Use this for any content that arrives from
 *      outside the repository.
 *
 * CURRENT STATE
 * ─────────────
 * All blog and service content is hardcoded TypeScript in this repo.  The
 * risk is low but the pattern is established now so that adding a CMS later
 * requires only swapping `asTrustedHtml` for `sanitizeHtml` at the call site —
 * the rest of the codebase stays identical.
 *
 * UPGRADING TO A FULL SANITISER
 * ──────────────────────────────
 * When content starts arriving from external sources (Contentful, Sanity,
 * user submissions), replace the body of `sanitizeHtml` with DOMPurify:
 *
 *   npm install isomorphic-dompurify
 *   npm install -D @types/dompurify
 *
 *   import DOMPurify from 'isomorphic-dompurify';
 *
 *   export function sanitizeHtml(html: string): TrustedHtml {
 *     return DOMPurify.sanitize(html, {
 *       ALLOWED_TAGS: SAFE_TAGS,
 *       ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class',
 *                      'width', 'height', 'loading', 'target', 'rel',
 *                      'colspan', 'rowspan', 'scope'],
 *       FORCE_BODY:   true,
 *     }) as TrustedHtml;
 *   }
 */

// ─── Branded type ─────────────────────────────────────────────────────────────

declare const __htmlBrand: unique symbol;

/**
 * A string that has been explicitly marked as safe HTML.
 * Only obtainable through `asTrustedHtml()` or `sanitizeHtml()`.
 *
 * Pass `TrustedHtml` to `dangerouslySetInnerHTML`:
 *   <div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
 */
export type TrustedHtml = string & { readonly [__htmlBrand]: 'TrustedHtml' };

// ─── Tag / attribute allowlists (used by the lightweight sanitiser) ───────────

const SAFE_TAGS = new Set([
  'p', 'br', 'hr', 'wbr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  'a', 'img',
  'blockquote', 'pre', 'code', 'kbd', 'samp',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'main',
  'figure', 'figcaption',
  'details', 'summary',
]);

/** Patterns that must never appear in rendered HTML regardless of source. */
const DANGEROUS_PATTERNS = [
  // Script injection
  /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
  // Inline frames
  /<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi,
  // Plugin embeds
  /<(object|embed|applet)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
  // Self-closing variants
  /<(iframe|object|embed|applet)\b[^>]*\/\s*>/gi,
  // SVG foreignObject (script execution vector)
  /<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject\s*>/gi,
] as const;

/** Attribute-level injection patterns. */
const DANGEROUS_ATTRS = [
  // All on* event handlers  (onclick=, onmouseover=, etc.)
  /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
  // javascript: URI in href / src / action
  /(href|src|action|formaction)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi,
  // data: URI in src (script execution in some browsers)
  /src\s*=\s*["']?\s*data:(?!image\/)[^"'\s>]*/gi,
  // vbscript: URI
  /(href|src)\s*=\s*["']?\s*vbscript:[^"'\s>]*/gi,
] as const;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Assert that a **developer-authored** HTML string is safe, bypassing
 * sanitisation for performance.
 *
 * ⚠️  Only call this for content defined in the source code of this repository
 *    (e.g. blog-posts.ts, services-data.ts).  Never pass user input or CMS
 *    content here — use `sanitizeHtml()` instead.
 *
 * In development, a warning is logged if suspicious patterns are found so that
 * accidental misuse is caught during local testing.
 */
export function asTrustedHtml(html: string): TrustedHtml {
  if (process.env.NODE_ENV === 'development') {
    const suspicious =
      /<script|javascript:|vbscript:|on\w+\s*=|<iframe|<object|<embed|<applet/i;
    if (suspicious.test(html)) {
      console.warn(
        '[sanitize] asTrustedHtml() received potentially dangerous HTML.\n' +
        'Switch to sanitizeHtml() if this content is not developer-authored.\n' +
        'Snippet:', html.slice(0, 120)
      );
    }
  }
  return html as TrustedHtml;
}

/**
 * Strip dangerous patterns from an HTML string, then mark it as trusted.
 *
 * Removes: `<script>`, `<iframe>`, `<object>`, `<embed>`, inline event
 * handlers (`on*=`), `javascript:` and `vbscript:` URIs, and non-image
 * `data:` URIs.
 *
 * Use this for any HTML that originates outside the repository — CMS fields,
 * API responses, user-submitted rich text.
 *
 * For production-grade coverage, replace the body with DOMPurify (see module
 * header comment for the exact migration path).
 */
export function sanitizeHtml(html: string): TrustedHtml {
  let clean = html;

  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, '');
  }
  for (const pattern of DANGEROUS_ATTRS) {
    clean = clean.replace(pattern, '');
  }

  // Verify no unknown tags remain outside the allowlist only in dev mode —
  // a full allowlist strip in prod would break legitimate HTML authored by
  // developers, so we stay conservative and only strip known-bad patterns.
  if (process.env.NODE_ENV === 'development') {
    const tagPattern = /<([a-z][a-z0-9]*)\b/gi;
    let match: RegExpExecArray | null;
    while ((match = tagPattern.exec(clean)) !== null) {
      const tag = match[1].toLowerCase();
      if (!SAFE_TAGS.has(tag)) {
        console.warn(
          `[sanitize] sanitizeHtml() found non-allowlisted tag <${tag}>. ` +
          `Add it to SAFE_TAGS if intentional.`
        );
      }
    }
  }

  return clean as TrustedHtml;
}

// ─── Utility: strip all HTML (for plain-text contexts) ───────────────────────

/**
 * Remove all HTML tags and decode common entities — useful for generating
 * plain-text excerpts or aria-label values from HTML content.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Re-export allowlist for external consumers ───────────────────────────────
export { SAFE_TAGS };
