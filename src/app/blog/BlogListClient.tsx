'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import PageHero from '@/components/PageHero';
import type { BlogPost } from '@/lib/blog-posts';

interface Props {
  posts: BlogPost[];
  categories: string[];
}

type SortOption = 'date-desc' | 'date-asc' | 'reads-desc';

const SORT_LABELS: Record<SortOption, string> = {
  'date-desc':  'Newest First',
  'date-asc':   'Oldest First',
  'reads-desc': 'Most Read',
};

export default function BlogListClient({ posts, categories }: Props) {
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sort, setSort]                   = useState<SortOption>('date-desc');
  const [readCounts, setReadCounts]       = useState<Record<string, number>>({});
  const [loadingReads, setLoadingReads]   = useState(false);

  // Fetch read counts when "Most Read" sort is selected
  useEffect(() => {
    if (sort !== 'reads-desc') return;
    let active = true;
    async function fetchReads() {
      setLoadingReads(true);
      try {
        const r    = await fetch('/api/blog/reads');
        const data = await r.json() as Record<string, number>;
        if (active) setReadCounts(data);
      } catch {
        /* reads unavailable — fallback to existing order */
      } finally {
        if (active) setLoadingReads(false);
      }
    }
    void fetchReads();
    return () => { active = false; };
  }, [sort]);

  const filtered = posts
    .filter((p) => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    })
    .slice()
    .sort((a, b) => {
      if (sort === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === 'date-asc')  return new Date(a.date).getTime() - new Date(b.date).getTime();
      // reads-desc
      return (readCounts[b.slug] ?? 0) - (readCounts[a.slug] ?? 0);
    });

  return (
    <>
      <PageHero
        title="Marine Surveying Insights"
        subtitle="Expert articles from our master mariners, naval architects, and marine engineers — sharing knowledge across cargo survey, offshore operations, tanker safety, and maritime law."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
        ]}
        badge="Knowledge Hub"
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter bar */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgba(14,27,42,0.4)' }}
              />
              <input
                type="search"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-base outline-none"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(11,37,69,0.12)',
                  color: 'var(--dark)',
                }}
                aria-label="Search blog articles"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={15} style={{ color: 'rgba(14,27,42,0.4)', flexShrink: 0 }} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="py-3 px-3 rounded-xl text-sm font-semibold outline-none cursor-pointer"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(11,37,69,0.12)',
                  color: 'var(--navy)',
                }}
                aria-label="Sort articles"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <option key={opt} value={opt}>{SORT_LABELS[opt]}</option>
                ))}
              </select>
              {loadingReads && (
                <span className="text-xs" style={{ color: 'rgba(14,27,42,0.4)' }}>Loading…</span>
              )}
            </div>
          </m.div>

          {/* Categories */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            <Filter size={15} style={{ color: 'rgba(14,27,42,0.4)' }} />
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? { background: 'var(--navy)', color: '#fff' }
                    : { background: 'rgba(11,37,69,0.07)', color: 'var(--navy)' }
                }
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </m.div>

          {/* Results count */}
          <m.p
            key={`${filtered.length}-${sort}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mb-6"
            style={{ color: 'rgba(14,27,42,0.5)' }}
          >
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
            {' '}— sorted by {SORT_LABELS[sort].toLowerCase()}
          </m.p>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <m.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((post, i) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={i}
                    reads={readCounts[post.slug]}
                  />
                ))}
              </m.div>
            ) : (
              <m.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <p className="text-lg mb-2" style={{ color: 'var(--dark)' }}>
                  No articles found
                </p>
                <p className="text-sm" style={{ color: 'rgba(14,27,42,0.5)' }}>
                  Try adjusting your search or category filter.
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--navy)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--teal)' }}
          >
            Need Expert Survey Assistance?
          </m.p>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white font-black mb-4"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: 'var(--font-montserrat)' }}
          >
            Our Surveyors Are Available 24/7
          </m.h2>
          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--cta)', color: '#fff' }}
            >
              Request a Survey
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Our Services
            </Link>
          </m.div>
        </div>
      </section>
    </>
  );
}
