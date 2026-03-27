"use client";

import { m } from "framer-motion";
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
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services-data";

/* ── Icon mapping (services-data stores icon names as strings) ──────── */
const ICON_MAP: Record<string, LucideIcon> = {
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

/* ── Accent colours — alternating teal / ocean blue ─────────────────── */
const ACCENTS = ["#1CA7A6", "#1E5A8A"];

/* ── Animation ──────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ── Component ──────────────────────────────────────────────────────── */
export default function Services() {
  return (
    <section id="services" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ──────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" as const }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-teal" />
            <span className="text-teal text-[11px] font-semibold tracking-[0.22em] uppercase">
              Our Services
            </span>
            <span className="h-px w-8 bg-teal" />
          </div>
          <h2
            className="font-heading font-black text-dark mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.9rem)" }}
          >
            Comprehensive Marine
            <span className="block text-gradient-ocean">Survey Solutions</span>
          </h2>
          <p className="text-dark/55 text-lg leading-relaxed font-body">
            From offshore rig moves to casualty investigations — our expert
            team delivers professional marine services across the globe.
          </p>
        </m.div>

        {/* ── Service cards grid ──────────────────────────────── */}
        <m.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, idx) => {
            const Icon = ICON_MAP[service.icon] ?? ShieldCheck;
            const accent = ACCENTS[idx % ACCENTS.length];
            const num = String(idx + 1).padStart(2, "0");

            return (
              <m.article
                key={service.slug}
                variants={card}
                className="group relative bg-white rounded-2xl overflow-hidden border border-navy/8 shadow-sm hover:shadow-2xl hover:shadow-navy/12 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Learn more about ${service.name}`}
                />
                {/* ── Image layer ────────────────────────────────── */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                  {/* Default tinted overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, rgba(11,37,69,0.82) 0%, rgba(11,37,69,0.55) 100%)`,
                    }}
                    aria-hidden="true"
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(160deg, rgba(11,37,69,0.92) 0%, ${accent}55 100%)`,
                    }}
                    aria-hidden="true"
                  />

                  {/* Number badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="font-heading font-black text-white/20 group-hover:text-white/35 transition-colors duration-300"
                      style={{ fontSize: "clamp(2.5rem, 4vw, 3.2rem)", lineHeight: 1 }}
                    >
                      {num}
                    </span>
                  </div>

                  {/* Icon on image */}
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/25 bg-white/12 backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* ── Text content ───────────────────────────────── */}
                <div className="p-6">
                  <h3 className="font-heading font-bold text-dark text-[17px] mb-2.5 group-hover:text-navy transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="text-dark/58 text-sm leading-relaxed font-body mb-5">
                    {service.description.length > 160
                      ? service.description.slice(0, 157) + "…"
                      : service.description}
                  </p>
                  <span className="flex items-center gap-1.5 text-teal text-xs font-semibold tracking-[0.12em] uppercase group-hover:gap-2.5 transition-all duration-300">
                    Learn More
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                </div>
              </m.article>
            );
          })}
        </m.div>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="text-center mt-14"
        >
          <p className="text-dark/45 text-sm mb-4 font-body">
            Looking for a specific marine service?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy hover:bg-navy-light text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-navy/25 hover:-translate-y-1 active:translate-y-0"
          >
            Speak to Our Team
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </m.div>

      </div>
    </section>
  );
}
