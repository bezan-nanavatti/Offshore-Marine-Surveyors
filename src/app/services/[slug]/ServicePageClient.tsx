'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Anchor,
  Package,
  AlertTriangle,
  Settings,
  ClipboardCheck,
  FileText,
  Scale,
  Waves,
  Wrench,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import type { ServicePage } from '@/lib/services-data';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck, Anchor, Package, AlertTriangle, Settings,
  ClipboardCheck, FileText, Scale, Waves, Wrench,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay },
});

interface Props {
  service: ServicePage;
  related: ServicePage[];
}

export default function ServicePageClient({ service, related }: Props) {
  const Icon = iconMap[service.icon] ?? ShieldCheck;

  return (
    <>
      <PageHero
        title={service.name}
        subtitle={service.tagline}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.shortName, href: `/services/${service.slug}` },
        ]}
        badge="Marine Services"
        image={service.image}
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Hero image */}
              <m.div {...fadeUp(0)} className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
                <div
                  className="absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                >
                  <Icon size={24} style={{ color: 'var(--teal)' }} />
                </div>
              </m.div>

              {/* Overview */}
              <m.div {...fadeUp(0.07)}>
                <h2
                  className="font-black mb-4"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)' }}
                >
                  Service Overview
                </h2>
                <p className="leading-relaxed" style={{ color: 'rgba(14,27,42,0.75)', fontSize: '0.98rem' }}>
                  {service.description}
                </p>
              </m.div>

              {/* Key points */}
              <m.div {...fadeUp(0.1)}>
                <h2
                  className="font-black mb-5"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                >
                  What We Cover
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.keyPoints.map((point, i) => (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.07)' }}
                    >
                      <CheckCircle2 size={16} style={{ color: 'var(--teal)', marginTop: 2, flexShrink: 0 }} />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--dark)' }}>{point}</span>
                    </m.div>
                  ))}
                </div>
              </m.div>

              {/* Details */}
              <m.div {...fadeUp(0.12)}>
                <h2
                  className="font-black mb-4"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                >
                  In Detail
                </h2>
                {service.details.trim().split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 leading-relaxed" style={{ color: 'rgba(14,27,42,0.75)', fontSize: '0.97rem' }}>
                    {para.trim()}
                  </p>
                ))}
              </m.div>

              <div className="pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                  style={{ color: 'var(--ocean)' }}
                >
                  <ArrowLeft size={15} />
                  All Services
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
              {/* CTA card */}
              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--navy)', color: '#fff' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
                  Need This Service?
                </p>
                <p className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  Expert surveyors available 24/7 worldwide
                </p>
                <Link
                  href={`/contact?service=${encodeURIComponent(service.name)}`}
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

              {/* All services list */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                  All Services
                </p>
                {[
                  { label: 'Marine Warranty Survey', href: '/services/marine-warranty-survey' },
                  { label: 'Rig Positioning & Moving', href: '/services/rig-positioning-moving' },
                  { label: 'Cargo & Damage Survey', href: '/services/cargo-damage-survey' },
                  { label: 'Marine Casualties', href: '/services/marine-casualties' },
                  { label: 'Project Management', href: '/services/project-management' },
                  { label: 'Technical Due Diligence', href: '/services/technical-due-diligence' },
                  { label: 'eCMID Audits', href: '/services/ecmid-audits' },
                  { label: 'Dispute & Litigation', href: '/services/dispute-litigation' },
                  { label: 'Offshore Survey', href: '/services/offshore-survey' },
                  { label: 'Hull & Machinery', href: '/services/hull-machinery-survey' },
                ].map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center gap-2 py-1.5 text-sm border-b transition-colors duration-200 hover:text-ocean"
                    style={{ color: s.href.includes(service.slug) ? 'var(--teal)' : 'var(--dark)', borderColor: 'rgba(11,37,69,0.06)', fontWeight: s.href.includes(service.slug) ? 600 : 400 }}
                  >
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.href.includes(service.slug) ? 'var(--teal)' : 'rgba(14,27,42,0.25)' }} />
                    {s.label}
                  </Link>
                ))}
              </div>
            </m.aside>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {related.length > 0 && (
        <section className="py-16" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.h2
              {...fadeUp(0)}
              className="font-black mb-8"
              style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}
            >
              Related Services
            </m.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r, i) => {
                const RIcon = iconMap[r.icon] ?? ShieldCheck;
                return (
                  <m.div
                    key={r.slug}
                    {...fadeUp(i * 0.08)}
                    className="group p-5 rounded-2xl flex gap-4 items-start"
                    style={{ background: 'var(--surface)', border: '1px solid rgba(11,37,69,0.07)' }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(28,167,166,0.1)' }}
                    >
                      <RIcon size={18} style={{ color: 'var(--teal)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>{r.name}</h3>
                      <p className="text-xs mb-2" style={{ color: 'rgba(14,27,42,0.55)' }}>{r.tagline}</p>
                      <Link href={`/services/${r.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--ocean)' }}>
                        Learn More <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
