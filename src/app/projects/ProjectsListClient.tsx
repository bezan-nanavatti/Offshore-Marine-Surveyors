'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, Filter } from 'lucide-react';
import PageHero from '@/components/PageHero';
import type { Project } from '@/lib/projects-data';

interface Props {
  projects: Project[];
  categories: string[];
}

export default function ProjectsListClient({ projects, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.categoryLabel === activeCategory);

  return (
    <>
      <PageHero
        title="Projects & Case Studies"
        subtitle="Selected engagements from our portfolio of marine warranty surveys, rig moves, casualty investigations, and offshore consultancy — delivered across the Middle East, Indian Ocean, and beyond."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
        ]}
        badge="Since 2007"
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter pills */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 flex-wrap mb-10"
          >
            <Filter size={15} style={{ color: 'rgba(14,27,42,0.4)', flexShrink: 0 }} />
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
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
            key={filtered.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mb-6"
            style={{ color: 'rgba(14,27,42,0.5)' }}
          >
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' && ` — ${activeCategory}`}
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
                {filtered.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
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
                  No projects found
                </p>
                <p className="text-sm" style={{ color: 'rgba(14,27,42,0.5)' }}>
                  Try selecting a different category.
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
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--teal)' }}
          >
            Work With Us
          </m.p>
          <m.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white font-black mb-4"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontFamily: 'var(--font-montserrat)' }}
          >
            Ready to Discuss Your Requirements?
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
              Get In Touch
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Our Services
            </Link>
          </m.div>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <m.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)', boxShadow: '0 2px 16px rgba(11,37,69,0.05)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(11,37,69,0.5) 0%, transparent 55%)' }}
        />
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(28,167,166,0.9)', color: '#fff' }}
        >
          {project.categoryLabel}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h2
          className="font-black mb-2 leading-snug"
          style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: '0.97rem' }}
        >
          {project.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-3">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(14,27,42,0.5)' }}>
            <MapPin size={12} style={{ color: 'var(--teal)' }} />
            {project.region}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(14,27,42,0.5)' }}>
            <Calendar size={12} style={{ color: 'var(--teal)' }} />
            {project.year}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'rgba(14,27,42,0.65)' }}>
          {project.summary.length > 140 ? project.summary.slice(0, 140) + '…' : project.summary}
        </p>

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 mt-auto"
          style={{ color: 'var(--ocean)' }}
        >
          Read Case Study
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </m.article>
  );
}
