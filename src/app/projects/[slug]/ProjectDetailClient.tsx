'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, ArrowRight, Phone, Tag, Ship } from 'lucide-react';
import PageHero from '@/components/PageHero';
import type { Project } from '@/lib/projects-data';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay },
});

interface Props {
  project: Project;
  related: Project[];
}

export default function ProjectDetailClient({ project, related }: Props) {
  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: project.title, href: `/projects/${project.slug}` },
        ]}
        badge={project.categoryLabel}
        image={project.image}
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Featured image */}
              <m.div
                {...fadeUp(0)}
                className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: '16/9' }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </m.div>

              {/* Meta strip */}
              <m.div
                {...fadeUp(0.05)}
                className="flex flex-wrap items-center gap-4 text-sm pb-4"
                style={{ borderBottom: '1px solid rgba(11,37,69,0.1)', color: 'rgba(14,27,42,0.55)' }}
              >
                <span className="flex items-center gap-1.5">
                  <Tag size={14} style={{ color: 'var(--teal)' }} />
                  {project.categoryLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} style={{ color: 'var(--teal)' }} />
                  {project.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} style={{ color: 'var(--teal)' }} />
                  {project.year}
                </span>
                <span className="flex items-center gap-1.5">
                  <Ship size={14} style={{ color: 'var(--teal)' }} />
                  {project.asset}
                </span>
              </m.div>

              {/* Body */}
              <m.div {...fadeUp(0.08)}>
                <h2
                  className="font-black mb-4"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                >
                  Case Study
                </h2>
                {project.body.trim().split('\n\n').map((para, i) => (
                  <p
                    key={i}
                    className="mb-4 leading-relaxed"
                    style={{ color: 'rgba(14,27,42,0.75)', fontSize: '0.97rem' }}
                  >
                    {para.trim()}
                  </p>
                ))}
              </m.div>

              {/* Back */}
              <div className="pt-2">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                  style={{ color: 'var(--ocean)' }}
                >
                  <ArrowLeft size={15} />
                  All Projects
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <m.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-5"
            >
              {/* Key Facts */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--teal)' }}>
                  Project Facts
                </p>
                <dl className="space-y-3">
                  {project.keyFacts.map((fact) => (
                    <div key={fact.label} className="flex flex-col">
                      <dt className="text-xs" style={{ color: 'rgba(14,27,42,0.45)' }}>{fact.label}</dt>
                      <dd className="text-sm font-semibold mt-0.5" style={{ color: 'var(--dark)' }}>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* CTA card */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--navy)', color: '#fff' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
                  Similar Requirements?
                </p>
                <p className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  Expert surveyors available 24/7 worldwide
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold w-full justify-center transition-all duration-200 hover:opacity-90 mb-3"
                  style={{ background: 'var(--cta)', color: '#fff' }}
                >
                  Request a Survey
                </Link>
                <a
                  href="tel:+97126713320"
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <Phone size={12} style={{ color: 'var(--teal)' }} />
                  +971 2671 3320
                </a>
              </div>

              {/* Related service */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                  Related Service
                </p>
                <Link
                  href={`/services/${project.relatedService}`}
                  className="flex items-center justify-between text-sm font-semibold group"
                  style={{ color: 'var(--navy)' }}
                >
                  <span>{project.categoryLabel}</span>
                  <ArrowRight size={14} style={{ color: 'var(--teal)' }} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </m.aside>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-16" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.h2
              {...fadeUp(0)}
              className="font-black mb-8"
              style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}
            >
              Related Projects
            </m.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r, i) => (
                <m.article
                  key={r.slug}
                  {...fadeUp(i * 0.08)}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="group rounded-2xl overflow-hidden"
                  style={{ background: 'var(--surface)', border: '1px solid rgba(11,37,69,0.07)' }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--teal)' }}>{r.categoryLabel}</p>
                    <h3 className="font-bold text-sm mb-2 leading-snug" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(14,27,42,0.5)' }}>
                        <MapPin size={11} style={{ color: 'var(--teal)' }} />
                        {r.region}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(14,27,42,0.5)' }}>
                        <Calendar size={11} style={{ color: 'var(--teal)' }} />
                        {r.year}
                      </span>
                    </div>
                    <Link
                      href={`/projects/${r.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: 'var(--ocean)' }}
                    >
                      Read Case Study
                      <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </m.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
