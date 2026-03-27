"use client";

import { useState, useEffect } from "react";
import { Menu, X, Anchor, Phone, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Our Team", href: "/team" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dashboard has its own header — don't render the public nav there
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-2xl shadow-black/20 border-b border-white/8 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => setMenuOpen(false)}
        >
          {/* Icon mark */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-teal/15 border border-teal/35 group-hover:bg-teal/25 group-hover:border-teal/60 transition-all duration-300">
            <Anchor className="w-5 h-5 text-teal" />
            {/* glow ring on hover */}
            <span className="absolute inset-0 rounded-xl ring-0 ring-teal/0 group-hover:ring-2 group-hover:ring-teal/30 transition-all duration-300" />
          </div>

          {/* Name */}
          <div className="flex flex-col leading-none">
            <span className="text-white font-heading font-bold text-[13px] tracking-[0.12em] uppercase">
              Constellation
            </span>
            <span className="text-teal text-[10px] font-semibold tracking-[0.22em] uppercase mt-[2px]">
              Marine Services
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ──────────────────────────────────────────── */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 group ${
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "text-teal"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-teal rounded-full transition-all duration-300 ${
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "w-4/5"
                    : "w-0 group-hover:w-4/5"
                }`} />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right: Phone + CTA + Hamburger ───────────────────────── */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+97126713320"
            className="hidden md:flex items-center gap-2 text-white/60 hover:text-teal text-[12px] font-medium tracking-wide transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">+971 2671 3320</span>
          </a>

          {/* Divider */}
          <span className="hidden md:block w-px h-4 bg-white/15" />

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-cta hover:bg-cta/90 text-white text-[13px] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cta/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            Request Survey
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-3.5 text-white/80 hover:text-teal transition-colors rounded-lg hover:bg-white/8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-navy/98 backdrop-blur-md border-t border-white/8 px-4 pt-3 pb-5 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-4 text-white/75 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-all duration-200"
            >
              {link.label}
              <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-30" />
            </Link>
          ))}
          <div className="pt-3 border-t border-white/8 mt-2">
            <a
              href="tel:+97126713320"
              className="flex items-center gap-2 px-4 py-3.5 text-white/50 text-sm mb-2"
            >
              <Phone className="w-3.5 h-3.5 text-teal" />
              +971 2671 3320 (Abu Dhabi)
            </a>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center px-5 py-3.5 bg-cta hover:bg-cta/90 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Request a Survey
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
