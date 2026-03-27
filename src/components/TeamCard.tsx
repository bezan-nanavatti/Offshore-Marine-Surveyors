'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TeamMember } from '@/lib/team-data';

interface TeamCardProps {
  member: TeamMember;
  index?: number;
}

export default function TeamCard({ member, index = 0 }: TeamCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: '#fff',
        border: '1px solid rgba(11,37,69,0.09)',
        boxShadow: '0 2px 16px rgba(11,37,69,0.06)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(11,37,69,0.13)' }}
    >
      {/* Photo */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/3.2' }}>
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(11,37,69,0.7) 0%, transparent 55%)',
          }}
        />
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            className="text-white font-bold leading-tight"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1rem' }}
          >
            {member.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--teal)' }}>
            {member.title.split('—')[0].trim()}
          </p>
        </div>
      </div>

      {/* Specializations */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.specializations.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(11,37,69,0.06)',
                color: 'var(--navy)',
                fontWeight: 500,
              }}
            >
              {spec}
            </span>
          ))}
          {member.specializations.length > 3 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(28,167,166,0.1)',
                color: 'var(--teal)',
                fontWeight: 500,
              }}
            >
              +{member.specializations.length - 3} more
            </span>
          )}
        </div>

        {/* View Profile */}
        <Link
          href={`/team/${member.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto transition-colors duration-200"
          style={{ color: 'var(--ocean)' }}
          aria-label={`View profile of ${member.name}`}
        >
          View Profile
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </m.div>
  );
}
