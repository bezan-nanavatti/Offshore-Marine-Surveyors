'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, User, Tag, Eye } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-posts';
import { inView, shadows, staggerDelay } from '@/lib/design-system';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  reads?: number;
}

export default function BlogCard({ post, index = 0, reads }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <m.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.55, delay: staggerDelay(index) }}
      className="group relative flex flex-col rounded-2xl overflow-hidden h-full bg-white border border-navy/[0.09]"
      style={{ boxShadow: shadows.card }}
      whileHover={{ y: -4, boxShadow: shadows.cardHover }}
    >
      {/* Cover image */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-navy/85 text-teal backdrop-blur-[8px]">
          <Tag size={10} className="inline mr-1 mb-0.5" />
          {post.category}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-dark/50 mb-3 flex-wrap">
          <span>{formattedDate}</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
          <span className="flex items-center gap-1">
            <User size={11} />
            {post.author}
          </span>
          {reads !== undefined && reads > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {reads.toLocaleString()} read{reads !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        {/* Title — line-clamp via webkit (no Tailwind equivalent) */}
        <Link href={`/blog/${post.slug}`}>
          <h2
            className="font-heading font-bold text-dark leading-snug mb-2 group-hover:text-ocean transition-colors duration-200"
            style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Description */}
        <p
          className="text-sm leading-relaxed text-dark/60 mb-4 flex-1"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.description}
        </p>

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:text-teal transition-colors duration-200 mt-auto"
          aria-label={`Read ${post.title}`}
        >
          Read Article
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </m.article>
  );
}
