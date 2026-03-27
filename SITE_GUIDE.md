# Constellation Marine Services — Complete Site Guide

**Last updated:** 2026-03-27
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · MongoDB (optional)
**Live site:** https://offshoremarinesurveyors.com
**Admin dashboard:** https://offshoremarinesurveyors.com/dashboard/login

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure & Reasoning](#2-file-structure--reasoning)
3. [Design System](#3-design-system)
4. [Frontend — Every Page & Component](#4-frontend--every-page--component)
5. [Backend — API Routes & Libraries](#5-backend--api-routes--libraries)
6. [Content Management](#6-content-management)
7. [Admin Dashboard](#7-admin-dashboard)
8. [SEO Infrastructure](#8-seo-infrastructure)
9. [Security — What's In Place & What Was Fixed](#9-security--whats-in-place--what-was-fixed)
10. [Environment Variables](#10-environment-variables)
11. [Scripts Reference](#11-scripts-reference)
12. [How-To Guides](#12-how-to-guides)
13. [Maintenance Schedule](#13-maintenance-schedule)
14. [Missing Elements & Known Gaps](#14-missing-elements--known-gaps)
15. [Recommended Future Additions](#15-recommended-future-additions)
16. [Tips & Tricks](#16-tips--tricks)

---

## 1. Project Overview

This is a **production marketing and lead-generation website** for Constellation Marine Services LLC, an international marine surveying and consultancy firm based in Abu Dhabi since 2007. The site is fully custom-built — no WordPress, no page builders.

### What the site does

| Function | How |
|---|---|
| Presents the company, team, services, and projects | Static pages with rich SEO |
| Generates leads | Contact form → email notification + auto-reply + stored in database |
| Publishes industry blog articles | Word doc upload → auto-convert → publish pipeline |
| Tracks enquiries | Admin dashboard with search, filter, and status management |
| Ranks on Google | Schema.org JSON-LD, sitemaps, meta tags, Open Graph, canonical URLs |

### Deployment pipeline

```
Local machine
  │
  ├─ npm run import-blog  (adds new blog posts)
  ├─ npm run edit-blog    (fixes metadata)
  ├─ npm run delete-blog  (removes posts)
  │
  ▼
git push → GitHub → Vercel (auto-deploy on push to main)
  │
  └─ Live site rebuilt in ~60 seconds
```

---

## 2. File Structure & Reasoning

```
/
├── src/
│   ├── app/                    ← Next.js App Router — every folder = a URL
│   │   ├── layout.tsx          ← Root layout: Navbar, Footer, fonts, global SEO
│   │   ├── template.tsx        ← Page transition wrapper (runs on every navigation)
│   │   ├── globals.css         ← Design tokens, utility classes, animations
│   │   ├── page.tsx            ← Homepage (/)
│   │   ├── sitemap.ts          ← Auto-generated /sitemap.xml for Google
│   │   ├── robots.ts           ← /robots.txt
│   │   ├── error.tsx           ← Shown when a page crashes at runtime
│   │   ├── global-error.tsx    ← Shown when the root layout itself crashes
│   │   ├── loading.tsx         ← Shown while a page is loading (streaming)
│   │   ├── not-found.tsx       ← 404 page
│   │   ├── about/              ← /about
│   │   ├── services/           ← /services and /services/[slug]
│   │   ├── team/               ← /team and /team/[slug]
│   │   ├── projects/           ← /projects and /projects/[slug]
│   │   ├── blog/               ← /blog and /blog/[slug]
│   │   ├── contact/            ← /contact
│   │   ├── privacy/            ← /privacy
│   │   └── dashboard/          ← /dashboard (protected admin area)
│   │       ├── layout.tsx      ← Auth check for all dashboard routes
│   │       ├── page.tsx        ← Redirects to /dashboard/enquiries
│   │       ├── login/          ← /dashboard/login
│   │       └── enquiries/      ← /dashboard/enquiries
│   │
│   ├── components/             ← Reusable UI components
│   │   ├── Navbar.tsx          ← Top navigation bar
│   │   ├── Footer.tsx          ← Site footer
│   │   ├── PageHero.tsx        ← Hero banner used on every inner page
│   │   ├── BlogCard.tsx        ← Blog post card (used in list and related posts)
│   │   ├── PageTransition.tsx  ← Framer Motion fade between pages
│   │   └── MotionProvider.tsx  ← Optimised animation provider (lazy-loaded)
│   │
│   └── lib/                    ← Shared logic and data
│       ├── blog-posts.ts       ← ALL blog content lives here (the "database")
│       ├── seo.ts              ← SEO helpers: siteUrl(), jsonLd(), schemas
│       ├── sanitize.ts         ← HTML safety: asTrustedHtml(), sanitizeHtml()
│       ├── auth.ts             ← JWT sign/verify, cookie config
│       ├── admins.ts           ← Admin CRUD: findAdmin(), verifyPassword()
│       ├── submissions.ts      ← Contact form save: MongoDB → JSON fallback
│       ├── read-counts.ts      ← Blog read counter: file → memory fallback
│       └── db.ts               ← MongoDB connection singleton
│
├── scripts/                    ← Node.js automation scripts (not part of the site)
│   ├── import-blog.mjs         ← Converts Word docs to blog posts
│   ├── edit-blog.mjs           ← Edits blog post metadata interactively
│   ├── delete-blog.mjs         ← Deletes a blog post and its images
│   ├── nightly-publish.mjs     ← Orchestrates import → git commit → push
│   ├── nightly-publish.bat     ← Windows Task Scheduler entry point
│   └── seed-admin.mjs          ← Creates admin accounts
│
├── public/                     ← Static files served as-is (images, favicon, etc.)
│   └── images/
│       └── blogs/
│           └── {slug}/         ← One folder per blog post, named by slug
│
├── data/                       ← Runtime data files (gitignored, not in source control)
│   ├── admins.json             ← Admin accounts (bcrypt-hashed passwords)
│   ├── submissions.json        ← Contact form submissions
│   └── read-counts.json        ← Blog read counts
│
├── logs/                       ← Nightly publish logs (gitignored)
│   └── nightly-publish.log
│
├── upload blog - word file only/   ← Drop zone for Word documents
│   ├── README.md               ← Guide for using the upload system
│   └── processed/              ← Archived .docx files after import
│
├── Legacy/                     ← Old site files — not used, kept for reference
│
├── SITE_GUIDE.md               ← This file
├── CLAUDE.md / AGENTS.md       ← Instructions for AI assistants
├── .env.local                  ← Secrets (NEVER committed to git)
├── next.config.ts              ← Next.js + security headers configuration
├── package.json                ← Dependencies and npm scripts
└── tsconfig.json               ← TypeScript configuration
```

### Why this structure?

- **`src/app/`** follows Next.js App Router convention — each subfolder is a route. Files named `page.tsx` render at that URL. Files named `layout.tsx` wrap child routes.
- **Server components vs Client components** — Files without `'use client'` run only on the server (faster, better SEO). Files with `'use client'` run in the browser (needed for interactivity, animations).
- **`src/lib/`** holds shared code with no UI — data, auth, database, utilities. Nothing in lib/ renders HTML.
- **`data/` is gitignored** — submissions and read counts are runtime data, not source code.
- **`public/images/blogs/`** is the only public folder that changes at runtime (when blog images are extracted from Word docs).

---

## 3. Design System

### Brand Colours

Defined as CSS custom properties in `src/app/globals.css` and available as Tailwind classes:

| Token | Value | Tailwind Class | Usage |
|---|---|---|---|
| `--navy` | `#0B2545` | `text-navy`, `bg-navy` | Primary dark backgrounds, headings |
| `--ocean` | `#1E5A8A` | `text-ocean`, `bg-ocean` | Links, secondary accents |
| `--teal` | `#1CA7A6` | `text-teal`, `bg-teal` | Highlights, badges, icons, CTAs |
| `--cta` | `#FF6B35` | `text-cta`, `bg-cta` | Call-to-action buttons |
| `--surface` | `#F5F7FA` | `text-surface`, `bg-surface` | Page backgrounds |
| `--dark` | `#0E1B2A` | `text-dark`, `bg-dark` | Body text |
| `--gold` | `#C9A84C` | `text-gold`, `bg-gold` | Premium accents |

### Typography

| Variable | Font | Usage |
|---|---|---|
| `--font-montserrat` | Montserrat (Google Fonts) | Headings, nav, buttons |
| `--font-inter` | Inter (Google Fonts) | Body text, labels |

Both fonts are loaded via Next.js font optimisation (self-hosted after first build — no external requests at runtime).

### CSS Utility Classes

| Class | What it does |
|---|---|
| `.section-padding` | `padding: 5rem 0` (7rem on desktop) — standard section spacing |
| `.text-gradient` | Teal gradient text effect |
| `.text-gradient-ocean` | Ocean-to-teal gradient text |
| `.gradient-navy` | Navy-to-ocean background gradient |
| `.gradient-ocean` | Ocean-to-teal background gradient |
| `.gradient-dark` | Very dark navy background |
| `.card-hover` | Lift-on-hover effect (translateY + shadow) |
| `.glass` | Glassmorphism: semi-transparent white blur |
| `.glass-navy` | Glassmorphism: semi-transparent navy blur |
| `.prose-article` | Blog post body: paragraph spacing, heading sizes, styled lists |
| `.teal-line-l` | Decorative vertical teal line on left edge |
| `.section-rule` | Short horizontal teal rule used under section labels |
| `.wave-bottom` | Absolute-positioned SVG wave at bottom of sections |
| `.animate-float-slow` | Gentle floating animation (decorative elements) |
| `.animate-pulse-glow` | Pulsing glow animation |
| `.animate-spin-slow` | 30-second rotation (background geometric shapes) |
| `.animate-fade-up` | Page load reveal animations |

---

## 4. Frontend — Every Page & Component

### 4.1 Root Layout — `src/app/layout.tsx`

Wraps every single page on the site. Contains:
- Google Font loading (Montserrat + Inter)
- Global `<Navbar>` and `<Footer>`
- `<MotionProvider>` for Framer Motion (lazy-loaded to keep bundle small)
- Skip-to-content link (accessibility)
- Two JSON-LD schema blocks: `Organization` and `WebSite` (applied site-wide)
- `metadataBase` so relative image URLs work in Open Graph tags
- Google Search Console verification (via `NEXT_PUBLIC_GSC_VERIFICATION` env var)

**To change:** Edit `src/app/layout.tsx`. The `organizationJsonLd` object at the top contains the business address, phone numbers, and social media links — keep these updated.

### 4.2 Page Transition — `src/app/template.tsx`

Wraps every page in `<PageTransition>` which plays a Framer Motion fade animation when navigating between pages. Runs on every navigation because `template.tsx` re-mounts on route change (unlike `layout.tsx` which persists).

### 4.3 Homepage — `src/app/page.tsx`

The main landing page at `/`. Contains multiple sections rendered as one page:
- **Hero** — animated headline, CTA buttons, decorative elements
- **Services overview** — grid of service cards linking to `/services/[slug]`
- **Stats bar** — years in operation, offices, P&I clubs, countries
- **About teaser** — brief company description, link to `/about`
- **Featured blog posts** — latest 3 from `blog-posts.ts`
- **Contact CTA banner** — link to `/contact`

**To change:** Edit `src/app/page.tsx`. Most text is hardcoded in the file. Stats (years, offices, etc.) are also hardcoded — search for the number and update it.

### 4.4 About — `src/app/about/`

URL: `/about`

Two files:
- `page.tsx` — Server component: SEO metadata, JSON-LD (AboutPage schema)
- `AboutPageClient.tsx` — Client component: all the visual content

Sections: company history timeline, mission/vision, certifications, global presence map.

**To change content:** Edit `AboutPageClient.tsx`. Text, timeline years, certifications are all hardcoded there.

### 4.5 Services — `src/app/services/`

URLs: `/services` (list) and `/services/[slug]` (individual service)

**Data source:** `src/lib/services-data.ts` — a TypeScript array containing every service's slug, title, description, features, images, and related content.

**To add a service:**
1. Add an entry to `src/lib/services-data.ts`
2. The service automatically appears in the list page, sitemap, and navigation
3. Add a hero image to `public/images/` and update the `image` field

**To edit a service:** Find its entry in `services-data.ts` and edit the fields.

Service detail page (`[slug]/page.tsx`) generates:
- Dynamic `<title>` and meta description from service data
- JSON-LD `Service` schema
- Breadcrumb JSON-LD

### 4.6 Team — `src/app/team/`

URLs: `/team` (grid) and `/team/[slug]` (individual profile)

**Data source:** `src/lib/team-data.ts` — array of team member objects.

**To add a team member:**
1. Add photo to `public/images/team/`
2. Add entry to `src/lib/team-data.ts` with: `slug`, `name`, `title`, `bio`, `image`, `specialisations`, `certifications`
3. Appears automatically in the grid and sitemap

**To link a blog post to a team member:** Set the blog post's `authorSlug` to match the team member's `slug`. The blog post page will then show an author card with a link to their profile.

### 4.7 Projects — `src/app/projects/`

URLs: `/projects` (list) and `/projects/[slug]` (detail)

**Data source:** `src/lib/projects-data.ts` — array of project objects.

**To add a project:** Add entry to `projects-data.ts` with slug, title, client, year, description, images, services used.

### 4.8 Blog — `src/app/blog/`

URLs: `/blog` (list with search/filter) and `/blog/[slug]` (article)

**Data source:** `src/lib/blog-posts.ts` — this is the blog "database". Every post is a TypeScript object with:

| Field | Type | Description |
|---|---|---|
| `slug` | string | URL identifier: `/blog/{slug}` |
| `title` | string | Article title |
| `author` | string | Full name (e.g. "Capt. John Smith") |
| `authorSlug` | string | Must match a team member slug to link to their profile |
| `date` | string | ISO 8601: `"2026-03-27"` |
| `category` | string | Used for filtering on the blog list page |
| `description` | string | Meta description (max 155 chars) |
| `keywords` | string[] | SEO keywords array |
| `image` | string | Path to cover image: `/images/blogs/{slug}/{slug}-cover.jpg` |
| `content` | string | Full HTML content in a template literal |

**Blog list page features** (client component `BlogListClient.tsx`):
- Live search by title, description, and author
- Category filter dropdown
- Sort: Newest First, Oldest First, Most Read
- Animated card transitions

**Blog post page features** (client component `BlogPostClient.tsx`):
- Cover image (Next.js `<Image>` optimised)
- Author linked to team profile (if `authorSlug` matches)
- Category linked to filtered blog list
- Live read count (incremented on mount via API)
- Related posts (same category)
- Services sidebar + contact CTA

**Managing blog posts:** See Section 12 (How-To Guides) and the README in `upload blog - word file only/`.

### 4.9 Contact — `src/app/contact/`

URL: `/contact`

Form fields: Name, Company, Email, Phone, Location, Service (dropdown), Message
Honeypot field: hidden `website` field — bots fill it, humans don't

On submit:
1. Client-side validation runs first
2. POST to `/api/contact`
3. Server validates again (cannot be bypassed)
4. Saved to MongoDB or `data/submissions.json`
5. Email sent to team inbox
6. Auto-reply sent to submitter

**To change the service dropdown options:** Edit `KNOWN_SERVICES` in `src/app/api/contact/route.ts` AND update the matching list in `src/app/contact/ContactPageClient.tsx`.

**To change where emails go:** Update `CONTACT_EMAIL_TO` in `.env.local`.

### 4.10 Privacy Policy — `src/app/privacy/`

URL: `/privacy`

Static page with the privacy policy. All content is hardcoded in the file.

**To update:** Edit `src/app/privacy/page.tsx` directly.

### 4.11 Error Pages

| File | URL triggered | Purpose |
|---|---|---|
| `error.tsx` | When any page crashes | Shows error with retry button |
| `global-error.tsx` | When `layout.tsx` itself crashes | Emergency fallback with brand styling |
| `not-found.tsx` | Any 404 URL | Shows branded 404 with navigation links |
| `loading.tsx` | While a page loads | Animated loading skeleton |

These are all automatic — Next.js uses them without any configuration.

---

### 4.12 Components

#### `Navbar.tsx`
- Sticky top navigation
- Logo links to homepage
- Navigation links: Services, About, Team, Projects, Blog, Contact
- "Get a Quote" CTA button (links to `/contact`)
- Responsive: hamburger menu on mobile
- Transparent on hero sections, solid on scroll

**To change nav links:** Edit the links array in `Navbar.tsx`.
**To change the CTA button text or destination:** Find `Get a Quote` in `Navbar.tsx`.

#### `Footer.tsx`
- Company address (Abu Dhabi HQ)
- Phone numbers and email
- Social media links (Facebook, Instagram, LinkedIn, X/Twitter, YouTube)
- Quick links: Services, About, Team, Projects, Blog, Contact, Privacy
- Copyright year

**To update:** Edit `src/components/Footer.tsx`. Social links, phone numbers, and address are hardcoded.

#### `PageHero.tsx`
Used on every inner page (About, Services, Team, Blog, etc.). Accepts:
- `title` — headline
- `breadcrumbs` — array of `{label, href}` (renders clickable breadcrumb trail)
- `badge` — optional coloured label (used for blog category)
- `subtitle` — optional secondary text

#### `BlogCard.tsx`
Reusable blog post card. Shows: cover image, category badge, date, title, excerpt, author, read count.

#### `MotionProvider.tsx`
Wraps the site in Framer Motion's `LazyMotion` — loads animation code only when needed. Use `m.div` instead of `motion.div` throughout the site to benefit from this optimisation.

#### `PageTransition.tsx`
Fades between pages using Framer Motion's `AnimatePresence`. The animation is defined here — edit it to change the transition style.

---

## 5. Backend — API Routes & Libraries

### 5.1 API Routes

All API routes live in `src/app/api/`. They run on the server — users never see this code.

#### `POST /api/contact`
Handles the contact form. Full pipeline:
1. Validates `Content-Type: application/json`
2. Extracts IP from `x-forwarded-for` for rate limiting
3. Rate limit: 10 submissions per IP per hour (in-memory — resets on server restart)
4. Parses JSON body
5. Checks honeypot field (`website`) — silently discards bot submissions
6. Validates all fields (length limits, email format, service allowlist)
7. Sanitizes all text (strips control chars, BiDi overrides)
8. Strips CR/LF from name and email specifically (SMTP header injection prevention)
9. Saves to MongoDB → falls back to `data/submissions.json`
10. Sends team notification email and auto-reply (non-blocking — does not fail the request if email fails)
11. Returns `{ ok: true, id: "submission-id" }`

#### `POST /api/auth/login`
Admin login. Pipeline:
1. Rate limit: 5 attempts per IP per 15 minutes
2. Parses `{ adminId, password }`
3. Looks up admin by ID
4. Consistent timing delay on failure (prevents username enumeration)
5. Verifies bcrypt password hash
6. Issues JWT in HttpOnly, Secure, SameSite=Strict cookie
7. Returns `{ ok: true, adminId }`

#### `POST /api/auth/logout`
Clears the session cookie. No body required.

#### `GET /api/dashboard/enquiries`
Returns paginated list of submissions. Protected — requires valid JWT cookie. Query params: `page`, `limit`, `search`, `status`, `service`, `sort`.

#### `PATCH /api/dashboard/enquiries/[id]`
Updates a submission's status (new → reviewed → replied → closed). Protected.

#### `POST /api/blog/[slug]/read`
Increments read count for a blog post. Called automatically when a user opens a post. Rate limited: one increment per IP per slug per hour (prevents count manipulation).

#### `GET /api/blog/reads`
Returns all read counts as `{ [slug]: number }`. Used by the blog list when sorting by "Most Read".

---

### 5.2 Library Files (`src/lib/`)

#### `blog-posts.ts`
The blog content store. A TypeScript array of `BlogPost` objects. Every entry is a fully typed object with the post's metadata and full HTML content. Also exports:
- `getBlogPost(slug)` — find one post by slug
- `getBlogPostsByCategory(category)` — filter posts
- `blogCategories` — unique list of all categories (used by blog filter dropdown)

**This is the central file for all blog content.** If you add, edit, or delete posts manually, this is the file to change.

#### `seo.ts`
SEO utility functions:
- `siteUrl(path)` — builds a full URL using `NEXT_PUBLIC_SITE_URL`
- `jsonLd(obj)` — serializes a JSON-LD object safely (escapes `</script>` injection)
- `websiteSchema` — JSON-LD for `WebSite` with sitelinks search
- `breadcrumbSchema(items)` — generates BreadcrumbList JSON-LD
- Constants: `BASE_URL`, `SITE_NAME`, `LOGO_URL`, `TWITTER_HANDLE`

#### `sanitize.ts`
HTML safety layer with two functions:
- `asTrustedHtml(html)` — marks developer-authored HTML as safe (blog content from `blog-posts.ts`, which is source-controlled)
- `sanitizeHtml(html)` — strips dangerous tags and attributes from user-supplied HTML (future CMS content)

The branded `TrustedHtml` type ensures that `dangerouslySetInnerHTML` can only receive content that has passed through one of these functions. TypeScript enforces this.

#### `auth.ts`
- `signToken(payload)` — creates a signed JWT (30-day expiry)
- `verifyToken(token)` — verifies and decodes a JWT
- `COOKIE_NAME` — `"cms_session"`
- `cookieOptions` — HttpOnly, Secure, SameSite=Strict, Path=/dashboard, 30-day MaxAge

#### `admins.ts`
- `findAdmin(adminId)` — looks up an admin (MongoDB → JSON fallback)
- `verifyPassword(admin, password)` — bcrypt comparison
- `createAdmin(adminId, password)` — creates a new admin with hashed password

#### `submissions.ts`
- `saveSubmission(data)` — saves to MongoDB first, then JSON file, then memory
- `getSubmissions(options)` — retrieves with pagination, search, and filtering
- `updateSubmission(id, patch)` — updates status and adds history entry

Three-tier fallback: MongoDB → `data/submissions.json` → in-memory (last resort).

#### `read-counts.ts`
- `incrementReadCount(slug)` — increments and saves
- `getReadCount(slug)` — gets current count for one post
- `getAllReadCounts()` — returns all counts as `{slug: number}`

Two-tier: `data/read-counts.json` → in-memory (Vercel serverless fallback).

#### `db.ts`
MongoDB connection singleton using `globalThis` to survive hot-reload in development. Connects only when `MONGODB_URI` is set — otherwise returns `null` and all functions fall back to JSON files.

---

## 6. Content Management

### 6.1 Blog Posts

The complete blog pipeline:

```
Word doc (.docx)
      │
      ▼
upload blog - word file only/    ← Drop file here
      │
      ▼
npm run import-blog              ← Interactive: prompts for each field
  OR
npm run import-blog:auto         ← Automatic: uses heuristics + Claude AI (if API key set)
      │
      ▼
src/lib/blog-posts.ts            ← Entry appended here
public/images/blogs/{slug}/      ← Images extracted here
upload blog - word file only/processed/  ← Original file archived here
      │
      ▼
git push → Vercel rebuild → Live in ~60 seconds
```

**Tips for best results:**
- Use **Heading 1** style in Word for your article title (not just bold text) — the importer detects `<h1>` tags
- Name the file descriptively: `Capt-Smith-Hull-Survey-Guide.docx` becomes the URL
- Set `ANTHROPIC_API_KEY` in `.env.local` for AI-generated SEO metadata
- After import, run `npm run edit-blog` to correct title, author, and category if the auto-detection got them wrong

**Blog categories (current):**
Marine Survey, Cargo Survey, Draft Survey, Offshore Survey, Hull & Machinery, Marine Warranty, Port State Control, Marine Casualties, Technical, General

### 6.2 Services

**File:** `src/lib/services-data.ts`

Each service has: `slug`, `title`, `shortDescription`, `fullDescription`, `features[]`, `image`, `icon`. No script needed — edit the file directly and push.

### 6.3 Team Members

**File:** `src/lib/team-data.ts`

Each member has: `slug`, `name`, `title`, `bio`, `image`, `specialisations[]`, `certifications[]`, `email` (optional). Edit directly and push.

### 6.4 Projects

**File:** `src/lib/projects-data.ts`

Each project has: `slug`, `title`, `client`, `year`, `location`, `description`, `images[]`, `services[]`, `highlights[]`. Edit directly and push.

---

## 7. Admin Dashboard

URL: `/dashboard/login`
Login with `adminId` and `password` from `data/admins.json`.

### Authentication flow

1. POST credentials to `/api/auth/login`
2. Server verifies bcrypt hash, issues JWT in HttpOnly cookie
3. All `/dashboard/*` routes check the cookie via `dashboard/layout.tsx`
4. Cookie expires after 30 days
5. Logout via `/api/auth/logout` clears the cookie

### Enquiries dashboard (`/dashboard/enquiries`)

Features:
- Summary cards: total enquiries, new/unread, this month, conversion rate
- Bar chart of enquiries by month
- Pie chart of enquiries by service
- Searchable and filterable table: search name/company/email, filter by status or service
- Status workflow: New → Reviewed → Replied → Closed
- Full submission detail view (click a row)

### Creating an admin account

```bash
node scripts/seed-admin.mjs yourAdminId yourPassword
```

The script:
1. Hashes the password with bcrypt (cost 12)
2. Saves to MongoDB (if connected) AND `data/admins.json`

Multiple admins can be created. Each has a unique `id`, `adminId`, and `passwordHash`.

### Resetting a password

Run seed-admin with the same `adminId` — it overwrites the existing entry:
```bash
node scripts/seed-admin.mjs existingAdminId newPassword
```

### Removing an admin

Open `data/admins.json` and delete the relevant object from the array. If MongoDB is connected, also delete from the `admins` collection there.

---

## 8. SEO Infrastructure

Every page generates its own metadata. Here is what gets generated per page type:

### Static pages (About, Services, Contact, etc.)
- `<title>` — page title + " | Constellation Marine Services"
- `<meta name="description">` — specific to each page
- `canonical` URL
- Open Graph: title, description, image, URL, site name
- Twitter card: `summary_large_image`
- JSON-LD: relevant schema type (e.g., `AboutPage`, `ContactPage`, `Service`)
- JSON-LD: BreadcrumbList

### Blog posts
- All of the above
- JSON-LD: `Article` with headline, author, datePublished, image, publisher
- `og:type: article` with `publishedTime` and `authors`
- Keywords from the `keywords` array

### Site-wide (in root layout)
- JSON-LD: `Organization` — company name, address, phones, social URLs
- JSON-LD: `WebSite` — with SearchAction (sitelinks search box eligible)

### Sitemap (`/sitemap.xml`)
Auto-generated from:
- Static pages (hardcoded with priorities)
- All blog posts (date taken from `post.date`)
- All services
- All team members
- All projects

**Update the sitemap manually:** The `LAST_REVISED` constant in `src/app/sitemap.ts` should be updated when major content changes are made.

### Google Search Console

To verify ownership: set `NEXT_PUBLIC_GSC_VERIFICATION=your-verification-code` in `.env.local` and on Vercel. The verification meta tag is injected automatically in `layout.tsx`.

---

## 9. Security — What's In Place & What Was Fixed

### Security headers (applied to all responses)

| Header | Value | Protection |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing attacks |
| `X-Frame-Options` | `DENY` | Blocks clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter (older browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |
| `Content-Security-Policy` | Full CSP (see `next.config.ts`) | Restricts script/style/media sources |
| `Cross-Origin-Opener-Policy` | `same-origin` | Spectre mitigation |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevents cross-site resource loading |
| `Permissions-Policy` | camera, mic, geolocation, payment all off | Restricts browser feature access |

### Authentication security

- Passwords: bcrypt hashed, cost factor 12 (never stored in plaintext)
- Sessions: JWT in HttpOnly cookie (JavaScript cannot read it)
- Cookie flags: Secure (HTTPS only), SameSite=Strict (CSRF protection), Path=/dashboard
- Rate limiting: 5 login attempts per IP per 15 minutes
- Timing attack prevention: consistent delay on all failed logins (both wrong user AND wrong password)

### Contact form security

- Server-side validation mirrors client-side (cannot be bypassed)
- Honeypot field silently discards bots
- IP rate limiting: 10 submissions per hour
- Input sanitization: strips control characters and Unicode BiDi overrides
- SMTP header injection prevention: CR/LF stripped from name/email before email headers
- Service field: validated against a fixed allowlist (cannot submit arbitrary services)
- HTML in emails: all user data escaped before insertion into email HTML

### Blog content security

- Blog HTML is developer-authored (in `blog-posts.ts` which is source-controlled)
- Rendered via `asTrustedHtml()` — TypeScript type system enforces this cannot be bypassed
- The `sanitizeHtml()` function is available for any future user-supplied content

### What to keep in mind

- **Rotate credentials if anything feels off.** Gmail App Passwords and the JWT secret can be regenerated with no data loss (users just need to log in again after JWT rotation).
- **`.env.local` must never be committed to git.** It is in `.gitignore`. Double-check with `git status` before committing.
- **`data/` files are gitignored** — `submissions.json`, `admins.json`, and `read-counts.json` contain real data and are never committed.
- **The in-memory rate limiters reset on server restart.** On Vercel, serverless functions restart constantly. For production-grade rate limiting, connect Vercel KV (Redis).

---

## 10. Environment Variables

All variables go in `.env.local` at the project root, and in Vercel Project Settings → Environment Variables for production.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL of the site: `https://offshoremarinesurveyors.com` |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name for import scripts (default: "Constellation Marine Services") |
| `SMTP_HOST` | Yes (email) | SMTP server: `smtp.gmail.com` |
| `SMTP_PORT` | Yes (email) | Port: `587` (STARTTLS) or `465` (SSL) |
| `SMTP_SECURE` | Yes (email) | `false` for port 587, `true` for port 465 |
| `SMTP_USER` | Yes (email) | Gmail address used to send emails |
| `SMTP_PASS` | Yes (email) | Gmail App Password (16 chars, no spaces) |
| `CONTACT_EMAIL_TO` | Yes (email) | Where team notification emails go |
| `CONTACT_EMAIL_FROM` | No | Display "from" address for team notification |
| `NOREPLY_EMAIL_FROM` | No | From address for auto-reply (default: `noreply@offshoremarinesurveyors.com`) |
| `DASHBOARD_JWT_SECRET` | Yes (dashboard) | 64-char hex string for JWT signing. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `MONGODB_URI` | No | MongoDB connection string. Without this, JSON files are used |
| `MONGODB_DB_NAME` | No | Database name (default: `oms`) |
| `ANTHROPIC_API_KEY` | No (recommended) | Claude API key for AI SEO generation during blog import |
| `NEXT_PUBLIC_GSC_VERIFICATION` | No | Google Search Console verification code |
| `DEFAULT_BLOG_AUTHOR` | No | Fallback author name in auto-import mode |

### How to generate a new JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and set it as `DASHBOARD_JWT_SECRET`. Update both `.env.local` and Vercel.

### Gmail App Password setup

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Create a new app password (name it "OMS Website")
4. Copy the 16-character password (no spaces)
5. Set as `SMTP_PASS` in `.env.local` and Vercel

---

## 11. Scripts Reference

Run all scripts from the project root in a terminal:

| Command | What it does |
|---|---|
| `npm run dev` | Start development server at `http://localhost:3000` with hot reload |
| `npm run build` | Build for production (run before deploying manually) |
| `npm start` | Serve the production build locally |
| `npm run lint` | Check code for style/quality issues (ESLint) |
| `npm run type-check` | Check TypeScript types without building |
| `npm run import-blog` | Interactive blog import — prompts for every field |
| `npm run import-blog:auto` | Automatic blog import — uses heuristics and Claude AI |
| `npm run edit-blog` | Interactively edit a published post's metadata |
| `npm run delete-blog` | Interactively delete a published post and its images |
| `npm run nightly-publish` | Full automation: import → git commit → git push → Vercel rebuild |

### Nightly automation (Windows Task Scheduler)

The `scripts/nightly-publish.bat` file runs `nightly-publish.mjs` which:
1. Scans `upload blog - word file only/` for new .docx files
2. Runs `import-blog --auto` on each one
3. Stages changed files with `git add`
4. Commits with message `blog: nightly auto-import YYYY-MM-DD`
5. Pushes to GitHub → Vercel auto-deploys

Logs are written to `logs/nightly-publish.log`.

**To set up the scheduled task:** Open Windows Task Scheduler → Create Basic Task → Set trigger to Daily → Set action to run `scripts/nightly-publish.bat`.

---

## 12. How-To Guides

### How to upload a new blog post

1. Write the article in Word (.docx)
2. Format the title with the **Heading 1** style in Word
3. Name the file descriptively (e.g. `Capt-Smith-Cargo-Survey-Guide.docx`)
4. Drop the file into `upload blog - word file only/`
5. Open a terminal in the project root
6. Run `npm run import-blog` (guided) or `npm run import-blog:auto` (automatic)
7. Review the generated entry in `src/lib/blog-posts.ts`
8. Correct any wrong fields: `npm run edit-blog`
9. Push to GitHub: `git add . && git commit -m "blog: add new post" && git push`

### How to edit a published blog post's metadata

```bash
npm run edit-blog
```
Pick the post by number, press Enter to keep any field, type a new value to change it.

**Editable fields:** title, author, date, category, description, keywords
**Not editable via script:** slug (changes the URL, breaks links), content/images (re-import from Word)

### How to delete a published blog post

```bash
npm run delete-blog
```
Pick the post by number, type `DELETE` (all caps) to confirm. Both the `blog-posts.ts` entry and the image folder are removed.

### How to add or change a service

1. Open `src/lib/services-data.ts`
2. Add/edit the service object
3. Save and push

### How to add a team member

1. Add their photo to `public/images/team/{name}.jpg`
2. Open `src/lib/team-data.ts`
3. Add their object with all fields
4. Save and push

To link their blog posts to their profile, set `authorSlug` in each blog post to match their `slug` in `team-data.ts`.

### How to add a project

1. Add project photos to `public/images/projects/`
2. Open `src/lib/projects-data.ts`
3. Add the project object
4. Save and push

### How to update the company address or phone numbers

Two places to update:
1. `src/app/layout.tsx` — the `organizationJsonLd` object (affects Google's knowledge panel)
2. `src/components/Footer.tsx` — visible in the footer on every page

Also check `src/app/contact/ContactPageClient.tsx` if contact details appear there too.

### How to create a new admin account

```bash
node scripts/seed-admin.mjs yourAdminId yourPassword
```

Requirements:
- `adminId`: letters, numbers, underscores (e.g. `admin_sarah`)
- `password`: at least 8 characters

### How to rotate the JWT secret (e.g. after a security incident)

1. Generate a new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update `DASHBOARD_JWT_SECRET` in `.env.local`
3. Update the same variable in Vercel → Settings → Environment Variables
4. Redeploy on Vercel (or push any change to trigger it)
5. All active admin sessions are invalidated — admins need to log in again

### How to rotate the Gmail App Password

1. Go to your Google Account → Security → 2-Step Verification → App passwords
2. Delete the existing OMS Website app password
3. Create a new one — copy the 16-character code
4. Update `SMTP_PASS` in `.env.local`
5. Update the same variable in Vercel → Settings → Environment Variables
6. Redeploy

### How to connect MongoDB

1. Create a free cluster at `mongodb.com/atlas`
2. Create a database user with read/write permissions
3. Get the connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)
4. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/oms?retryWrites=true&w=majority
   MONGODB_DB_NAME=oms
   ```
5. Add the same variables to Vercel
6. The site automatically switches to MongoDB — no code changes needed

### How to add a new page

1. Create a folder in `src/app/` matching the desired URL (e.g. `src/app/certifications/`)
2. Create `page.tsx` inside it
3. Export `generateMetadata()` for SEO
4. Export a default component for the page content
5. Add the link to `Navbar.tsx` and `Footer.tsx`
6. Add to `sitemap.ts` in the `staticPages` array

### How to change the site's domain

1. Update `NEXT_PUBLIC_SITE_URL` in `.env.local` and Vercel
2. Update `metadataBase` in `src/app/layout.tsx` (it reads from `BASE_URL` which reads from the env var)
3. Update social media `sameAs` URLs in the `organizationJsonLd` in `layout.tsx` if needed
4. The sitemap, robots.txt, and all canonical URLs update automatically

### How to update the sitemap after major content changes

Open `src/app/sitemap.ts` and update `LAST_REVISED`:
```typescript
const LAST_REVISED = new Date('2026-04-01'); // update to today's date
```

### How to view contact form submissions without the dashboard

Open `data/submissions.json`. Each entry has: id, name, company, email, phone, location, service, message, ip, createdAt, status, history.

### How to deploy manually (without Vercel auto-deploy)

```bash
npm run build
# Then upload the .next/ folder and run npm start on your server
```

---

## 13. Maintenance Schedule

### Every time a blog is published
- [ ] Verify the post appears at `/blog/{slug}`
- [ ] Check cover image loads
- [ ] Confirm title and author are correct (`npm run edit-blog` if not)
- [ ] Verify category is correct (affects related posts and filtering)
- [ ] Check that push went through (`git log`)

### Monthly
- [ ] Check `logs/nightly-publish.log` for any errors
- [ ] Review `data/submissions.json` for new enquiries (or use the dashboard)
- [ ] Update `LAST_REVISED` in `sitemap.ts` if major content was added
- [ ] Check Google Search Console for crawl errors or manual actions
- [ ] Run `npm audit` to check for dependency vulnerabilities: `npm run audit`

### Quarterly
- [ ] Review and update team member profiles if anyone joined or left
- [ ] Add any new completed projects to `projects-data.ts`
- [ ] Update service descriptions if offerings have changed
- [ ] Check blog post metadata quality — run `npm run edit-blog` on older posts

### Annually
- [ ] Update copyright year in `src/components/Footer.tsx`
- [ ] Update the "years in operation" stat on the homepage (`src/app/page.tsx`)
- [ ] Review privacy policy for compliance
- [ ] Rotate JWT secret and SMTP credentials as a precaution
- [ ] Evaluate whether to upgrade Next.js or dependencies

---

## 14. Missing Elements & Known Gaps

These are features that are referenced, partially built, or obviously needed but not yet fully implemented:

### Content gaps

| Gap | Location | Notes |
|---|---|---|
| Blog post titles from filename, not H1 | `scripts/import-blog.mjs` | Word docs using bold paragraphs instead of Heading 1 style get wrong titles. Fix: use Heading 1 in Word |
| Author not auto-detected in import | `scripts/import-blog.mjs` | Auto mode uses `DEFAULT_BLOG_AUTHOR`. Author must be in filename or corrected via `edit-blog` |
| Blog post #6 truncated title | `blog-posts.ts` line ~6` | "Who Says We Don" — title was cut off (likely an apostrophe in the original) |
| Missing cover images for old posts | `public/images/blogs/` | Many legacy posts reference images that don't exist |

### Technical gaps

| Gap | Impact | Fix |
|---|---|---|
| In-memory rate limiting resets on serverless cold start | Rate limits ineffective on Vercel | Add Vercel KV (Redis): `npm install @vercel/kv` |
| Read counts reset on Vercel cold start | Analytics inaccurate | Same fix: use Vercel KV |
| No read counts persistence on Vercel for blog metrics | Most Read sort is inaccurate in production | Vercel KV |
| `data/` files not persisted on Vercel serverless | Submissions lost if MongoDB not connected | Connect MongoDB or use Vercel KV |
| No dashboard/enquiries auth middleware at route level | Dashboard layout does auth check — acceptable but could be middleware | Low priority |

### SEO gaps

| Gap | Impact |
|---|---|
| No `hreflang` tags | Irrelevant unless site goes multilingual |
| No structured data for individual team members (`Person` schema) | Minor — Google can infer from About/Team pages |
| No FAQ schema on service pages | Could improve search snippets |
| Blog posts from 2018-2021 have no SEO keywords | Low keyword relevance for old posts |

---

## 15. Recommended Future Additions

These would significantly improve the site's capability and are architecturally straightforward to add:

### High value

**1. Vercel KV (Redis) for persistent storage**
Replaces in-memory rate limiters and read count storage. Would make analytics and rate limiting work correctly in production.
```bash
npm install @vercel/kv
```
Then replace the Map-based rate limiters with `kv.incr()` calls.

**2. ANTHROPIC_API_KEY for blog SEO**
Add the key to `.env.local` and Vercel. Immediately improves auto-generated blog descriptions and keywords. The code is already written — just needs the key.

**3. Image optimisation on blog import**
The `import-blog.mjs` script extracts images from Word at full resolution (some are 700KB+). Adding `sharp` to resize/compress images to ≤200KB on extraction would significantly improve page load speed.
```bash
npm install sharp
```

**4. MongoDB connection**
Without it, all form submissions are only in `data/submissions.json` — a local file that doesn't exist on Vercel. With MongoDB, submissions persist permanently.

### Medium value

**5. Google Analytics / Plausible**
Add to `layout.tsx`. If using Plausible (privacy-first), add `plausible.io` to `connect-src` in `next.config.ts`.

**6. WhatsApp chat widget**
The phone number `+971 501 889 614` is already a WhatsApp number. A floating chat button would improve conversions. Can be added as a simple link: `https://wa.me/971501889614`.

**7. Case studies page**
Expand the Projects section into proper case studies with before/after, problem/solution narrative, and client quotes.

**8. Service inquiry forms per service**
Each service page could have a pre-filled contact form where the service field is pre-selected based on which service page the user is on.

**9. Newsletter signup**
Add an email field to the footer. Use Mailchimp or Resend for delivery. Store subscribers in MongoDB.

**10. Multi-language support (Arabic)**
The `lang="en"` in `layout.tsx` is already set correctly for English. Adding `/ar/` routes would require `i18n` routing configuration in `next.config.ts`.

### Low value (but nice to have)

**11. Blog search powered by Algolia**
The current in-memory search works well for ~30 posts but would struggle at 200+. Algolia's free tier handles thousands of posts.

**12. Print-friendly blog styles**
Add `@media print` CSS to `globals.css` for clients who want to print articles.

**13. Dark mode**
The design system uses CSS custom properties which makes dark mode straightforward to add. Add a class toggle on `<html>` and redefine the colour tokens.

---

## 16. Tips & Tricks

### Development

- **Hot reload is very fast** — the dev server (`npm run dev`) reflects changes to `.ts`/`.tsx` files almost instantly. No need to restart for most changes.
- **`blog-posts.ts` changes are reflected immediately** in dev mode — just save the file and the blog list/post updates.
- **TypeScript catches mistakes** — run `npm run type-check` before pushing to catch issues that would break the live site.
- **The `Legacy/` folder** contains the old site files. Reference it when wondering "what did the old site say?" but don't edit it.

### Blog workflow

- **Always check the slug after import** — the slug becomes the permanent URL. Once it's live and indexed by Google, changing it breaks incoming links.
- **`-blog` in filenames becomes `-blog` in slugs** — name files like `Author-Topic.docx` not `Author-Topic-blog.docx` to avoid redundant slugs like `/blog/some-post-blog`.
- **The `processed/` folder** inside the upload folder is a backup. You can delete these .docx files at any time without affecting the live site.
- **Keywords matter most** — the `keywords` array feeds directly into `<meta name="keywords">` and also informs the JSON-LD. Aim for 6-10 specific marine industry terms, not generic words.

### Deployment

- **Every `git push` to `main`/`master` triggers a Vercel rebuild** — takes ~60 seconds. Check Vercel's dashboard if you're unsure if a deploy succeeded.
- **Environment variables must be set in Vercel** — `.env.local` is only for local development. Adding a new env var locally requires also adding it in Vercel Settings → Environment Variables.
- **`npm run build` locally tests production build** — run it before pushing if you changed anything significant. Vercel will fail the deploy if the build fails.

### Performance

- **Use `next/image` (`<Image>`) for all images** — it auto-compresses and serves WebP/AVIF, lazy-loads, and prevents layout shift.
- **Images in blog content (`<img>` tags in HTML)** are NOT optimised — they come from Word docs. Keep source images under 300KB if possible, or add `sharp` compression to the import script.
- **Framer Motion animations are lazy-loaded** via `LazyMotion` in `MotionProvider.tsx` — don't import `motion` directly, always use `m.div` etc.

### Security reminders

- Never paste your Gmail App Password, JWT secret, or MongoDB URI in a message, email, or commit
- Always use `git status` before committing to confirm `.env.local` is not staged
- The dashboard at `/dashboard/login` is not hidden from search engines — that's fine, but make sure the password is strong
- If you ever suspect a credential was exposed, rotate it immediately (5 minutes of work, no data loss)

### Noteworthy details

- **`src/proxy.ts`** — This file sets up a development proxy, likely for testing API routes against a live backend during development. It is not part of the production site.
- **`AGENTS.md` / `CLAUDE.md`** — These files are instructions for AI assistants working on the codebase. They tell the AI to read the Next.js 16 docs before writing code (since Next.js 16 has breaking changes from previous versions).
- **The `asTrustedHtml` vs `sanitizeHtml` distinction** is important: `asTrustedHtml` is for content you wrote (blog posts in source control), `sanitizeHtml` is for content from external sources. Using the wrong one for the wrong purpose would be a security issue.
- **The `blogCategories` export in `blog-posts.ts`** is derived automatically from the posts array (`new Set(blogPosts.map(p => p.category))`). You never need to maintain a separate categories list — adding a new category to any post automatically adds it to the filter dropdown.
- **Read counts on Vercel reset occasionally** because the Lambda containers recycle. This is expected and documented. For reliable analytics, connect MongoDB or Vercel KV.
- **The nightly publish script uses `git push`** — it must be run on a machine where git is authenticated with GitHub (SSH key or personal access token). It will not work on Vercel itself.
