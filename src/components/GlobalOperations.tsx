"use client";

import { m } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

/* ── Office data ────────────────────────────────────────────────── */
const offices = [
  { code: "AUH", city: "Abu Dhabi",  country: "UAE",            isHQ: true },
  { code: "DXB", city: "Dubai",      country: "UAE",            isHQ: false },
  { code: "FUJ", city: "Fujairah",   country: "UAE",            isHQ: false },
  { code: "LHR", city: "London",     country: "United Kingdom", isHQ: false },
  { code: "SIN", city: "Singapore",  country: "Singapore",      isHQ: false },
  { code: "MCT", city: "Muscat",     country: "Oman",           isHQ: false },
  { code: "RTM", city: "Rotterdam",  country: "Netherlands",    isHQ: false },
  { code: "PVG", city: "Shanghai",   country: "China",          isHQ: false },
  { code: "CAI", city: "Cairo",      country: "Egypt",          isHQ: false },
];

/* ── Animation ──────────────────────────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ── Component ──────────────────────────────────────────────────── */
export default function GlobalOperations() {
  return (
    <section
      id="global"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0B2545 0%, #0e2f5a 100%)" }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Teal glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px] pointer-events-none opacity-12"
        style={{ background: "radial-gradient(circle at 100% 100%, #1CA7A6, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Decorative rotating ring */}
      <svg
        className="absolute left-[-120px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] opacity-[0.05] pointer-events-none hidden xl:block animate-spin-slow"
        viewBox="0 0 380 380"
        aria-hidden="true"
      >
        <circle cx="190" cy="190" r="180" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 12" />
        <circle cx="190" cy="190" r="120" fill="none" stroke="#1CA7A6" strokeWidth="0.8" strokeDasharray="4 8" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-teal" />
            <span className="text-teal text-[11px] font-semibold tracking-[0.22em] uppercase">
              Worldwide Presence
            </span>
            <span className="h-px w-8 bg-teal" />
          </div>
          <h2
            className="font-heading font-black text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.9rem)" }}
          >
            Global Operations,
            <span className="block text-gradient"> Local Expertise</span>
          </h2>
          <p className="text-white/55 text-lg leading-relaxed font-body">
            With 9 strategically positioned offices across the Middle East,
            Europe, Asia, and Africa — we respond rapidly to marine events
            anywhere in the world.
          </p>
        </m.div>

        {/* ── Office grid ─────────────────────────────────────── */}
        <m.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {offices.map(({ code, city, country, isHQ }) => (
            <m.div
              key={code}
              variants={item}
              className={`group relative rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                isHQ
                  ? "bg-teal/15 border-teal/40 hover:bg-teal/22 hover:border-teal/60 hover:shadow-teal/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-teal/30 hover:shadow-navy/40"
              }`}
            >
              {/* HQ badge */}
              {isHQ && (
                <span className="absolute top-3 right-3 text-[9px] px-2 py-0.5 bg-teal/30 border border-teal/50 text-teal rounded-full font-semibold tracking-wider uppercase">
                  HQ
                </span>
              )}

              {/* Airport / port code — large mono */}
              <div
                className={`font-mono font-bold text-[11px] tracking-[0.28em] uppercase mb-2 ${
                  isHQ ? "text-teal" : "text-white/30 group-hover:text-teal/60"
                } transition-colors duration-300`}
              >
                {code}
              </div>

              {/* City */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <MapPin
                  className={`w-3 h-3 flex-shrink-0 ${isHQ ? "text-teal" : "text-white/35"}`}
                />
                <span
                  className={`font-heading font-bold text-base leading-none ${
                    isHQ ? "text-white" : "text-white/80 group-hover:text-white"
                  } transition-colors duration-200`}
                >
                  {city}
                </span>
              </div>

              {/* Country */}
              <div className={`text-[11px] font-medium pl-[18px] ${isHQ ? "text-white/55" : "text-white/35"}`}>
                {country}
              </div>
            </m.div>
          ))}
        </m.div>

        {/* ── Bottom note ─────────────────────────────────────── */}
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center text-white/28 text-xs font-mono tracking-[0.18em] uppercase mt-12 mb-10"
        >
          9 Offices · 4 Continents · 1 Standard of Excellence
        </m.p>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.65 }}
          className="text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal hover:bg-teal/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-teal/30 hover:-translate-y-1 active:translate-y-0"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </m.div>

      </div>
    </section>
  );
}
