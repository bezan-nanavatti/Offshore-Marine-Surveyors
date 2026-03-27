'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Tag } from 'lucide-react';
import PageHero from '@/components/PageHero';
import BlogCard from '@/components/BlogCard';
import type { TeamMember } from '@/lib/team-data';
import type { BlogPost } from '@/lib/blog-posts';
import { services } from '@/lib/services-data';

interface Props {
  member: TeamMember;
  articles: BlogPost[];
}

export default function TeamMemberClient({ member, articles }: Props) {
  const relatedServices = (member.relatedServices ?? [])
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean) as typeof services;

  return (
    <>
      <PageHero
        title={member.name}
        subtitle={member.title}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Our Team', href: '/team' },
          { label: member.name, href: `/team/${member.slug}` },
        ]}
        badge="Team Profile"
      />

      <section className="section-padding" style={{ background: 'var(--surface)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Photo & info card */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.09)' }}>
                <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
                <div className="p-4">
                  <p className="font-black text-sm mb-0.5" style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)' }}>
                    {member.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--teal)' }}>{member.title}</p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 mt-3 text-xs transition-colors duration-200 hover:text-ocean"
                      style={{ color: 'rgba(14,27,42,0.55)' }}
                    >
                      <Mail size={12} style={{ color: 'var(--teal)' }} />
                      {member.email}
                    </a>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div
                className="rounded-2xl p-4"
                style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.09)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                  Specializations
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {member.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(11,37,69,0.07)', color: 'var(--navy)' }}
                    >
                      <Tag size={9} style={{ color: 'var(--teal)' }} />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </m.div>

            {/* Bio */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="md:col-span-2"
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--teal)' }}>
                Professional Profile
              </p>
              <h2
                className="font-black mb-5"
                style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--navy)', fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)', lineHeight: 1.2 }}
              >
                {member.name}
              </h2>

              {member.bio.trim().split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className="mb-4 leading-relaxed"
                  style={{ color: 'rgba(14,27,42,0.75)', fontSize: '0.97rem' }}
                >
                  {para.trim()}
                </p>
              ))}

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90"
                  style={{ background: 'var(--cta)', color: '#fff' }}
                >
                  Request a Survey
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors duration-200"
                  style={{ borderColor: 'rgba(11,37,69,0.15)', color: 'var(--navy)' }}
                >
                  <ArrowLeft size={14} /> Our Team
                </Link>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16" style={{ background: 'var(--surface)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black mb-6"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}
            >
              Related Services
            </m.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedServices.map((svc, i) => (
                <m.div
                  key={svc.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <Link
                    href={`/services/${svc.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-2xl transition-all duration-200"
                    style={{ background: '#fff', border: '1px solid rgba(11,37,69,0.08)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(28,167,166,0.1)' }}
                    >
                      <Tag size={15} style={{ color: 'var(--teal)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-0.5" style={{ color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}>
                        {svc.name}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(14,27,42,0.55)' }}>
                        {svc.tagline}
                      </p>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </m.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles by this member */}
      {articles.length > 0 && (
        <section className="py-16" style={{ background: '#fff' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black mb-8"
              style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--navy)', fontFamily: 'var(--font-montserrat)' }}
            >
              Articles by {member.name}
            </m.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
