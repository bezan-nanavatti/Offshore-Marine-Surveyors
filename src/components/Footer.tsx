import { Anchor, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

const serviceLinks = [
  { label: "Marine Warranty Survey",    href: "/services/marine-warranty-survey" },
  { label: "Rig Positioning & Moving",  href: "/services/rig-positioning-moving" },
  { label: "Cargo & Damage Survey",     href: "/services/cargo-damage-survey" },
  { label: "Marine Casualties",         href: "/services/marine-casualties" },
  { label: "Offshore Survey",           href: "/services/offshore-survey" },
  { label: "Hull & Machinery Survey",   href: "/services/hull-machinery-survey" },
  { label: "Project Management",        href: "/services/project-management" },
  { label: "Technical Due Diligence",   href: "/services/technical-due-diligence" },
  { label: "eCMID Audits",              href: "/services/ecmid-audits" },
  { label: "Dispute & Litigation",      href: "/services/dispute-litigation" },
];

const quickLinks = [
  { label: "Home",           href: "/" },
  { label: "About Us",       href: "/about" },
  { label: "Services",       href: "/services" },
  { label: "Projects",       href: "/projects" },
  { label: "Our Team",       href: "/team" },
  { label: "Blog",           href: "/blog" },
  { label: "Contact",        href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/constellation-marine-services/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/constellationms/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/constellationmarineservices/",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/constellationms/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCnoVqGDLWuw6p9DQIBLIUjA",
  },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal/20 border border-teal/40">
                <Anchor className="w-4.5 h-4.5 text-teal" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-heading font-bold text-sm tracking-wide uppercase">
                  Constellation
                </span>
                <span className="text-teal text-xs font-medium tracking-widest uppercase">
                  Marine Services
                </span>
              </div>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-6 font-body">
              International Ship and Marine Consultancy/Survey firm specialising
              in offshore marine warranty inspection and consultancy since 2007.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/6 hover:bg-teal/20 border border-white/10 hover:border-teal/40 text-white/50 hover:text-teal text-xs rounded-lg transition-all duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/50 hover:text-teal text-sm transition-colors duration-200 font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/50 hover:text-teal text-sm transition-colors duration-200 font-body"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                <span className="text-white/50 text-sm leading-snug font-body">
                  Dar Al Salam Building, Cornish Street,
                  <br />
                  Abu Dhabi, UAE – PO Box 27818
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal flex-shrink-0" />
                <a
                  href="tel:+97126713320"
                  className="text-white/50 hover:text-teal text-sm transition-colors font-body"
                >
                  +971 2671 3320
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal flex-shrink-0" />
                <a
                  href="tel:+97144232884"
                  className="text-white/50 hover:text-teal text-sm transition-colors font-body"
                >
                  +971 4423 2884 (Dubai)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal flex-shrink-0" />
                <a
                  href="mailto:info@offshoremarinesurveyors.com"
                  className="text-white/50 hover:text-teal text-sm transition-colors break-all font-body"
                >
                  info@offshoremarinesurveyors.com
                </a>
              </li>
            </ul>

            {/* Related sites */}
            <div className="mt-6 pt-5 border-t border-white/8">
              <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3">
                Related Sites
              </p>
              <div className="space-y-1.5">
                <a
                  href="https://marinesurveyordubai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/40 hover:text-teal text-xs transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  marinesurveyordubai.com
                </a>
                <a
                  href="https://shipsurveyorsfujairah.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/40 hover:text-teal text-xs transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  shipsurveyorsfujairah.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs font-body">
            © {new Date().getFullYear()} Constellation Marine Services LLC. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Constellation Marine Services LLC — Est. 2007, Abu Dhabi, UAE
          </p>
        </div>
      </div>
    </footer>
  );
}
