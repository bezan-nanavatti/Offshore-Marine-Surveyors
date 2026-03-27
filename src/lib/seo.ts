/**
 * Central SEO utilities for Constellation Marine Services.
 * All schema builders, shared constants, and helpers live here.
 * Import from this module rather than hardcoding values in pages.
 */

import { env } from './env';

// ─── Site-wide constants ─────────────────────────────────────────────────────

export const BASE_URL        = env.SITE_URL;
export const SITE_NAME       = env.SITE_NAME;
export const DEFAULT_OG_IMAGE = `${BASE_URL}/images/hero_bg_1.jpg`;
export const LOGO_URL        = `${BASE_URL}/images/logo.png`;
export const TWITTER_HANDLE  = '@constellationms';

// ─── Core utilities ──────────────────────────────────────────────────────────

/**
 * XSS-safe JSON-LD serialiser.
 *
 * JSON.stringify is safe against JS injection on its own, but an inline
 * `<script>` tag can be closed early if the payload contains `</script>`.
 * Escaping `<` to `\u003c` prevents that — per the Next.js JSON-LD guide.
 *
 * Also escapes `>` and `&` for defence-in-depth.
 */
export function jsonLd(schema: object): string {
  return JSON.stringify(schema)
    .replace(/</g,  '\\u003c')
    .replace(/>/g,  '\\u003e')
    .replace(/&/g,  '\\u0026');
}

/** Build an absolute URL from a site-relative path */
export function siteUrl(path = ''): string {
  // Ensure no double-slashes when path already starts with /
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalised}`;
}

/** Standard 1200×630 OG image descriptor */
export function ogImage(src: string, alt: string) {
  const url = src.startsWith('http') ? src : siteUrl(src);
  return [{ url, width: 1200, height: 630, alt }];
}

// ─── Schema Builders ─────────────────────────────────────────────────────────

/**
 * BreadcrumbList JSON-LD.
 * Add to every inner page alongside the page-specific schema.
 */
export function breadcrumbSchema(crumbs: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      c.name,
      item:      siteUrl(c.href),
    })),
  };
}

/**
 * WebSite JSON-LD with SearchAction sitelinks box.
 * Injected once in the root layout alongside the Organization schema.
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type':    'WebSite',
  name:       SITE_NAME,
  url:        BASE_URL,
  potentialAction: {
    '@type':  'SearchAction',
    target: {
      '@type':       'EntryPoint',
      urlTemplate:   `${BASE_URL}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * ItemList JSON-LD for listing pages (services, blog, team, projects).
 * Helps Google understand the catalogue structure of each section.
 */
export function itemListSchema(
  items: { name: string; url: string; description?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      item.name,
      url:       item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
