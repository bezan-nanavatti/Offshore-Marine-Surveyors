"use client";

/**
 * Route-level error boundary.  Catches uncaught exceptions thrown inside any
 * page or layout segment below the root.  The root layout (Navbar + Footer)
 * remains visible.
 *
 * The `unstable_retry` prop (Next.js 16 name for the former `reset`) lets the
 * user re-render the failed segment without a full page reload.
 */
import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: ErrorProps) {
  useEffect(() => {
    // Forward to your error-tracking service here (e.g. Sentry)
    console.error("[OMS Error Boundary]", error);
  }, [error]);

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden gradient-dark px-6 py-24">
      {/* ── Background rings ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="absolute h-96 w-96 rounded-full border border-cta/10 animate-pulse-glow" />
        <span
          className="absolute h-64 w-64 rounded-full border border-ocean/20 animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-lg text-center animate-scale-up">
        {/* Warning icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-cta/10 ring-1 ring-cta/30">
          <AlertTriangleIcon className="h-9 w-9 text-cta" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-2xl font-bold text-white mb-3 lg:text-3xl">
          Something Went Wrong
        </h1>

        <span className="section-rule mx-auto mb-5" />

        {/* Body */}
        <p className="font-body text-white/60 leading-relaxed mb-3">
          We hit an unexpected error. Our team has been notified. You can try
          again — or head back to the homepage.
        </p>

        {/* Digest (shown only in dev) */}
        {error.digest && (
          <p className="mb-6 font-mono text-xs text-white/30">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center mt-8">
          <button
            onClick={unstable_retry}
            className="inline-flex items-center gap-2 rounded-lg bg-teal px-7 py-3 font-heading text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
          >
            <RefreshIcon className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3 font-heading text-sm font-semibold tracking-wide text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* ── Teal left accent line ─────────────────────────────────── */}
      <div className="teal-line-l" />
    </section>
  );
}

/* ── Icon helpers ──────────────────────────────────────────────────── */
function AlertTriangleIcon({ className }: { className?: string }) {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
