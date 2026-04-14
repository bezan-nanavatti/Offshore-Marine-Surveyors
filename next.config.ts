import type { NextConfig } from "next";

// ─── Security Headers ─────────────────────────────────────────────────────────
//
// Applied to every response via the `headers()` function below.
// See: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
//
// CONTENT SECURITY POLICY NOTES
// ──────────────────────────────
// • `script-src 'unsafe-inline'` is required for Next.js inline hydration
//   scripts and the JSON-LD <script> tags we inject via dangerouslySetInnerHTML.
//   To remove it in a future hardening pass, adopt a nonce-based CSP with the
//   Next.js `generateBuildId` approach or the experimental `nonce` middleware.
//
// • `style-src 'unsafe-inline'` is required for Tailwind's JIT CSS-in-JS
//   technique and for Next.js layout shift prevention styles.
//
// • `font-src ... fonts.gstatic.com` is required for Google Fonts.
//   Remove if you self-host fonts (recommended for stricter CSP).
//
// • `connect-src 'self'` allows only same-origin XHR/fetch.
//   Add analytics/telemetry origins here when wiring up GA, Sentry, etc.
//   e.g. 'https://*.google-analytics.com https://*.analytics.google.com'

const isDev = process.env.NODE_ENV === 'development';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Next.js hydration + JSON-LD inline scripts.
  // React requires eval() in dev mode for call-stack reconstruction; never in prod.
  // Cloudflare Turnstile script is loaded from challenges.cloudflare.com.
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind JIT + Next.js critical CSS + Google Fonts stylesheet
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Google Fonts glyphs + self-hosted fonts in /public
  "font-src 'self' https://fonts.gstatic.com",
  // Images from self, Base64 data URIs, blob: for canvas exports, any HTTPS
  "img-src 'self' data: blob: https:",
  // XHR / fetch — same origin + Turnstile verification endpoint
  "connect-src 'self' https://challenges.cloudflare.com",
  // Media — none needed for a marketing site
  "media-src 'none'",
  // Cloudflare Turnstile renders inside an iframe hosted on challenges.cloudflare.com
  "frame-src https://challenges.cloudflare.com",
  // Prevent the site itself from being framed (belt-and-suspenders with X-Frame-Options)
  "frame-ancestors 'none'",
  // No Flash / Java plugins
  "object-src 'none'",
  // Block <base> tag hijacking
  "base-uri 'self'",
  // Form submissions only to same origin (update when adding a form backend)
  "form-action 'self'",
  // Upgrade mixed HTTP sub-resources to HTTPS — production only.
  // In dev the server is plain HTTP; this directive would cause the browser to
  // upgrade /_next/static/* requests to HTTPS, which fails and blocks all CSS
  // and JS from loading when accessing via a network IP (e.g. mobile testing).
  ...(!isDev ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  // ── Transport ──────────────────────────────────────────────────────────────
  // HSTS is only safe on production where HTTPS is guaranteed.
  // In dev the server speaks plain HTTP, so setting HSTS pins the local IP/
  // hostname as HTTPS-only in the browser — breaking all future HTTP requests
  // from that browser profile until the pin expires.
  ...(!isDev ? [{
    key:   "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  }] : []),

  // ── Content type ───────────────────────────────────────────────────────────
  {
    // Prevent browsers from MIME-sniffing a response away from its declared
    // Content-Type (blocks drive-by download attacks).
    key:   "X-Content-Type-Options",
    value: "nosniff",
  },

  // ── Framing ────────────────────────────────────────────────────────────────
  {
    // Block clickjacking by refusing to render the page inside any frame.
    // CSP frame-ancestors is the modern equivalent; this header covers older
    // browsers that don't support CSP.
    key:   "X-Frame-Options",
    value: "DENY",
  },

  // ── XSS Filter (legacy) ────────────────────────────────────────────────────
  {
    // Activates the built-in XSS auditor in older browsers (IE/Edge legacy).
    // Modern browsers ignore this in favour of CSP, but it costs nothing.
    key:   "X-XSS-Protection",
    value: "1; mode=block",
  },

  // ── Referrer ───────────────────────────────────────────────────────────────
  {
    // Send full URL as Referer within the same origin; send only the origin
    // for cross-origin requests; send nothing for downgrade (HTTPS→HTTP).
    key:   "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  // ── Permissions (Feature) Policy ──────────────────────────────────────────
  {
    // Explicitly opt out of browser features this site does not use.
    // Reduces the blast radius if a third-party script is ever injected.
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",   // Opt out of FLoC / Topics API
      "display-capture=()",
      "fullscreen=(self)",    // Allow fullscreen for video players if added
    ].join(", "),
  },

  // ── Cross-Origin policies ──────────────────────────────────────────────────
  {
    // Prevent cross-origin windows from retaining a reference to this page.
    // Required for the Spectre mitigation to take full effect.
    key:   "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    // Prevent other origins from loading our resources without explicit CORP
    // headers.  Protects against cross-site leaks via <img>/<script> tags.
    key:   "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },

  // ── Cross-domain policy ────────────────────────────────────────────────────
  {
    // Prevent Adobe Flash and PDF plugins from making cross-domain requests.
    // Unnecessary for a modern site, but closes the door entirely.
    key:   "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },

  // ── DNS prefetch ───────────────────────────────────────────────────────────
  {
    // Allow DNS prefetching of linked resources for performance.
    key:   "X-DNS-Prefetch-Control",
    value: "on",
  },

  // ── Content Security Policy ────────────────────────────────────────────────
  {
    key:   "Content-Security-Policy",
    value: CSP_DIRECTIVES,
  },
];

// ─── Next.js Config ───────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  compress:        true,
  poweredByHeader: false,

  // ── Security headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to every route — static assets get their own cache headers from
        // the CDN layer, but the security headers must travel with all HTML.
        source:  "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // ── Image optimisation ──────────────────────────────────────────────────────
  images: {
    formats:          ["image/avif", "image/webp"],
    deviceSizes:      [640, 750, 828, 1080, 1200, 1920],
    imageSizes:       [32, 64, 128, 256, 384],
    minimumCacheTTL:  2_678_400, // 31 days

    // Allowlist remote hostnames if remote images are added in the future.
    // Do NOT add wildcards — enumerate exact hostnames only.
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'images.contentful.com' },
    // ],
  },

  // ── Redirects ───────────────────────────────────────────────────────────────
  // Define permanent redirects here rather than in middleware so they are
  // pre-rendered and served at the edge without a function invocation.
  async redirects() {
    return [
      // Example — uncomment and adjust when migrating legacy URLs:
      // { source: '/survey/:slug', destination: '/services/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
