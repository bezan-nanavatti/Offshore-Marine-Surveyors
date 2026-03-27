'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Scale,
  Shield,
  Star,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import PageHero from '@/components/PageHero';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay },
});

const offices = [
  { code: 'AUH', city: 'Abu Dhabi', country: 'UAE', hq: true },
  { code: 'DXB', city: 'Dubai', country: 'UAE', hq: false },
  { code: 'FUJ', city: 'Fujairah', country: 'UAE', hq: false },
  { code: 'LHR', city: 'London', country: 'United Kingdom', hq: false },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', hq: false },
  { code: 'MCT', city: 'Muscat', country: 'Oman', hq: false },
  { code: 'RTM', city: 'Rotterdam', country: 'Netherlands', hq: false },
  { code: 'PVG', city: 'Shanghai', country: 'China', hq: false },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', hq: false },
];

const values = [
  {
    icon: Scale,
    title: 'Independence',
    desc: 'We act independently for all clients — our opinions are our own, never influenced by commercial pressure.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'Our reports reflect the facts, always. Accuracy and honesty are non-negotiable at every stage.',
  },
  {
    icon: Star,
    title: 'Excellence',
    desc: 'We invest continuously in training, technology, and processes to deliver the highest quality survey services.',
  },
  {
    icon: Clock,
    title: 'Availability',
    desc: '24/7 emergency response across 9 global offices — we are there when our clients need us, wherever they need us.',
  },
];

const deliverables = [
  'Independent warranty survey services for offshore operations and marine towage',
  'P&I surveys for all major club groups worldwide — 24/7 across the UAE and globally',
  'Expert cargo survey services for commodity traders, insurers, and shipowners',
  'Support for legal proceedings with expert witness and dispute consultancy services',
  '24/7 emergency casualty response with surveyors across 9 global offices',
  'A culture of integrity, transparency, and professional excellence in every engagement',
];

