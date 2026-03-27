import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost } from '@/lib/blog-posts';
import { jsonLd, breadcrumbSchema, siteUrl, TWITTER_HANDLE, SITE_NAME, LOGO_URL } from '@/lib/seo';
import BlogPostClient from './BlogPostClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = siteUrl(`/blog/${post.slug}`);
  const image = siteUrl(post.image);

  return {
    title: `${post.title} | Constellation Marine Services Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: siteUrl(post.image),
    url: siteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Constellation Marine Services LLC',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': siteUrl(`/blog/${post.slug}`),
    },
  };

  const crumbsJsonLd = breadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ]);

  // Related posts — same category, excluding current
  const related = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbsJsonLd) }}
      />
      <BlogPostClient post={post} related={related} />
    </>
  );
}
