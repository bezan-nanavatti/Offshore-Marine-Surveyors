'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
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
  ArrowRight,
} from 'lucide-react';
import type { ServicePage } from '@/lib/services-data';

const iconMap: Record<string, React.ElementType> = {
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
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay },
});

export default function ServicesGrid({ services }: { services: ServicePage[] }) {
  return (
    <>
      {/* Services grid */}
      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? ShieldCheck;
              return (
                <m.article
                  key={service.slug}
                  {...fadeUp((i % 3) * 0.07)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(11,37,69,0.08)',
                    boxShadow: '0 2px 16px rgba(11,37,69,0.05)',
                  }}
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(11,37,69,0.13)' }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(11,37,69,0.75) 0%, rgba(11,37,69,0.1) 60%)' }}
                    />
                    {/* Icon */}
                    <div
                      className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: '#fff' }}
                    >
                      <Icon size={20} style={{ color: 'var(--teal)' }} />
                    </div>
                    {/* Number */}
                    <span
                      className="absolute top-3 right-3 text-xs font-mono font-bold"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2
                      className="font-black mb-2"
                      style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: '1rem' }}
                    >
                      {service.name}
                    </h2>
                    <p
                      className="text-sm leading-relaxed mb-4 flex-1"
                      style={{ color: 'rgba(14,27,42,0.62)' }}
                    >
                      {service.tagline}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                      style={{ color: 'var(--ocean)' }}
                    >
                      Learn More
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </m.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16" style={{ background: 'var(--navy)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <m.h2
            {...fadeUp(0)}
            className="text-white font-black mb-3"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontFamily: 'var(--font-montserrat)' }}
          >
            Need a Specific Service?
          </m.h2>
          <m.p {...fadeUp(0.07)} className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Our team handles the full spectrum of marine survey and offshore consultancy. Contact us to discuss your requirements.
          </m.p>
          <m.div {...fadeUp(0.12)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: 'var(--cta)', color: '#fff' }}>
              Request a Survey
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
              About Us
            </Link>
          </m.div>
        </div>
      </section>
    </>
  );
}
