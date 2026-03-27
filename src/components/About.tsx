"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, MapPin, ArrowRight, FolderOpen } from "lucide-react";
import Link from "next/link";

const highlights = [
  "Marine Warranty Survey & Rig Move specialists since 2007",
  "Serving P&I Clubs, marine insurers, ship owners, and law firms",
  "Highly qualified team with unrivalled offshore experience",
  "Vast network of contacts in marine and offshore markets",
  "HSE expertise and industry best-practice compliance",
  "Engineering department with extensive offshore project experience",
];

const offices = [
  "Abu Dhabi", "Dubai", "Fujairah",
  "London", "Singapore", "Oman",
  "Netherlands", "China", "Egypt",
];

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ── LEFT: Image composition ────────────────────────────── */}
          <m.div
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="relative"
          >
            {/* Accent offset frame */}
            <div
              className="absolute inset-0 rounded-2xl border-2 border-teal/20 pointer-events-none translate-x-4 translate-y-4 -z-10"
              aria-hidden="true"
            />

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-navy/18 aspect-[4/3]">
              <Image
                src="/images/marine-operations.jpg"
                alt="Constellation Marine Services offshore operations"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Bottom gradient for readability of overlaid badge */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,37,69,0.72) 0%, transparent 45%)",
                }}
                aria-hidden="true"
              />

              {/* Bottom-left: inline text badge */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/55 text-xs font-mono tracking-[0.16em] uppercase mb-1">
                  Est. 2007 — Abu Dhabi, UAE
                </p>
                <p className="text-white font-heading font-bold text-base leading-snug">
                  Constellation Marine Services LLC
                </p>
              </div>
            </div>

            {/* Floating: 18+ Years badge — top-left */}
            <m.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.5, ease }}
              className="absolute -top-5 -left-4 lg:-left-7 bg-teal rounded-2xl p-5 shadow-2xl shadow-teal/30"
            >
              <p className="text-white font-heading font-black text-[2rem] leading-none">18+</p>
              <p className="text-white/80 text-[11px] mt-1 font-medium leading-tight">
                Years of<br />Excellence
              </p>
            </m.div>

            {/* Floating: Global offices — bottom-right */}
            <m.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5, ease }}
              className="absolute -bottom-7 -right-4 lg:-right-8 bg-navy rounded-2xl p-5 shadow-2xl w-56"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-white/55 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Global Network
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {offices.map((city) => (
                  <span
                    key={city}
                    className="text-[10px] px-2 py-0.5 bg-white/10 text-white/65 rounded-full"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </m.div>
          </m.div>

          {/* ── RIGHT: Content ─────────────────────────────────────── */}
          <m.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
          >
            {/* Section label */}
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-teal" />
              <span className="text-teal text-[11px] font-semibold tracking-[0.22em] uppercase">
                About Us
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-heading font-black text-dark mb-5"
              style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)" }}
            >
              A Collaboration of{" "}
              <span className="text-gradient-ocean">Professional Stars</span>
            </h2>

            {/* Body */}
            <p className="text-dark/60 text-base leading-relaxed mb-4 font-body">
              Constellation Marine Services is an International Ship and Marine
              Consultancy/Survey firm specialising in offshore marine warranty
              inspection, ship and cargo inspections for principals, insurance
              companies, and charterers.
            </p>
            <p className="text-dark/60 text-base leading-relaxed mb-8 font-body">
              Our name reflects our ethos — a collaboration of{" "}
              <em className="text-teal not-italic font-semibold">
                &ldquo;professional stars&rdquo;
              </em>{" "}
              committed to delivering impeccably consistent and reliable service
              across every engagement, anywhere in the world.
            </p>

            {/* Highlights list */}
            <ul className="space-y-2.5 mb-8">
              {highlights.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-teal flex-shrink-0 mt-0.5" />
                  <span className="text-dark/68 text-sm font-body leading-snug">{point}</span>
                </li>
              ))}
            </ul>

            {/* HQ address */}
            <div className="flex items-start gap-2.5 text-dark/45 text-xs mb-8 font-body">
              <MapPin className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" />
              <span>
                HQ: Dar Al Salam Building, Cornish Street, Abu Dhabi, UAE — PO Box 27818
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-navy hover:bg-navy-light text-white font-semibold rounded-xl text-sm transition-all duration-300 hover:shadow-xl hover:shadow-navy/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 px-7 py-3.5 border border-navy/20 hover:border-teal/50 text-navy hover:text-teal font-semibold rounded-xl text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <FolderOpen className="w-4 h-4" />
                View Projects
              </Link>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