export default function AboutPageClient() {
  return (
    <>
      <PageHero
        title="A Collaboration of Professional Stars"
        subtitle="International marine survey and consultancy, delivered by master mariners, naval architects, and offshore specialists since 2007."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
        ]}
        badge="Established 2007"
      />

      {/* ── Who We Are ──────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Image column */}
            <m.div {...fadeUp(0)} className="relative">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src="/images/marine-operations.jpg"
                  alt="Constellation Marine Services operations"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(11,37,69,0.5) 0%, transparent 60%)' }}
                />
              </div>
              {/* Est badge */}
              <div
                className="absolute -top-4 -left-4 w-20 h-20 rounded-full flex flex-col items-center justify-center text-center"
                style={{ background: 'var(--teal)', boxShadow: '0 4px 24px rgba(28,167,166,0.4)' }}
              >
                <span className="text-white text-xs font-bold leading-tight">Est.</span>
                <span className="text-white text-lg font-black leading-none">2007</span>
              </div>
              {/* Offices badge */}
              <m.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-4 -right-4 rounded-xl px-4 py-3 text-white"
                style={{ background: 'var(--navy)', boxShadow: '0 8px 32px rgba(11,37,69,0.3)' }}
              >
                <p className="text-2xl font-black leading-none" style={{ fontFamily: 'var(--font-montserrat)' }}>9</p>
                <p className="text-xs" style={{ color: 'var(--teal)' }}>Global Offices</p>
              </m.div>
            </m.div>

            {/* Text column */}
            <div>
              <m.p {...fadeUp(0.05)} className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                About Us
              </m.p>
              <m.h2
                {...fadeUp(0.1)}
                className="font-black mb-6"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', lineHeight: 1.2 }}
              >
                Who We Are
              </m.h2>
              {[
                'Constellation Marine Services LLC is an international ship and marine consultancy and survey firm, established in 2007 and headquartered in Abu Dhabi, UAE. We are a collaboration of professional stars — master mariners, naval architects, marine engineers, and offshore specialists — united by a shared commitment to delivering impeccably consistent, reliable, and independent marine survey services to clients worldwide.',
                'Our team brings together decades of first-hand sea-going and offshore operational experience, supplemented by extensive surveying and consultancy practice. We serve P&I clubs, hull underwriters, cargo insurers, shipowners, charterers, commodity traders, offshore operators, and law firms.',
                'Since our establishment, we have conducted thousands of surveys and consultancy assignments — from routine cargo condition surveys in UAE ports to major casualty investigations for international P&I clubs, and from tanker pre-purchase surveys to marine warranty surveys for large offshore construction projects.',
              ].map((para, i) => (
                <m.p key={i} {...fadeUp(0.15 + i * 0.07)} className="mb-4 leading-relaxed" style={{ color: 'rgba(14,27,42,0.75)', fontSize: '0.97rem' }}>
                  {para}
                </m.p>
              ))}
              <m.div {...fadeUp(0.35)} className="flex items-start gap-2 mt-2">
                <MapPin size={16} style={{ color: 'var(--teal)', marginTop: 3, flexShrink: 0 }} />
                <p className="text-sm" style={{ color: 'rgba(14,27,42,0.6)' }}>
                  Dar Al Salam Building, Cornish Street, Abu Dhabi, UAE — PO Box 27818
                </p>
              </m.div>
              <m.div {...fadeUp(0.4)} className="flex gap-3 mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90"
                  style={{ background: 'var(--cta)', color: '#fff' }}
                >
                  Get In Touch
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200"
                  style={{ borderColor: 'rgba(11,37,69,0.2)', color: 'var(--navy)' }}
                >
                  Meet Our Team <ArrowRight size={14} />
                </Link>
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Deliverables ────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <m.div {...fadeUp(0)}>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>What We Deliver</p>
              <h2 className="font-black mb-6" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', lineHeight: 1.2 }}>
                Our Core Service Commitments
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'rgba(14,27,42,0.7)', fontSize: '0.97rem' }}>
                Every engagement with Constellation Marine Services is guided by our commitment to independent, accurate, and timely delivery. Here is what our clients can expect from us on every assignment.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: 'var(--ocean)' }}
              >
                Explore All Services <ArrowRight size={15} />
              </Link>
            </m.div>
            <div className="space-y-4">
              {deliverables.map((item, i) => (
                <m.div
                  key={i}
                  {...fadeUp(i * 0.06)}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)' }}
                >
                  <CheckCircle2 size={18} style={{ color: 'var(--teal)', marginTop: 1, flexShrink: 0 }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--dark)' }}>{item}</p>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Credentials ─────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
            Our Credentials
          </m.p>
          <m.h2 {...fadeUp(0.05)} className="font-black mb-10" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontFamily: 'var(--font-montserrat)', color: 'var(--navy)' }}>
            Professional Affiliations & Certifications
          </m.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                logo: '/images/iims.png',
                title: 'IIMS',
                full: 'International Institute of Marine Surveying',
                desc: 'Our surveyors hold IIMS membership and qualifications, meeting the highest professional standards in marine surveying.',
              },
              {
                logo: '/images/itic.png',
                title: 'ITIC',
                full: 'International Transport Intermediaries Club',
                desc: 'We maintain full ITIC professional indemnity insurance cover, providing our clients with financial security and peace of mind.',
              },
              {
                logo: '/images/icv.png',
                title: 'ICV Certified',
                full: 'In-Country Value Programme',
                desc: "We actively support the UAE's In-Country Value programme, contributing to the development of the local maritime sector.",
              },
            ].map((c, i) => (
              <m.div
                key={c.title}
                {...fadeUp(i * 0.1)}
                className="flex flex-col items-center p-6 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid rgba(11,37,69,0.07)' }}
              >
                <div className="relative w-20 h-12 mb-4">
                  <Image src={c.logo} alt={c.full} fill className="object-contain" />
                </div>
                <p className="font-black text-base mb-1" style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)' }}>{c.title}</p>
                <p className="text-xs mb-3 font-medium" style={{ color: 'var(--teal)' }}>{c.full}</p>
                <p className="text-sm text-center leading-relaxed" style={{ color: 'rgba(14,27,42,0.65)' }}>{c.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Presence ─────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: 'linear-gradient(160deg, var(--navy) 0%, #0e2f5a 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <m.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
              Global Network
            </m.p>
            <m.h2 {...fadeUp(0.05)} className="font-black text-white" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontFamily: 'var(--font-montserrat)' }}>
              9 Offices · 4 Continents · 1 Standard of Excellence
            </m.h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {offices.map((o, i) => (
              <m.div
                key={o.code}
                {...fadeUp(i * 0.04)}
                className="flex flex-col items-center p-4 rounded-xl text-center"
                style={
                  o.hq
                    ? { background: 'rgba(28,167,166,0.12)', border: '1px solid rgba(28,167,166,0.35)' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                <span
                  className="font-mono font-black text-lg mb-1"
                  style={{ color: o.hq ? 'var(--teal)' : 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}
                >
                  {o.code}
                </span>
                <span className="text-white font-semibold text-sm">{o.city}</span>
                <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{o.country}</span>
                {o.hq && (
                  <span
                    className="mt-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(28,167,166,0.2)', color: 'var(--teal)' }}
                  >
                    HQ
                  </span>
                )}
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ─────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <m.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
              What Drives Us
            </m.p>
            <m.h2 {...fadeUp(0.05)} className="font-black" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontFamily: 'var(--font-montserrat)', color: 'var(--navy)' }}>
              Our Core Values
            </m.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <m.div
                key={v.title}
                {...fadeUp(i * 0.08)}
                className="p-6 rounded-2xl"
                style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)', boxShadow: '0 2px 16px rgba(11,37,69,0.05)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(28,167,166,0.1)' }}
                >
                  <v.icon size={22} style={{ color: 'var(--teal)' }} />
                </div>
                <h3 className="font-black mb-2 text-base" style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(14,27,42,0.65)' }}>{v.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--navy)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <m.h2 {...fadeUp(0)} className="text-white font-black mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontFamily: 'var(--font-montserrat)' }}>
            Ready to Work With Us?
          </m.h2>
          <m.p {...fadeUp(0.08)} className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Our surveyors are available 24/7. Contact our team to discuss your survey requirements.
          </m.p>
          <m.div {...fadeUp(0.14)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: 'var(--cta)', color: '#fff' }}>
              Contact Us
            </Link>
            <Link href="/team" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
              Meet Our Team
            </Link>
          </m.div>
        </div>
      </section>
    </>
  );
}
