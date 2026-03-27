/**
 * Development-only image validation.
 *
 * Scans all image paths referenced in the data files and emits console
 * warnings for any that do not exist in /public. Does nothing in production.
 *
 * Import this module once from next.config.ts (server-only, Node context).
 * Never import from browser bundles.
 */

import fs from 'fs';
import path from 'path';

/** Returns true if the /public-relative path exists on disk. */
function publicImageExists(publicPath: string): boolean {
  const abs = path.join(process.cwd(), 'public', publicPath);
  return fs.existsSync(abs);
}

interface ImageRef {
  context: string; // e.g. "services[marine-warranty-survey]"
  path: string;    // e.g. "/images/survey-inspections.jpg"
}

export function checkImagesInDev(): void {
  if (process.env.NODE_ENV !== 'development') return;

  // Lazy imports — these are large modules; only load in dev
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { services }    = require('./services-data') as { services: Array<{ slug: string; image: string }> };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { projects }    = require('./projects-data') as { projects: Array<{ slug: string; image: string }> };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { teamMembers } = require('./team-data')     as { teamMembers: Array<{ slug: string; photo: string }> };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { blogPosts }   = require('./blog-posts')    as { blogPosts: Array<{ slug: string; image: string }> };

  const refs: ImageRef[] = [
    ...services.map((s)    => ({ context: `services[${s.slug}]`,    path: s.image })),
    ...projects.map((p)    => ({ context: `projects[${p.slug}]`,    path: p.image })),
    ...teamMembers.map((m) => ({ context: `team[${m.slug}]`,        path: m.photo })),
    ...blogPosts.map((b)   => ({ context: `blog[${b.slug}]`,        path: b.image })),
  ];

  const missing = refs.filter((r) => !publicImageExists(r.path));

  if (missing.length === 0) return;

  console.warn(
    `[image-check] ${missing.length} image(s) referenced in data files are missing from /public:`
  );
  for (const ref of missing) {
    console.warn(`  • ${ref.context} → ${ref.path}`);
  }
}
