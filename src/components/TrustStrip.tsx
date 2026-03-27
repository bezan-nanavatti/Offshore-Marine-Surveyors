"use client";

import { m, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

/* ── Count-up hook ──────────────────────────────────────────────── */
function useCountUp(target: number, duration: number, triggered: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, triggered]);
  return count;
}

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({
  numeric,
  prefix = "",
  suffix = "",
  label,
  triggered,
}: {
  numeric: number;
  prefix?: string;
  suffix?: string;
  label: string;
  triggered: boolean;
}) {
  const count = useCountUp(numeric, 1800, triggered);
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div
        className="font-heading font-black leading-none"
        style={{
          fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
          background: "linear-gradient(135deg, #ffffff 30%, #1CA7A6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {prefix}{count}{suffix}
      </div>
      <div className="text-white/45 text-xs font-semibold tracking-[0.22em] uppercase">
        {label}
      </div>
    </div>
  );
}

/* ── Data ───────────────────────────────────────────────────────── */
const stats = [
  { numeric: 18,  suffix: "+",  prefix: "", label: "Years Experience" },
  { numeric: 9,   suffix: "",   prefix: "", label: "Global Offices" },
  { numeric: 24,  suffix: "/7", prefix: "", label: "Emergency Response" },
  { numeric: 100, suffix: "+",  prefix: "", label: "Marine Services" },
];

const certLogos = [
  { src: "/images/iims.png", alt: "IIMS – International Institute of Marine Surveying" },
  { src: "/images/icv.png",  alt: "ICV – In-Country Value Programme Certificate" },
  { src: "/images/itic.png", alt: "ITIC – Insurance" },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function TrustStrip() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-navy py-20 overflow-hidden">

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Glow accent */}
      <div
        className="absolute right-0 top-0 w-[400px] h-[400px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle at 80% 0%, #1CA7A6, transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Stats row ─────────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16"
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} triggered={isInView} />
          ))}
        </m.div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="border-t border-white/10 mb-14" />

        {/* ── Certifications ────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" as const }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Left label */}
          <div className="text-center md:text-left">
            <p className="text-white/35 text-[10px] font-semibold tracking-[0.28em] uppercase mb-1.5">
              Recognised &amp; Certified By
            </p>
            <p className="text-white/55 text-sm font-body">
              Internationally accredited marine survey organisation
            </p>
          </div>

          {/* Right: logos + badge */}
          <div className="flex items-center gap-8 md:gap-12">
            {certLogos.map(({ src, alt }) => (
              <div
                key={alt}
                className="opacity-50 hover:opacity-90 transition-opacity duration-300"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={88}
                  height={52}
                  className="object-contain h-10 md:h-12 w-auto filter brightness-0 invert"
                />
              </div>
            ))}

            {/* Est. 2007 badge */}
            <div className="flex flex-col items-center justify-center w-[68px] h-[68px] rounded-full border-2 border-teal/40 bg-teal/10">
              <span className="text-teal font-heading font-black text-[17px] leading-none">2007</span>
              <span className="text-white/40 text-[8px] tracking-[0.25em] uppercase mt-0.5">Est.</span>
            </div>
          </div>
        </m.div>
      </div>

      {/* Bottom wave — transitions to light surface */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8 md:h-12">
          <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="#F5F7FA" />
        </svg>
      </div>
    </section>
  );
}
