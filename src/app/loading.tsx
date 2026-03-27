/**
 * Global loading screen — shown as the Suspense fallback while any
 * root-level route segment streams in.  Server Component (no 'use client'
 * needed) — CSS-only animations from globals.css.
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gradient-dark overflow-hidden"
      aria-label="Loading"
      aria-live="polite"
    >
      {/* ── Ambient glow rings ───────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute h-[28rem] w-[28rem] rounded-full border border-white/[0.04] animate-pulse-glow" />
        <span
          className="absolute h-72 w-72 rounded-full border border-teal/10 animate-pulse-glow"
          style={{ animationDelay: "1.6s" }}
        />
        <span
          className="absolute h-48 w-48 rounded-full border border-ocean/20 animate-pulse-glow"
          style={{ animationDelay: "0.8s" }}
        />
      </div>

      {/* ── Anchor icon ─────────────────────────────────────────── */}
      <div className="relative z-10 mb-8 text-teal animate-float-slow">
        <AnchorIcon className="h-16 w-16" />
      </div>

      {/* ── Wordmark ────────────────────────────────────────────── */}
      <div className="relative z-10 mb-10 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="font-body text-[0.6rem] tracking-[0.45em] text-white/40 uppercase mb-1">
          Constellation
        </p>
        <h2 className="font-heading text-xl font-bold tracking-[0.25em] text-white uppercase">
          Marine Services
        </h2>
        <span className="section-rule mx-auto mt-3" />
      </div>

      {/* ── Bouncing dots ───────────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center gap-[0.4rem] animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        {[0, 0.18, 0.36].map((delay, i) => (
          <span
            key={i}
            className="h-[0.45rem] w-[0.45rem] rounded-full bg-teal animate-bounce"
            style={{ animationDelay: `${delay}s`, animationDuration: "1.1s" }}
          />
        ))}
      </div>

      {/* ── Bottom wave strip ───────────────────────────────────── */}
      <div className="wave-bottom h-12 pointer-events-none">
        <svg viewBox="0 0 1200 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0 32 Q300 0 600 32 Q900 64 1200 32 L1200 48 L0 48 Z"
            fill="rgba(30,90,138,0.15)"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Inline anchor SVG ──────────────────────────────────────────────── */
function AnchorIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v14" />
      <path d="M5 14H2a10 10 0 0 0 20 0h-3" />
      <path d="M6 9.5C7.5 7.5 9.5 7 12 7" />
      <path d="M18 9.5C16.5 7.5 14.5 7 12 7" />
    </svg>
  );
}
