"use client";

import { m } from "framer-motion";
import { Award, Globe2, FileText, HeartHandshake } from "lucide-react";

/* ── Data ───────────────────────────────────────────────────────── */
const reasons = [
  {
    icon: Award,
    title: "18+ Years of Excellence",
    description:
      "Operating since 2007, our surveyors bring decades of hands-on experience in offshore marine warranty, rig moves, and casualty investigations across global waters.",
    stat: "2007",
    statLabel: "Est.",
  },
  {
    icon: Globe2,
    title: "Truly Global Operations",
    description:
      "9 offices spanning the UAE, UK, Singapore, Netherlands, Oman, Egypt, and China — we respond swiftly to marine events anywhere in the world.",
    stat: "9",
    statLabel: "Offices",
  },
  {
    icon: FileText,
    title: "Professional Reporting",
    description:
      "Our highly qualified team delivers meticulous, court-admissible reports trusted by P&I Clubs, marine insurers, ship owners, charterers, and law firms.",
    stat: "100%",
    statLabel: "Reliable",
  },
  {
    icon: HeartHandshake,
    title: "24/7 Emergency Response",
    description:
      "Marine casualties don't keep business hours. Our emergency response team is available around the clock for immediate deployment to any incident.",
    stat: "24/7",
    statLabel: "Available",
  },
];

/* ── Animation ──────────────────────────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ── Component ──────────────────────────────────────────────────── */
export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative section-padding overflow-hidden"
      style={{ background: "linear-gradient(155deg, #0B2545 0%, #1E5A8A 100%)" }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full pointer-events-none opacity-12"
        style={{ background: "radial-gradient(circle, #1CA7A6, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, #1CA7A6, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ──────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" as const }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-teal" />
            <span className="text-teal text-[11px] font-semibold tracking-[0.22em] uppercase">
              Why Choose Us
            </span>
            <span className="h-px w-8 bg-teal" />
          </div>
          <h2
            className="font-heading font-black text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 2.9rem)" }}
          >
            The Standard for Offshore
            <span className="block text-gradient"> Marine Excellence</span>
          </h2>
          <p className="text-white/55 text-lg leading-relaxed font-body">
            We deliver on promises — with experience, professionalism, and
            an unrivalled insight into marine and offshore markets.
          </p>
        </m.div>

        {/* ── Feature cards ───────────────────────────────────── */}
        <m.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {reasons.map(({ icon: Icon, title, description, stat, statLabel }) => (
            <m.div
              key={title}
              variants={card}
              className="group relative bg-white/6 hover:bg-white/11 backdrop-blur-sm border border-white/10 hover:border-teal/45 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/25 cursor-default"
            >
              {/* Stat in corner */}
              <div className="absolute top-5 right-5 text-right">
                <div
                  className="font-heading font-black leading-none"
                  style={{
                    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                    background: "linear-gradient(135deg, #1CA7A6, #5dd6d5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat}
                </div>
                <div className="text-white/28 text-[8px] tracking-[0.3em] uppercase mt-0.5">
                  {statLabel}
                </div>
              </div>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal/14 border border-teal/25 mb-5 group-hover:bg-teal/24 group-hover:border-teal/45 transition-all duration-300">
                <Icon className="w-6 h-6 text-teal" />
              </div>

              <h3 className="font-heading font-bold text-white text-[15px] mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed font-body">
                {description}
              </p>
            </m.div>
          ))}
        </m.div>

        {/* ── Testimonial ─────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Thin separator */}
          <div className="border-t border-white/12 mb-10" />

          <div className="text-center">
            {/* Large quote mark */}
            <div
              className="font-heading font-black text-[5rem] leading-none text-teal/25 select-none mb-2"
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <blockquote className="text-white/70 text-lg md:text-xl italic leading-relaxed mb-7 font-body px-4">
              You and your team go much beyond the hype that surrounds CSR.
              You act first; solidly and abundantly.
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-14 bg-teal/35" />
              <div className="text-center">
                <p className="text-white/85 text-sm font-semibold font-heading">Peter Machado</p>
                <p className="text-white/38 text-xs mt-0.5">MD &amp; CEO, Seven Seas Ship Supplies</p>
              </div>
              <div className="h-px w-14 bg-teal/35" />
            </div>
          </div>
        </m.div>

      </div>
    </section>
  );
}
