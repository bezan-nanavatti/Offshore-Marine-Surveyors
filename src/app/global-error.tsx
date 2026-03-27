"use client";

/**
 * Global error boundary — catches crashes in the root layout itself.
 * Must render its own <html> and <body> since it replaces the root layout.
 *
 * Per Next.js docs, keeping this page lightweight (system fonts, minimal CSS)
 * improves reliability for worst-case error scenarios.
 */
import { useEffect } from "react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[OMS Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 p-0" style={{ background: "linear-gradient(160deg, #0E1B2A 0%, #0B2545 100%)", minHeight: "100vh" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "3rem 1.5rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* ── Glow rings ──────────────────────────────────────── */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: "28rem",
                height: "28rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: "18rem",
                height: "18rem",
                borderRadius: "9999px",
                border: "1px solid rgba(28,167,166,0.12)",
              }}
            />
          </div>

          {/* ── Critical error icon ──────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "5rem",
              height: "5rem",
              borderRadius: "9999px",
              background: "rgba(255,107,53,0.12)",
              border: "1px solid rgba(255,107,53,0.3)",
              marginBottom: "2rem",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="36"
              height="36"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* ── Wordmark ────────────────────────────────────────── */}
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.45em",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              marginBottom: "0.25rem",
            }}
          >
            Constellation Marine Services
          </p>

          {/* ── Divider ─────────────────────────────────────────── */}
          <div
            style={{
              height: "2px",
              width: "3rem",
              borderRadius: "9999px",
              background: "#1CA7A6",
              margin: "0.75rem auto 1.5rem",
            }}
          />

          {/* ── Heading ─────────────────────────────────────────── */}
          <h1
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Critical Error
          </h1>

          {/* ── Body ────────────────────────────────────────────── */}
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: "rgba(255,255,255,0.55)",
              maxWidth: "28rem",
              lineHeight: 1.7,
              marginBottom: error.digest ? "0.5rem" : "2.5rem",
            }}
          >
            A critical error occurred. Please try again or contact us at{" "}
            <a
              href="mailto:info@offshoremarinesurveyors.com"
              style={{ color: "#1CA7A6", textDecoration: "underline" }}
            >
              info@offshoremarinesurveyors.com
            </a>{" "}
            if the problem persists.
          </p>

          {error.digest && (
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "2.5rem",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          {/* ── Actions ─────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={unstable_retry}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "0.5rem",
                background: "#1CA7A6",
                border: "none",
                color: "#fff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "filter 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
              onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
