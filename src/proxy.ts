/**
 * Next.js 16 Proxy — Constellation Marine Services
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Runs on the Node.js runtime before every matched request.
 * Cost: ~0 ms overhead for most paths (proxy skips static assets).
 *
 * CURRENT RESPONSIBILITIES
 * ────────────────────────
 * 1. Block common scanner / attack paths (WordPress, PHP, git, env files).
 *    Automated bots constantly probe these. Returning a bare 404 leaks no
 *    framework information and wastes no server resources.
 *
 * 2. Dashboard auth guard — verify the oms_admin_session JWT cookie on all
 *    /dashboard and /api/dashboard routes (except /dashboard/login).
 *    Redirects unauthenticated page requests to /dashboard/login.
 *    Returns 401 JSON for unauthenticated API requests.
 *
 * 3. Query-parameter allowlisting — strip keys not on the per-route allowlist
 *    to prevent parameter pollution and limit injection via unexpected params.
 *
 * 4. Canonical redirect for unrecognised query keys (301) so search engines
 *    do not index polluted URLs.
 *
 * EXTENSION POINTS
 * ────────────────
 * When the following features are added, implement them here (not in layouts):
 *
 *   Rate limiting   Use @upstash/ratelimit for /api/* and /contact routes.
 *   Geo-fencing     `request.geo.country` is available on Vercel.
 *   A/B testing     Set a cookie and rewrite to /variant-a or /variant-b.
 *
 * WHAT DOES NOT BELONG HERE
 * ──────────────────────────
 * • Database queries — use Route Handlers for that.
 * • Heavy computation — keep overhead minimal.
 * • Business logic that belongs in Server Components or Route Handlers.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// ─── Scanner / Attack Path Blocklist ─────────────────────────────────────────

const BLOCKED_PREFIXES = [
  // CMS / PHP scanner targets
  "/wp-admin",
  "/wp-login",
  "/wp-content",
  "/wp-includes",
  "/xmlrpc.php",
  "/administrator",       // Joomla
  "/admin.php",
  "/phpmyadmin",
  "/adminer",
  "/phpinfo.php",
  "/config.php",
  "/setup.php",
  "/install.php",
  "/eval-stdin.php",
  "/shell.php",
  "/cmd.php",
  // VCS / CI artefacts
  "/.git",
  "/.github",
  "/.gitlab-ci",
  "/.svn",
  "/.hg",
  // Secret / config files
  "/.env",
  "/.env.local",
  "/.env.production",
  "/.env.development",
  "/.env.test",
  "/.htaccess",
  "/.htpasswd",
  // Dependency / build artefacts that should never be web-accessible
  "/node_modules",
  "/npm-debug.log",
  "/yarn-error.log",
  "/yarn.lock",
  // macOS / IDE metadata that can leak directory structure
  "/.DS_Store",
  "/.idea",
  "/.vscode",
  // Server diagnostic pages
  "/server-status",
  "/server-info",
  "/console",
  // Common exploit probe paths
  "/cgi-bin",
  "/etc/passwd",
  "/proc/self",
  // Backup file probes
  "/backup",
  "/bak",
  "/old",
  "/temp",
  "/tmp",
] as const;

// ─── Query-Parameter Allowlist ────────────────────────────────────────────────
//
// Only the listed keys are forwarded for each route prefix.
// Unknown keys are stripped and the user is 301-redirected to the clean URL.
// Prevents parameter pollution and limits the injection surface.

const QUERY_ALLOWLIST: Record<string, Set<string>> = {
  "/blog":     new Set(["q", "category", "page", "sort"]),
  "/services": new Set(["ref"]),
  "/contact":  new Set(["service", "ref"]),
  "/projects": new Set(["category", "region", "page"]),
  "/team":     new Set(["department"]),
};

// ─── Dashboard Auth ───────────────────────────────────────────────────────────

const COOKIE_NAME = "oms_admin_session";
const JWT_ALG     = "HS256";

function getJwtSecret(): Uint8Array | null {
  const s = process.env.DASHBOARD_JWT_SECRET;
  if (!s || s.length < 32) return null; // Not configured or too short
  return new TextEncoder().encode(s);
}

async function checkDashboardAuth(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  const isDashboard    = pathname.startsWith("/dashboard");
  const isDashboardApi = pathname.startsWith("/api/dashboard");

  if (!isDashboard && !isDashboardApi) return null; // Not a protected route

  // Login page is always accessible
  if (pathname === "/dashboard/login") return null;

  // If secret is not configured, lock down the dashboard entirely
  const secret = getJwtSecret();
  if (!secret) {
    if (isDashboardApi) {
      return NextResponse.json({ error: "Dashboard not configured." }, { status: 503 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/dashboard/login";
    return NextResponse.redirect(loginUrl);
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await jwtVerify(token, secret, { algorithms: [JWT_ALG] });
      return null; // Valid session — allow through
    } catch {
      // Token expired or tampered — fall through to reject
    }
  }

  // Reject unauthenticated access
  if (isDashboardApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/dashboard/login";
  return NextResponse.redirect(loginUrl);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBlocked(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return BLOCKED_PREFIXES.some(
    (p) => lower === p || lower.startsWith(`${p}/`) || lower.startsWith(`${p}.`)
  );
}

function stripDisallowedParams(request: NextRequest): URL | null {
  const { pathname, searchParams } = request.nextUrl;

  const matchedRoute = Object.keys(QUERY_ALLOWLIST)
    .filter((prefix) => pathname.startsWith(prefix))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchedRoute) return null;

  const allowed = QUERY_ALLOWLIST[matchedRoute];
  const toRemove: string[] = [];
  searchParams.forEach((_v, key) => { if (!allowed.has(key)) toRemove.push(key); });

  if (toRemove.length === 0) return null;

  const clean = request.nextUrl.clone();
  toRemove.forEach((key) => clean.searchParams.delete(key));
  return clean;
}

// ─── Proxy function ───────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Block scanner / attack paths — bare 404, no body
  if (isBlocked(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // 2. Dashboard auth guard
  const authResponse = await checkDashboardAuth(request);
  if (authResponse) return authResponse;

  // 3. Strip disallowed query params — 301 to clean URL
  const cleanUrl = stripDisallowedParams(request);
  if (cleanUrl) {
    return NextResponse.redirect(cleanUrl, { status: 301 });
  }

  // 4. Pass through — security headers are set in next.config.ts
  return NextResponse.next();
}

// ─── Route Matcher ────────────────────────────────────────────────────────────
//
// Explicitly skip static assets to keep the proxy off the hot path:
//   _next/static  — hashed JS/CSS/font files served by CDN
//   _next/image   — image optimisation responses
//   favicon.ico   — automatic browser request
//   images/       — public image assets in /public

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|images/).*)"],
};
