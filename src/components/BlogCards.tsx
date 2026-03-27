'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import type { BlogPost } from '@/lib/blog-posts';
import { variants, inView } from '@/lib/design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogCardsSectionProps {
  posts: BlogPost[];
  /** Eyebrow badge text (default: 'Latest Insights') */
  badge?: string;
  /** Section heading (default: 'From the Bridge') */
  title?: string;
  subtitle?: string;
  /** Show the "View All Articles" link (default: true) */
  showViewAll?: boolean;
  /** Cap number of posts rendered (default: 3) */
  limit?: number;
  /** Section background (default: 'surface') */
  theme?: 'surface' | 'white' | 'dark';
}

// ─── BlogCards Section ────────────────────────────────────────────────────────

export default function BlogCards({
  posts,
  badge     = 'Latest Insights',
  title     = 'From the Bridge',
  subtitle,
  showViewAll = true,
  limit       = 3,
  theme       = 'surface',
}: BlogCardsSectionProps) {
  const isDark = theme === 'dark';
  const bg =
    theme === 'dark'  ? 'bg-dark'  :
    theme === 'white' ? 'bg-white' :
    'bg-surface';

  const visible = posts.slice(0, limit);

  return (
    <section className={`section-padding ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header row ──────────────────────────────────────────── */}
        <m.div
          variants={variants.stagger}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          {/* Left — title block */}
          <div className="max-w-xl">
            {badge && (
              <m.div variants={variants.rise} className="mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase font-heading ${
                    isDark
                      ? 'bg-teal/12 border border-teal/30 text-teal'
                      : 'bg-teal/10 border border-teal/25 text-teal'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  {badge}
                </span>
              </m.div>
            )}

            <m.h2
              variants={variants.rise}
              className={`font-heading font-black leading-tight ${
                isDark ? 'text-white' : 'text-dark'
              }`}
              style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)' }}
            >
              {title}
            </m.h2>

            {subtitle && (
              <m.p
                variants={variants.rise}
                className={`mt-3 text-lg leading-relaxed ${
                  isDark ? 'text-white/60' : 'text-dark/60'
                }`}
              >
                {subtitle}
              </m.p>
            )}
          </div>

          {/* Right — "View All" link */}
          {showViewAll && (
            <m.div variants={variants.fade} className="shrink-0">
              <Link
                href="/blog"
                className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${
                  isDark
                    ? 'text-teal hover:text-teal/75'
                    : 'text-ocean hover:text-teal'
                }`}
              >
                View All Articles
                <ArrowRight size={15} />
              </Link>
            </m.div>
          )}
        </m.div>

        {/* ── Card grid ───────────────────────────────────────────── */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className={`rounded-2xl border py-16 text-center ${
              isDark
                ? 'border-white/10 text-white/40'
                : 'border-navy/[0.08] text-dark/40'
            }`}
          >
            <p className="text-sm font-medium">No articles published yet — check back soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
