'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { m } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react';
import PageHero from '@/components/PageHero';


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.55, delay },
});

const offices = [
  {
    city: 'Abu Dhabi',
    country: 'UAE',
    hq: true,
    address: 'Dar Al Salam Building, Cornish Street, Abu Dhabi — PO Box 27818',
    phones: ['+971 2671 3320'],
    fax: '+971 2671 3325',
    email: 'info@offshoremarinesurveyors.com',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    hq: false,
    contact: 'Capt. Zarir Soli Irani',
    address: 'The Citadel #806, Business Bay, Dubai, UAE',
    phones: ['+971 4423 2884', '+971 5018 89614'],
    email: 'capt.irani@constellationms.com',
  },
  {
    city: 'Fujairah',
    country: 'UAE',
    hq: false,
    address: 'Al Maha Tower, Opp. Port of Fujairah, UAE — PO Box 9071',
    phones: ['+971 9223 6344', '+971 5014 05188'],
    email: 'const24x7@constellationms.com',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    hq: false,
    contact: 'Mr. Julien Gressier / Capt. John Noble',
    address: '2 Austin Street (off Shoreditch High Street), London E2 7NB',
    phones: ['+44 2077 396510', '+44 7876 211489'],
    email: 'const.london@constellationms.com',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    hq: false,
    address: '10 Anson Road, No. 14-01, International Plaza, Singapore',
    phones: ['+65 6223 3071'],
    email: 'const.sgp@constellationms.com',
  },
  {
    city: 'Muscat',
    country: 'Oman',
    hq: false,
    contact: 'Mr. Faisal AL Balushi',
    address: '17, Postal Code 324, Sohar, Oman',
    phones: ['+968 9988 4415'],
    email: 'const.oman@constellationms.com',
  },
  {
    city: 'Rotterdam',
    country: 'Netherlands',
    hq: false,
    contact: 'Mr. Gijs Van Nieuwkoop',
    address: 'Operetteweg 4, 1323 VA Almere-Stad, Netherlands',
    phones: ['+310 3654 64775', '+310 6543 62581'],
    email: 'const.europe@constellationms.com',
  },
  {
    city: 'Shanghai',
    country: 'China',
    hq: false,
    address: '1-309, Yufeng International Apartment, Haigang District, Qinhuangdao City, China',
    phones: ['+861 3933 509251'],
    email: 'const.china@constellationms.com',
  },
  {
    city: 'Cairo',
    country: 'Egypt',
    hq: false,
    contact: 'Engr. Hamdy Gaber',
    address: 'Victor Bassily-Bab, Alexandria, Egypt',
    phones: ['+2 0100 1600261'],
    email: 'const.egypt@constellationms.com',
  },
];

const services = [
  'Marine Warranty Survey',
  'Rig Positioning & Moving',
  'Cargo & Damage Survey',
  'Marine Casualties',
  'Project Management',
  'Technical Due Diligence',
  'eCMID Audits',
  'Dispute & Litigation Support',
  'Offshore Survey',
  'Hull & Machinery Survey',
  'Other',
];

// Country dial codes — most common regions first, then alphabetical
const DIAL_CODES = [
  { code: '+971', label: '+971 UAE' },
  { code: '+44',  label: '+44 United Kingdom' },
  { code: '+65',  label: '+65 Singapore' },
  { code: '+968', label: '+968 Oman' },
  { code: '+31',  label: '+31 Netherlands' },
  { code: '+86',  label: '+86 China' },
  { code: '+20',  label: '+20 Egypt' },
  { code: '+91',  label: '+91 India' },
  { code: '+1',   label: '+1 USA / Canada' },
  { code: '+966', label: '+966 Saudi Arabia' },
  { code: '+974', label: '+974 Qatar' },
  { code: '+965', label: '+965 Kuwait' },
  { code: '+973', label: '+973 Bahrain' },
  { code: '+962', label: '+962 Jordan' },
  { code: '+961', label: '+961 Lebanon' },
  { code: '+7',   label: '+7 Russia' },
  { code: '+49',  label: '+49 Germany' },
  { code: '+33',  label: '+33 France' },
  { code: '+39',  label: '+39 Italy' },
  { code: '+34',  label: '+34 Spain' },
  { code: '+30',  label: '+30 Greece' },
  { code: '+357', label: '+357 Cyprus' },
  { code: '+47',  label: '+47 Norway' },
  { code: '+45',  label: '+45 Denmark' },
  { code: '+46',  label: '+46 Sweden' },
  { code: '+358', label: '+358 Finland' },
  { code: '+90',  label: '+90 Turkey' },
  { code: '+61',  label: '+61 Australia' },
  { code: '+64',  label: '+64 New Zealand' },
  { code: '+60',  label: '+60 Malaysia' },
  { code: '+62',  label: '+62 Indonesia' },
  { code: '+63',  label: '+63 Philippines' },
  { code: '+66',  label: '+66 Thailand' },
  { code: '+84',  label: '+84 Vietnam' },
  { code: '+81',  label: '+81 Japan' },
  { code: '+82',  label: '+82 South Korea' },
  { code: '+92',  label: '+92 Pakistan' },
  { code: '+880', label: '+880 Bangladesh' },
  { code: '+94',  label: '+94 Sri Lanka' },
  { code: '+234', label: '+234 Nigeria' },
  { code: '+27',  label: '+27 South Africa' },
  { code: '+254', label: '+254 Kenya' },
  { code: '+55',  label: '+55 Brazil' },
  { code: '+52',  label: '+52 Mexico' },
  { code: '+54',  label: '+54 Argentina' },
];

