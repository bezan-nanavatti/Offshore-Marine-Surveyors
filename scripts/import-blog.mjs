#!/usr/bin/env node
/**
 * scripts/import-blog.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Converts .docx files from "upload blog - word file only/" into live blog posts.
 *
 * INTERACTIVE (default)
 *   npm run import-blog
 *   Prompts you for each metadata field — use when you want full control.
 *
 * AUTO (unattended / nightly cron)
 *   npm run import-blog:auto
 *   Generates all SEO metadata automatically.
 *   If ANTHROPIC_API_KEY is set in .env.local, uses Claude for better SEO.
 *   Otherwise uses smart heuristics.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs       from 'fs';
import path     from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const ROOT        = path.resolve(__dirname, '..');
const DROP_DIR    = path.join(ROOT, 'upload blog - word file only');
const PROCESSED   = path.join(DROP_DIR, 'processed');
const POSTS_FILE  = path.join(ROOT, 'src', 'lib', 'blog-posts.ts');
const IMAGES_BASE = path.join(ROOT, 'public', 'images', 'blogs');
const ENV_FILE    = path.join(ROOT, '.env.local');

const AUTO_MODE = process.argv.includes('--auto');

// ─── Load .env.local (for ANTHROPIC_API_KEY in auto mode) ────────────────────

function loadEnv() {
  try {
    const lines = fs.readFileSync(ENV_FILE, 'utf-8').split('\n');
    for (const line of lines) {
      const m = line.match(/^([A-Z_]+)=(.+)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch { /* no .env.local — fine */ }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function authorToSlug(author) {
  return slugify(
    author.replace(/^(mr\.?|mrs\.?|ms\.?|dr\.?|prof\.?|capt\.?|eng\.?|rev\.?)\s+/i, '')
  );
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]) : '';
}

function stripH1(html) {
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
}

function escapeTemplateLiteral(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function indentLines(str, spaces) {
  const pad = ' '.repeat(spaces);
  return str.split('\n').map(l => (l.trim() ? pad + l : '')).join('\n');
}

// ─── SEO Heuristics ──────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','have','has','had',
  'do','does','did','will','would','could','should','may','might','must',
  'that','this','these','those','it','its','also','which','when','where',
  'how','what','who','their','they','them','then','than','such','each',
  'both','all','any','can','more','very','well','into','not','been','only',
]);

const CATEGORY_MAP = {
  'Draft Survey':      ['draft','draught','ballast','displacement','trim','bulk cargo'],
  'Cargo Survey':      ['cargo','loading','discharge','bill of lading','shipper','consignee'],
  'Marine Warranty':   ['warranty','mws','towage','rig move','mooring','transport'],
  'Offshore Survey':   ['offshore','fpso','platform','jack-up','semi-submersible','riser'],
  'Hull & Machinery':  ['hull','machinery','engine','propeller','grounding','collision'],
  'Marine Casualties': ['casualty','incident','accident','fire','explosion','stranding'],
  'Port State Control':['psc','port state','deficiency','detention','inspection','flag'],
  'Marine Survey':     ['survey','surveyor','inspection','marine','p&i','club'],
};

function detectCategory(text) {
  const lower = text.toLowerCase();
  let best = 'Marine Survey', bestScore = 0;
  for (const [cat, kws] of Object.entries(CATEGORY_MAP)) {
    const score = kws.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  return best;
}

function generateDescription(html) {
  const text = stripTags(html);
  if (text.length <= 155) return text;
  const chunk = text.slice(0, 155);
  // Prefer ending at a sentence boundary
  const dot = Math.max(chunk.lastIndexOf('. '), chunk.lastIndexOf('! '), chunk.lastIndexOf('? '));
  if (dot > 80) return chunk.slice(0, dot + 1);
  const space = chunk.lastIndexOf(' ');
  return chunk.slice(0, space) + '…';
}

function extractKeywords(title, html) {
  // Domain-specific phrases that matter for marine SEO
  const domainPhrases = [
    'marine survey','offshore survey','hull survey','cargo survey','draft survey',
    'draught survey','marine warranty','warranty survey','P&I','P&I club',
    'marine surveyor','vessel inspection','ship survey','UAE','Dubai',
    'Constellation Marine','offshore marine surveyors',
  ];
  const lowerText = (title + ' ' + stripTags(html)).toLowerCase();
  const found = domainPhrases.filter(p => lowerText.includes(p.toLowerCase()));

  // Significant words from headings
  const headingText = [...(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi))]
    .map(m => stripTags(m[1]))
    .join(' ');

  const words = (title + ' ' + headingText)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && !STOP_WORDS.has(w));

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);

  return [...new Set([...found, ...topWords])].slice(0, 10);
}

