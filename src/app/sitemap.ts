import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog-posts';
import { services } from '@/lib/services-data';
import { teamMembers } from '@/lib/team-data';
import { projects } from '@/lib/projects-data';
import { BASE_URL as BASE } from '@/lib/seo';

// Static pages use a fixed date — update when the page content changes.
// Do NOT use `new Date()` here; that signals to Google that every page
// changed today, causing unnecessary recrawling on every deployment.
const SITE_LAUNCH = new Date('2024-01-01');
const LAST_REVISED = new Date('2026-03-26');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: LAST_REVISED, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/about`,       lastModified: LAST_REVISED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services`,    lastModified: LAST_REVISED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/team`,        lastModified: LAST_REVISED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`,        lastModified: LAST_REVISED, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/projects`,    lastModified: LAST_REVISED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`,     lastModified: SITE_LAUNCH,  changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${BASE}/privacy`,     lastModified: SITE_LAUNCH,  changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE}/services/${service.slug}`,
    lastModified: LAST_REVISED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const teamPages: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${BASE}/team/${member.slug}`,
    lastModified: SITE_LAUNCH,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE}/projects/${project.slug}`,
    lastModified: SITE_LAUNCH,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...servicePages, ...teamPages, ...projectPages];
}