// ─── Validation rules ─────────────────────────────────────────────────────────

const LIMITS = {
  name:     { min: 2,  max: 100  },
  company:  { min: 0,  max: 100  },
  email:    { min: 5,  max: 254  }, // RFC 5321 max
  phone:    { min: 0,  max: 30   },
  location: { min: 0,  max: 100  },
  message:  { min: 10, max: 2000 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormErrors = Partial<Record<keyof typeof LIMITS | 'service', string>>;

function validate(form: {
  name: string; company: string; email: string;
  phone: string; location: string; service: string; message: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (form.name.trim().length < LIMITS.name.min)
    errors.name = `Name must be at least ${LIMITS.name.min} characters.`;
  else if (form.name.length > LIMITS.name.max)
    errors.name = `Name must be ${LIMITS.name.max} characters or fewer.`;

  if (form.company.length > LIMITS.company.max)
    errors.company = `Company must be ${LIMITS.company.max} characters or fewer.`;

  if (!EMAIL_RE.test(form.email))
    errors.email = 'Please enter a valid email address.';
  else if (form.email.length > LIMITS.email.max)
    errors.email = `Email must be ${LIMITS.email.max} characters or fewer.`;

  if (form.phone && form.phone.length > LIMITS.phone.max)
    errors.phone = `Phone must be ${LIMITS.phone.max} characters or fewer.`;

  if (form.location.length > LIMITS.location.max)
    errors.location = `Location must be ${LIMITS.location.max} characters or fewer.`;

  if (!form.service)
    errors.service = 'Please select the service you require.';

  if (form.message.trim().length < LIMITS.message.min)
    errors.message = `Message must be at least ${LIMITS.message.min} characters.`;
  else if (form.message.length > LIMITS.message.max)
    errors.message = `Message must be ${LIMITS.message.max} characters or fewer.`;

  return errors;
}

export default function ContactPageClient() {
  const searchParams = useSearchParams();

  // Allowlist the ?service= query param against known service names to prevent
  // open-input injection — unknown values are silently dropped.
  const rawService = searchParams.get('service') ?? '';
  const prefilledService = services.includes(rawService) ? rawService : '';

  const [form, setForm] = useState({
    name:     '',
    company:  '',
    email:    '',
    dialCode: '+971',
    phone:    '',        // number portion only (dial code stored separately)
    location: '',
    service:  prefilledService,
    message:  '',
  });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Combine dial code + number into single phone string for validation & submission
    const fullPhone = form.phone.trim()
      ? `${form.dialCode} ${form.phone.trim()}`
      : '';

    const validationErrors = validate({
      name:     form.name,
      company:  form.company,
      email:    form.email,
      phone:    fullPhone,
      location: form.location,
      service:  form.service,
      message:  form.message,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          company:  form.company,
          email:    form.email,
          phone:    fullPhone,
          location: form.location,
          service:  form.service,
          message:  form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Server error (${res.status})`);
      }

      setSubmitted(true);
    } catch (err) {
      setErrors({
        message:
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again or call us directly.',
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400/40';
  const inputStyle = {
    background:  'rgba(255,255,255,0.06)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    color:       '#fff',
  };

  return (
    <>
      <PageHero
        title="Get In Touch"
        subtitle="9 offices across 4 continents. Available 24/7 for emergency survey response."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        badge="24/7 Response"
      />

      {/* ── Main contact ─────────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: 'linear-gradient(160deg, var(--navy) 0%, #0d2a50 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Form — 3 cols */}
            <m.div {...fadeUp(0)} className="lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
                Send an Enquiry
              </p>
              <h2 className="text-white font-black mb-6" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontFamily: 'var(--font-montserrat)' }}>
                How Can We Help?
              </h2>

              {submitted ? (
                <m.div
                  role="alert"
                  aria-live="polite"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-8 text-center"
                  style={{ background: 'rgba(28,167,166,0.1)', border: '1px solid rgba(28,167,166,0.3)' }}
                >
                  <CheckCircle size={40} style={{ color: 'var(--teal)' }} className="mx-auto mb-4" />
                  <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Message Received
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Thank you for your enquiry. A member of our team will be in touch with you shortly.
                    For urgent matters, please call us directly on{' '}
                    <a href="tel:+97126713320" className="underline" style={{ color: 'var(--teal)' }}>+971 2671 3320</a>.
                  </p>
                </m.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Full Name *
                      </label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        maxLength={LIMITS.name.max}
                        autoComplete="name"
                        className={inputClass}
                        style={errors.name ? { ...inputStyle, borderColor: 'rgba(255,107,53,0.6)' } : inputStyle}
                      />
                      {errors.name && <p className="mt-1 text-xs" style={{ color: '#FF6B35' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Company
                      </label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your company"
                        maxLength={LIMITS.company.max}
                        autoComplete="organization"
                        className={inputClass}
                        style={errors.company ? { ...inputStyle, borderColor: 'rgba(255,107,53,0.6)' } : inputStyle}
                      />
                      {errors.company && <p className="mt-1 text-xs" style={{ color: '#FF6B35' }}>{errors.company}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        maxLength={LIMITS.email.max}
                        autoComplete="email"
                        className={inputClass}
                        style={errors.email ? { ...inputStyle, borderColor: 'rgba(255,107,53,0.6)' } : inputStyle}
                      />
                      {errors.email && <p className="mt-1 text-xs" style={{ color: '#FF6B35' }}>{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Phone Number <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          name="dialCode"
                          value={form.dialCode}
                          onChange={handleChange}
                          autoComplete="tel-country-code"
                          style={{
                            ...inputStyle,
                            cursor: 'pointer',
                            width: '130px',
                            flexShrink: 0,
                            paddingRight: '8px',
                            paddingLeft: '10px',
                            fontSize: '13px',
                          }}
                        >
                          {DIAL_CODES.map((d) => (
                            <option key={d.code} value={d.code} style={{ background: 'var(--navy)' }}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="50 123 4567"
                          autoComplete="tel-national"
                          className={inputClass}
                          style={{
                            ...(errors.phone ? { ...inputStyle, borderColor: 'rgba(255,107,53,0.6)' } : inputStyle),
                            flex: 1,
                            minWidth: 0,
                          }}
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-xs" style={{ color: '#FF6B35' }}>{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Service Required *
                      </label>
                      <select
                        required
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className={inputClass}
                        style={errors.service ? { ...inputStyle, cursor: 'pointer', borderColor: 'rgba(255,107,53,0.6)' } : { ...inputStyle, cursor: 'pointer' }}
                      >
                        <option value="" style={{ background: 'var(--navy)' }}>Select a service…</option>
                        {services.map((s) => (
                          <option key={s} value={s} style={{ background: 'var(--navy)' }}>{s}</option>
                        ))}
                      </select>
                      {errors.service && <p className="mt-1 text-xs" style={{ color: '#FF6B35' }}>{errors.service}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Your Location <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                      </label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        maxLength={LIMITS.location.max}
                        autoComplete="country-name"
                        className={inputClass}
                        style={errors.location ? { ...inputStyle, borderColor: 'rgba(255,107,53,0.6)' } : inputStyle}
                      />
                      {errors.location && <p className="mt-1 text-xs" style={{ color: '#FF6B35' }}>{errors.location}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Message *
                    </label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your survey requirements, vessel details, location, and any urgency…"
                      maxLength={LIMITS.message.max}
                      className={inputClass}
                      style={errors.message ? { ...inputStyle, resize: 'none', borderColor: 'rgba(255,107,53,0.6)' } : { ...inputStyle, resize: 'none' }}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message
                        ? <p className="text-xs" style={{ color: '#FF6B35' }}>{errors.message}</p>
                        : <span />}
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {form.message.length}/{LIMITS.message.max}
                      </p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--cta)', color: '#fff' }}
                  >
                    {loading ? 'Sending…' : <><Send size={14} /> Send Enquiry</>}
                  </button>
                </form>
              )}
            </m.div>

            {/* Contact details — 2 cols */}
            <m.div {...fadeUp(0.1)} className="lg:col-span-2 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
                Direct Contact
              </p>
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {[
                  { icon: Phone, label: 'Abu Dhabi (HQ)', value: '+971 2671 3320', href: 'tel:+97126713320' },
                  { icon: Phone, label: 'Dubai Office', value: '+971 4423 2884', href: 'tel:+97144232884' },
                  { icon: Mail, label: 'Email', value: 'info@offshoremarinesurveyors.com', href: 'mailto:info@offshoremarinesurveyors.com' },
                  { icon: MessageCircle, label: 'WhatsApp 24/7', value: '+971 501 889 614', href: 'https://wa.me/971501889614' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-3 group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{ background: 'rgba(28,167,166,0.12)' }}
                    >
                      <item.icon size={16} style={{ color: 'var(--teal)' }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</p>
                      <p className="text-sm font-semibold text-white group-hover:text-teal transition-colors duration-200 break-all">{item.value}</p>
                    </div>
                  </a>
                ))}
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(28,167,166,0.12)' }}
                  >
                    <MapPin size={16} style={{ color: 'var(--teal)' }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Headquarters</p>
                    <p className="text-sm font-semibold text-white">Dar Al Salam Building</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Cornish Street, Abu Dhabi, UAE — PO Box 27818</p>
                  </div>
                </div>
              </div>

              {/* 24/7 badge */}
              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: 'rgba(28,167,166,0.1)', border: '1px solid rgba(28,167,166,0.25)' }}
              >
                <Clock size={20} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                <div>
                  <p className="text-white font-bold text-sm">24/7 Emergency Response</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Available around the clock for urgent survey attendance across all office locations.
                  </p>
                </div>
              </div>

              {/* Related sites */}
              <div
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Related Sites
                </p>
                {[
                  { label: 'marinesurveyordubai.com', href: 'https://marinesurveyordubai.com' },
                  { label: 'shipsurveyorsfujairah.com', href: 'https://shipsurveyorsfujairah.com' },
                ].map((site) => (
                  <a
                    key={site.href}
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm py-1 transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    ↗ {site.label}
                  </a>
                ))}
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* ── All Offices ─────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <m.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>
              Our Network
            </m.p>
            <m.h2 {...fadeUp(0.05)} className="font-black" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', fontFamily: 'var(--font-montserrat)', color: 'var(--navy)' }}>
              Global Office Directory
            </m.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offices.map((o, i) => (
              <m.div
                key={o.city}
                {...fadeUp(i * 0.05)}
                className="p-5 rounded-2xl"
                style={
                  o.hq
                    ? { background: 'var(--navy)', border: '1px solid transparent' }
                    : { background: '#fff', border: '1px solid rgba(11,37,69,0.08)' }
                }
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="font-black text-base"
                      style={{ fontFamily: 'var(--font-montserrat)', color: o.hq ? '#fff' : 'var(--navy)' }}
                    >
                      {o.city}
                    </p>
                    <p className="text-xs" style={{ color: o.hq ? 'var(--teal)' : 'rgba(14,27,42,0.5)' }}>
                      {o.country}
                    </p>
                  </div>
                  {o.hq && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: 'rgba(28,167,166,0.18)', color: 'var(--teal)' }}
                    >
                      HQ
                    </span>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: o.hq ? 'rgba(255,255,255,0.55)' : 'rgba(14,27,42,0.55)' }}>
                  {o.address}
                </p>
                {o.contact && (
                  <p className="text-xs font-medium mb-2" style={{ color: o.hq ? 'rgba(255,255,255,0.7)' : 'var(--ocean)' }}>
                    {o.contact}
                  </p>
                )}
                {o.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-xs mb-1 transition-opacity duration-200 hover:opacity-80"
                    style={{ color: o.hq ? 'rgba(255,255,255,0.75)' : 'var(--dark)' }}
                  >
                    <Phone size={11} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                    {p}
                  </a>
                ))}
                <a
                  href={`mailto:${o.email}`}
                  className="flex items-center gap-1.5 text-xs mt-1 transition-opacity duration-200 hover:opacity-80 break-all"
                  style={{ color: o.hq ? 'rgba(255,255,255,0.65)' : 'var(--ocean)' }}
                >
                  <Mail size={11} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                  {o.email}
                </a>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