/** Replace empty alt="" on non-cover images with text from the preceding paragraph. */
function improveAltTexts(html, title) {
  let imgIndex = 0;
  return html.replace(/<img([^>]*)>/gi, (match, attrs, offset) => {
    const isCover = imgIndex++ === 0;
    if (isCover) return match; // Cover alt is set in the mammoth callback

    const before = html.slice(0, offset);
    const lastP  = before.match(/<p[^>]*>([\s\S]*?)<\/p>\s*$/i);
    const alt    = lastP
      ? stripTags(lastP[1]).slice(0, 80)
      : `${title} — figure ${imgIndex}`;

    const escaped = alt.replace(/"/g, '&quot;');
    if (/alt="/.test(attrs)) {
      return `<img${attrs.replace(/alt="[^"]*"/, `alt="${escaped}"`)}>`;
    }
    return `<img${attrs} alt="${escaped}">`;
  });
}

// ─── Claude API (optional, auto mode only) ───────────────────────────────────

async function enhanceWithClaude(title, plainText) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content:
            'You are an SEO specialist for a professional marine surveying company.\n' +
            'Return ONLY valid JSON — no markdown, no explanation.\n\n' +
            `Title: ${title}\n` +
            `Content (first 800 chars): ${plainText.slice(0, 800)}\n\n` +
            'Generate:\n' +
            '{"description":"Max 155 char SEO meta description. Include primary keyword naturally. Must read like a human wrote it.","keywords":["array","of","8","specific","marine","industry","keywords"]}',
        }],
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.content[0].text);
    console.log('  [SEO] Claude-generated metadata applied.');
    return parsed;
  } catch (err) {
    console.warn(`  [SEO] Claude API skipped (${err.message}). Using heuristics.`);
    return null;
  }
}

// ─── Known categories menu ───────────────────────────────────────────────────

const CATEGORIES = [
  'Marine Survey','Cargo Survey','Draft Survey','Offshore Survey',
  'Hull & Machinery','Marine Warranty','Port State Control',
  'Marine Casualties','Technical','General',
];

// ─── Core: process one .docx file ────────────────────────────────────────────

