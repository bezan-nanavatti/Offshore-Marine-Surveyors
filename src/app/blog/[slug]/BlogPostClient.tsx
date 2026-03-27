'use client';

import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Tag, Calendar, Eye, ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import BlogCard from '@/components/BlogCard';
import type { BlogPost } from '@/lib/blog-posts';
import { asTrustedHtml } from '@/lib/sanitize';

interface Props {
  post: BlogPost;
  related: BlogPost[];
}

export default function BlogPostClient({ post, related }: Props) {
  const [reads, setReads] = useState<number | null>(null);

  // Increment read count on mount
  useEffect(() => {
    fetch(`/api/blog/${post.slug}/read`, { method: 'POST' })
      .then((r) => r.json())
      .then((data: { reads: number }) => setReads(data.reads))
      .catch(() => {/* non-critical */});
  }, [post.slug]);

  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PageHero
        title={post.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        badge={post.category}
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main article */}
            <m.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              {/* Featured image */}
              <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Meta strip */}
              <div
                className="flex flex-wrap items-center gap-4 text-sm mb-8 pb-4"
                style={{ borderBottom: '1px solid rgba(11,37,69,0.1)', color: 'rgba(14,27,42,0.55)' }}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} style={{ color: 'var(--teal)' }} />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} style={{ color: 'var(--teal)' }} />
                  {post.authorSlug ? (
                    <Link href={`/team/${post.authorSlug}`} className="hover:text-ocean transition-colors">
                      {post.author}
                    </Link>
                  ) : (
                    post.author
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={14} style={{ color: 'var(--teal)' }} />
                  <Link
                    href={`/blog?category=${encodeURIComponent(post.category)}`}
                    className="hover:text-ocean transition-colors"
                  >
                    {post.category}
                  </Link>
                </span>
                {reads !== null && (
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} style={{ color: 'var(--teal)' }} />
                    {reads.toLocaleString()} read{reads !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Article body — content is developer-authored HTML in blog-posts.ts */}
              <div
                className="prose-article"
                style={{ color: 'var(--dark)' }}
                dangerouslySetInnerHTML={{ __html: asTrustedHtml(post.content) }}
              />

              {/* Back to blog */}
              <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(11,37,69,0.1)' }}>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                  style={{ color: 'var(--ocean)' }}
                >
                  <ArrowLeft size={15} />
                  Back to Blog
                </Link>
              </div>
            </m.article>

            {/* Sidebar */}
            <m.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Author card (if linked) */}
              {post.authorSlug && (
                <div
                  className="rounded-2xl p-5"
                  style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.09)' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                    About the Author
                  </p>
                  <p className="font-bold text-sm mb-1" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
                    {post.author}
                  </p>
                  <Link
                    href={`/team/${post.authorSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold mt-2 transition-colors duration-200"
                    style={{ color: 'var(--ocean)' }}
                  >
                    View Profile <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              {/* Services callout */}
              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--navy)', color: '#fff' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
                  Need Assistance?
                </p>
                <p className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  Expert Marine Surveyors Available 24/7
                </p>
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Serving UAE, Middle East, and global offshore operations since 2007.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:opacity-90"
                  style={{ background: 'var(--cta)', color: '#fff' }}
                >
                  Request a Survey
                </Link>
                <a
                  href="tel:+97126713320"
                  className="flex items-center gap-1.5 mt-3 text-xs transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Phone size={12} style={{ color: 'var(--teal)' }} />
                  +971 2671 3320
                </a>
              </div>

              {/* Related services */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.09)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                  Our Services
                </p>
                {[
                  { label: 'Marine Warranty Survey', href: '/services/marine-warranty-survey' },
                  { label: 'Cargo & Damage Survey', href: '/services/cargo-damage-survey' },
                  { label: 'Rig Positioning & Moving', href: '/services/rig-positioning-moving' },
                  { label: 'Marine Casualties', href: '/services/marine-casualties' },
                  { label: 'Technical Due Diligence', href: '/services/technical-due-diligence' },
                ].map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center gap-2 py-1.5 text-sm transition-colors duration-200 hover:text-ocean"
                    style={{ color: 'var(--dark)', borderBottom: '1px solid rgba(11,37,69,0.06)' }}
                  >
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--teal)', flexShrink: 0 }} />
                    {s.label}
                  </Link>
                ))}
              </div>
            </m.aside>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black mb-8"
              style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                color: 'var(--navy)',
                fontFamily: 'var(--font-montserrat)',
              }}
            >
              Related Articles
            </m.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
