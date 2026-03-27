"use client";

import { m } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { variants as mv, scrollIndicator } from "@/lib/motion";

/* ── Stats ──────────────────────────────────────────────────────── */
const heroStats = [
  { value: "18+",  label: "Years Experience" },
  { value: "9",    label: "Global Offices" },
  { value: "24/7", label: "Emergency Response" },
  { value: "100+", label: "Marine Services" },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background ──────────────────────────────────────────── */}
      <Image
        src="/images/hero_bg_1.jpg"
        alt=""
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden={true}
      />

      {/* Layered overlays for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(11,37,69,0.96) 0%, rgba(11,37,69,0.75) 55%, rgba(14,27,42,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle technical grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* Teal glow — bottom-left */}
      <div
        className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full pointer-events-none animate-pulse-glow"
        style={{ background: "radial-gradient(circle, rgba(28,167,166,0.18) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Ocean blue glow — top-right */}
      <div
        className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, rgba(30,90,138,0.35) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Left edge accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #1CA7A6 25%, #1CA7A6 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Maritime coordinate annotation — top-right corner */}
      <div
        className="absolute top-28 right-6 md:right-14 hidden md:flex flex-col items-end gap-1.5 select-none"
        aria-hidden="true"
      >
        <span className="text-teal/40 text-[10px] font-mono tracking-[0.18em]">24°28′N</span>
        <span className="text-teal/40 text-[10px] font-mono tracking-[0.18em]">54°22′E</span>
        <div className="h-px w-12 bg-teal/20 mt-0.5" />
        <span className="text-white/20 text-[9px] font-mono tracking-[0.22em] uppercase">ABU DHABI HQ</span>
      </div>

      {/* Decorative dashed circle — right edge, subtly visible */}
      <svg
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-[0.04] pointer-events-none hidden lg:block"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <circle cx="210" cy="210" r="200" fill="none" stroke="white" strokeWidth="1" strokeDasharray="6 10" />
        <circle cx="210" cy="210" r="140" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 8" />
        <line x1="10"  y1="210" x2="410" y2="210" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <line x1="210" y1="10"  x2="210" y2="410" stroke="white" strokeWidth="0.5" opacity="0.5" />
      </svg>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 lg:py-44 w-full">
        <m.div
          variants={mv.staggerHero}
          initial="hidden"
          animate="visible"
          className="max-w-[820px]"
        >
          {/* Eyebrow badge */}
          <m.div variants={mv.riseHero} className="inline-flex items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal/12 border border-teal/30 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-teal text-[11px] font-semibold tracking-[0.18em] uppercase">
                Established 2007
              </span>
            </span>
            <span className="text-white/25 text-[11px] font-mono tracking-[0.14em] hidden sm:inline">
              — International Marine Surveyors
            </span>
          </m.div>

          {/* Main headline */}
          <m.h1
            variants={mv.riseHero}
            className="font-heading font-black text-white leading-[1.02] mb-7"
            style={{ fontSize: "clamp(2.9rem, 7.5vw, 5.8rem)" }}
          >
            Expert Marine
            <span
              className="block text-gradient"
              style={{ lineHeight: 1.06 }}
            >
              Survey &amp;
            </span>
            <span className="block text-white/88" style={{ fontSize: "0.72em" }}>
              Offshore Consultancy
            </span>
          </m.h1>

          {/* Sub-description */}
          <m.p
            variants={mv.riseHero}
            className="text-white/62 text-lg md:text-xl max-w-[580px] leading-relaxed mb-11 font-body"
          >
            Constellation Marine Services provides world-class offshore marine
            warranty surveys, rig positioning, cargo inspections, and marine
            consultancy — trusted by P&amp;I Clubs, insurers, and law firms since 2007.
          </m.p>

          {/* CTA row */}
          <m.div variants={mv.riseHero} className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-cta hover:bg-cta/90 text-white font-semibold rounded-xl text-base transition-all duration-300 hover:shadow-2xl hover:shadow-cta/40 hover:-translate-y-1 active:translate-y-0"
            >
              Request a Survey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/7 hover:bg-white/14 backdrop-blur-sm text-white font-semibold rounded-xl text-base border border-white/18 hover:border-white/35 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              Explore Services
            </Link>
          </m.div>

          {/* Stats strip */}
          <m.div
            variants={mv.fade}
            className="flex flex-wrap gap-x-10 gap-y-5 pt-8 border-t border-white/12"
          >
            {heroStats.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="font-heading font-black leading-none"
                  style={{
                    fontSize: "clamp(1.6rem, 2.5vw, 2rem)",
                    background: "linear-gradient(135deg, #ffffff 20%, #1CA7A6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {value}
                </span>
                <span className="text-white/40 text-[10px] font-medium tracking-[0.18em] uppercase">
                  {label}
                </span>
              </div>
            ))}
          </m.div>
        </m.div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────── */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/28"
      >
        <span className="text-[9px] tracking-[0.32em] uppercase font-medium">Scroll</span>
        <m.div {...scrollIndicator}>
          <ChevronDown className="w-4 h-4" />
        </m.div>
      </m.div>

      {/* ── Bottom wave (transitions to TrustStrip navy) ─────────── */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-20"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,15 1440,45 L1440,80 L0,80 Z"
            fill="#0B2545"
          />
        </svg>
      </div>
    </section>
  );
}
