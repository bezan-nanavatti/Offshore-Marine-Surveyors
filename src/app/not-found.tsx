import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist or has moved.",
};

/**
 * Root 404 page.  Rendered inside the root layout (Navbar + Footer remain
 * visible).  Server Component — no interactivity needed.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden gradient-dark px-6 py-24">
      {/* ── Background decoration ────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute h-[36rem] w-[36rem] rounded-full border border-white/[0.03] animate-pulse-glow" />
        <span
          className="absolute h-80 w-80 rounded-full border border-teal/[0.07] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* ── Compass rose watermark ───────────────────────────────── */}
      <div className="pointer-events-none absolute right-8 top-8 opacity-[0.04] lg:right-16 lg:top-16">
        <CompassIcon className="h-64 w-64 text-white animate-spin-slow" />
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-10 text-center animate-fade-up">
        {/* 404 number */}
        <p className="font-heading text-[7rem] font-black leading-none tracking-tighter text-gradient lg:text-[10rem]">
          404
        </p>

        {/* Teal divider */}
        <span className="section-rule mx-auto mb-6" />

        {/* Headline */}
        <h1 className="font-heading text-2xl font-bold text-white mb-4 lg:text-3xl">
          You&rsquo;ve Drifted Off Course
        </h1>

        {/* Body */}
        <p className="mx-auto max-w-md font-body text-white/60 leading-relaxed mb-10">
          The page you&rsquo;re looking for has gone overboard — it may have
          been moved, removed, or never existed. Let&rsquo;s get you back to
          safe waters.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-cta px-7 py-3 font-heading text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
          >
            <HomeIcon className="h-4 w-4" />
            Return to Port
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3 font-heading text-sm font-semibold tracking-wide text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* ── Wave transition to surface ───────────────────────────── */}
      <div className="wave-bottom pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "60px" }}
        >
          <path
            d="M0 40 Q180 10 360 40 Q540 70 720 40 Q900 10 1080 40 Q1260 70 1440 40 L1440 60 L0 60 Z"
            fill="#F5F7FA"
          />
        </svg>
      </div>
    </section>
  );
}

/* ── Icon helpers ──────────────────────────────────────────────────── */
function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