async function processFile(filename, mammoth, rl) {
  const filePath = path.join(DROP_DIR, filename);
  const defaultSlug = slugify(path.basename(filename, '.docx'));

  console.log(`\n${'═'.repeat(62)}`);
  console.log(`  Processing: ${filename}`);
  console.log(`${'═'.repeat(62)}\n`);

  // ── Slug ──────────────────────────────────────────────────────────────────
  let slug = defaultSlug;
  if (!AUTO_MODE) {
    const input = (await ask(rl, `  URL slug  [${defaultSlug}]: `)).trim();
    if (input) slug = input;
  }

  // ── Convert .docx → HTML with image extraction ────────────────────────────
  const imageOutDir = path.join(IMAGES_BASE, slug);
  fs.mkdirSync(imageOutDir, { recursive: true });

  let imageCounter = 0;
  let coverSrc     = '';

  const conversionOptions = {
    convertImage: mammoth.images.imgElement(async (image) => {
      const buffer  = await image.read();
      const rawExt  = (image.contentType || 'image/jpeg').split('/').pop();
      const ext     = rawExt === 'jpeg' ? 'jpg' : rawExt;
      const isCover = imageCounter === 0;

      // SEO-friendly naming: {slug}-cover.jpg, {slug}-1.jpg, {slug}-2.jpg …
      const name = isCover ? `${slug}-cover.${ext}` : `${slug}-${imageCounter}.${ext}`;
      imageCounter++;

      fs.writeFileSync(path.join(imageOutDir, name), buffer);
      const src = `/images/blogs/${slug}/${name}`;
      if (isCover) coverSrc = src;

      return { src, alt: isCover ? slug.replace(/-/g, ' ') : '' };
    }),
  };

  let result;
  try {
    result = await mammoth.convertToHtml({ path: filePath }, conversionOptions);
  } catch (err) {
    console.error(`  [ERROR] Could not read ${filename}: ${err.message}`);
    return false;
  }

  if (result.messages.length > 0) {
    console.log('  Conversion notes:');
    result.messages.forEach(m => console.log(`    [${m.type}] ${m.message}`));
  }

  let html = result.value;

  // Auto-detect before stripping
  const detectedTitle = extractH1(html);
  html = stripH1(html);

  // Remove cover image from inline content — it renders via the image: field
  if (coverSrc) {
    const escapedSrc = coverSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`<img[^>]*src="${escapedSrc}"[^>]*>`, 'i'), '').trim();
  }

  // ── Metadata ──────────────────────────────────────────────────────────────
  let title, author, authorSlug, date, category, description, keywords;
  const today = new Date().toISOString().split('T')[0];

  if (AUTO_MODE) {
    // ── Auto: heuristics + optional Claude enhancement ─────────────────────
    title       = detectedTitle || defaultSlug.replace(/-/g, ' ');
    author      = process.env.DEFAULT_BLOG_AUTHOR || 'Constellation Marine Services';
    authorSlug  = authorToSlug(author);
    date        = today;
    category    = detectCategory(title + ' ' + stripTags(html));
    description = generateDescription(html);
    keywords    = extractKeywords(title, html);

    // Optionally replace description + keywords with Claude-generated ones
    const enhanced = await enhanceWithClaude(title, stripTags(html));
    if (enhanced) {
      if (enhanced.description) description = enhanced.description;
      if (enhanced.keywords?.length) keywords = enhanced.keywords;
    }

    // Improve alt texts on inline images
    html = improveAltTexts(html, title);

    console.log(`  Title:       ${title}`);
    console.log(`  Author:      ${author}`);
    console.log(`  Date:        ${date}`);
    console.log(`  Category:    ${category}`);
    console.log(`  Description: ${description}`);
    console.log(`  Keywords:    ${keywords.join(', ')}`);
    if (coverSrc) console.log(`  Cover image: ${coverSrc}`);

  } else {
    // ── Interactive: prompt for each field ────────────────────────────────
    if (detectedTitle) console.log(`\n  Auto-detected title: "${detectedTitle}"`);
    const titleInput = (await ask(rl,
      detectedTitle ? '  Title  [press Enter to use above]: ' : '  Title: '
    )).trim();
    title = titleInput || detectedTitle;

    author     = (await ask(rl, '  Author (e.g. Capt. John Smith): ')).trim();
    authorSlug = authorToSlug(author);
    console.log(`  Author slug → ${authorSlug}`);

    const dateInput = (await ask(rl, `  Publish date  [${today}]: `)).trim();
    date = dateInput || today;

    console.log('');
    CATEGORIES.forEach((c, i) => console.log(`    ${String(i + 1).padStart(2)}. ${c}`));
    const catInput = (await ask(rl, '  Category (number or type your own): ')).trim();
    category = /^\d+$/.test(catInput)
      ? (CATEGORIES[parseInt(catInput, 10) - 1] || catInput)
      : catInput;

    const detectedDesc = generateDescription(html);
    console.log(`\n  Auto-detected description:\n  "${detectedDesc}"\n`);
    const descInput = (await ask(rl,
      '  Description  [press Enter to use above, or type a new one]: '
    )).trim();
    description = descInput || detectedDesc;

    const kwRaw = (await ask(rl, '  Keywords (comma-separated): ')).trim();
    keywords = kwRaw ? kwRaw.split(',').map(k => k.trim()).filter(Boolean) : extractKeywords(title, html);

    html = improveAltTexts(html, title);

    if (coverSrc) console.log(`\n  Cover image: ${coverSrc}`);
    else console.log(`\n  No images found. Place a cover at: public/images/blogs/${slug}/${slug}-cover.jpg`);
  }

  // ── Build TypeScript entry ────────────────────────────────────────────────
  const imageField   = coverSrc || `/images/blogs/${slug}/${slug}-cover.jpg`;
  const htmlIndented = indentLines(escapeTemplateLiteral(html), 6);

  const entry = `  {
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(title)},
    author: ${JSON.stringify(author)},
    authorSlug: ${JSON.stringify(authorSlug)},
    date: ${JSON.stringify(date)},
    category: ${JSON.stringify(category)},
    description: ${JSON.stringify(description)},
    keywords: ${JSON.stringify(keywords)},
    image: ${JSON.stringify(imageField)},
    content: \`
${htmlIndented}
    \`,
  },`;

  // ── Append to blog-posts.ts ───────────────────────────────────────────────
  let source = fs.readFileSync(POSTS_FILE, 'utf-8');
  // Anchor to the end of the blogPosts array specifically — not the last ]; in the file.
  const ANCHOR = '\n];\n\nexport function getBlogPost';
  const anchorAt = source.indexOf(ANCHOR);
  if (anchorAt === -1) {
    console.error('  [ERROR] Could not locate blogPosts array closing in blog-posts.ts');
    return false;
  }
  const insertAt = anchorAt; // insert before \n];
  source = source.slice(0, insertAt) + '\n' + entry + source.slice(insertAt);
  fs.writeFileSync(POSTS_FILE, source, 'utf-8');

  // ── Move processed file ───────────────────────────────────────────────────
  fs.renameSync(filePath, path.join(PROCESSED, filename));

  console.log(`\n  ✓ /blog/${slug} added to blog-posts.ts`);
  console.log(`  ✓ Images → public/images/blogs/${slug}/`);
  console.log(`  ✓ Archived → processed/${filename}`);

  return true; // signals that at least one post was added
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  loadEnv();

  let mammoth;
  try {
    mammoth = (await import('mammoth')).default;
  } catch {
    console.error('\n  [ERROR] mammoth is not installed. Run: npm install mammoth\n');
    process.exit(1);
  }

  if (!fs.existsSync(DROP_DIR)) {
    console.error(`\n  [ERROR] Drop folder not found:\n  ${DROP_DIR}\n`);
    process.exit(1);
  }

  const files = fs.readdirSync(DROP_DIR).filter(
    f => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$')
  );

  if (files.length === 0) {
    console.log('\n  No .docx files in "upload blog - word file only/".');
    if (!AUTO_MODE) console.log('  Drop a Word file there and run this command again.');
    process.exit(0);
  }

  if (AUTO_MODE) {
    console.log(`\n[${new Date().toISOString()}] Auto import — ${files.length} file(s): ${files.join(', ')}`);
  } else {
    console.log(`\n  Found ${files.length} file(s): ${files.join(', ')}`);
  }

  fs.mkdirSync(PROCESSED, { recursive: true });
  fs.mkdirSync(IMAGES_BASE, { recursive: true });

  const rl = AUTO_MODE
    ? null
    : readline.createInterface({ input: process.stdin, output: process.stdout });

  let addedCount = 0;

  for (const filename of files) {
    const ok = await processFile(filename, mammoth, rl);
    if (ok) addedCount++;

    if (!AUTO_MODE && files.indexOf(filename) < files.length - 1) {
      const cont = (await ask(rl, '\n  Continue to next file? [Y/n]: ')).trim().toLowerCase();
      if (cont === 'n') break;
    }
  }

  if (rl) rl.close();

  console.log('\n' + '─'.repeat(62));
  if (addedCount > 0) {
    console.log(`  ${addedCount} post(s) added.`);
    if (!AUTO_MODE) {
      console.log('  Dev server hot-reloads automatically.');
      console.log('  For production: npm run build');
    }
  } else {
    console.log('  No posts were added.');
  }
  console.log('─'.repeat(62) + '\n');

  // Exit code 2 = posts were added (used by nightly-publish)
  process.exit(addedCount > 0 ? 2 : 0);
}

main().catch(err => {
  console.error('\n  [FATAL]', err.message);
  process.exit(1);
});
