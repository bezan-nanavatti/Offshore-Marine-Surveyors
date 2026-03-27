"use client";

import { m } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { EASE_SMOOTH } from "@/lib/motion";

const contactItems = [
  {
    icon: Phone,
    label: "Phone (Abu Dhabi)",
    value: "+971 2671 3320",
    href: "tel:+97126713320",
  },
  {
    icon: Phone,
    label: "Phone (Dubai)",
    value: "+971 4423 2884",
    href: "tel:+97144232884",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@offshoremarinesurveyors.com",
    href: "mailto:info@offshoremarinesurveyors.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp 24/7",
    value: "+971 501 889 614",
    href: "https://wa.me/971501889614",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Dar Al Salam Building, Cornish Street, Abu Dhabi, UAE",
    href: undefined,
  },
];

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#0B2545" }}
    >
      {/* Background image — very subtle */}
      <Image
        src="/images/hero_bg_4.jpg"
        alt=""
        fill
        className="object-cover object-center opacity-[0.08]"
        loading="lazy"
        quality={60}
        aria-hidden={true}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
        aria-hidden="true"
      />

      {/* Teal glow — left */}
      <div
        className="absolute left-0 bottom-0 w-[500px] h-[500px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle at 0% 100%, #1CA7A6, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Orange glow — right */}
      <div
        className="absolute right-0 top-0 w-[400px] h-[400px] pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle at 100% 0%, #FF6B35, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Left accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #1CA7A6 25%, #1CA7A6 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-start">

          {/* ── LEFT: CTA copy ──────────────────────────────────── */}
          <m.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH }}
          >
            {/* Section label */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-teal" />
              <span className="text-teal text-[11px] font-semibold tracking-[0.22em] uppercase">
                Get In Touch
              </span>
            </div>

            <h2
              className="font-heading font-black text-white mb-6 leading-[1.04]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Ready to Request
              <span className="block text-gradient"> a Marine Survey?</span>
            </h2>

            <p className="text-white/58 text-lg leading-relaxed mb-8 font-body max-w-md">
              Whether you need an emergency casualty response or a planned
              offshore warranty survey, our team is ready to mobilise anywhere
              in the world. Contact us today.
            </p>

            {/* 24/7 badge */}
            <div className="flex items-center gap-4 mb-10 p-4 bg-white/5 border border-white/10 rounded-2xl w-fit">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal/18 border border-teal/35">
                <Clock className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm font-heading">24/7 Emergency Response</p>
                <p className="text-white/40 text-xs mt-0.5">Immediate worldwide deployment</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:info@offshoremarinesurveyors.com"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-cta hover:bg-cta/90 text-white font-semibold rounded-xl text-base transition-all duration-300 hover:shadow-2xl hover:shadow-cta/40 hover:-translate-y-1 active:translate-y-0"
              >
                Send an Enquiry
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="https://wa.me/971501889614"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-teal/40 text-white font-semibold rounded-xl text-base transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
              >
                <Zap className="w-4 h-4 text-teal" />
                WhatsApp Us
              </a>
            </div>
          </m.div>

          {/* ── RIGHT: Contact card ─────────────────────────────── */}
          <m.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH }}
            className="bg-white/[0.06] backdrop-blur-sm border border-white/12 rounded-3xl p-8 shadow-2xl shadow-black/30"
          >
            <h3 className="font-heading font-bold text-white text-lg mb-7">
              Contact Details
            </h3>

            <div className="space-y-5">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal/14 border border-teal/25 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-white/35 text-[10px] font-semibold uppercase tracking-[0.2em] mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-white/85 text-sm font-medium hover:text-teal transition-colors duration-200 break-all"
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white/85 text-sm font-medium leading-snug">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Offices note */}
            <div className="mt-7 pt-7 border-t border-white/10">
              <p className="text-white/28 text-[10px] font-semibold uppercase tracking-[0.22em] mb-2">
                Regional Offices
              </p>
              <p className="text-white/50 text-sm leading-relaxed font-body">
                Dubai · Fujairah · London · Singapore
                <br />
                Oman · Netherlands · China · Egypt
              </p>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
