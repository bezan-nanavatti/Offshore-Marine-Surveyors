#!/usr/bin/env node
/**
 * scripts/edit-blog.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactively edit the metadata of a published blog post.
 *
 * Usage:
 *   npm run edit-blog
 *
 * Editable fields:
 *   title, author, date, category, description, keywords
 *
 * Not editable here (edit the Word file and re-import to update content):
 *   slug, content, images
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs       from 'fs';
import path     from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const POSTS_FILE = path.join(ROOT, 'src', 'lib', 'blog-posts.ts');

const CATEGORIES = [
  'Marine Survey','Cargo Survey','Draft Survey','Offshore Survey',
  'Hull & Machinery','Marine Warranty','Port State Control',
  'Marine Casualties','Technical','General',
];

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

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

/** Parse every post entry in blog-posts.ts without executing TypeScript.
 *  Handles both single-quoted (legacy) and double-quoted (new imports) fields. */
function readAllPosts(source) {
  const posts = [];
  // Match slug in either single or double quotes
  const pattern = /\n  \{\n    slug: ['"]([^'"]+)['"]/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const blockStart = match.index;
    const slug = match[1];
    const endIdx = source.indexOf('\n    `,\n  },', blockStart);
    if (endIdx === -1) continue;
    const endPos = endIdx + '\n    `,\n  },'.length;
    const block  = source.slice(blockStart, endPos);

    // Field regex accepts both quote styles
    const titleM    = block.match(/\n    title: ['"]([^'"]*)['"]/);
    const authorM   = block.match(/\n    author: ['"]([^'"]*)['"]/);
    const dateM     = block.match(/\n    date: ['"]([^'"]*)['"]/);
    const categoryM = block.match(/\n    category: ['"]([^'"]*)['"]/);
    const descM     = block.match(/\n    description: ['"]([^'"]*)['"]/);
    const kwM       = block.match(/\n    keywords: (\[[^\]]*\])/);

    let keywords = [];
    try { keywords = kwM ? JSON.parse(kwM[1]) : []; } catch { keywords = []; }

    posts.push({
      slug,
      title:       titleM    ? titleM[1]    : '',
      author:      authorM   ? authorM[1]   : '',
      date:        dateM     ? dateM[1]     : '',
      category:    categoryM ? categoryM[1] : '',
      description: descM     ? descM[1]     : '',
      keywords,
      blockStart,
      endPos,
    });
  }
  return posts;
}

/** Replace a single-line string field inside an entry block.
 *  Replaces regardless of whether the current value uses single or double quotes,
 *  and always writes back using double quotes (JSON.stringify standard). */
function replaceStringField(block, field, newValue) {
  return block.replace(
    new RegExp(`(\\n    ${field}: )(['"])[^'"]*\\2`),
    `$1${JSON.stringify(newValue)}`
  );
}

/** Replace the keywords array inside an entry block. */
function replaceKeywords(block, keywords) {
  return block.replace(
    /\n    keywords: \[[^\]]*\]/,
    `\n    keywords: ${JSON.stringify(keywords)}`
  );
}

async function main() {
  if (!fs.existsSync(POSTS_FILE)) {
    console.error('\n  [ERROR] blog-posts.ts not found.\n');
    process.exit(1);
  }

  const source = fs.readFileSync(POSTS_FILE, 'utf-8');
  const posts  = readAllPosts(source);

  if (posts.length === 0) {
    console.log('\n  No blog posts found.\n');
    process.exit(0);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // ── Pick a post ─────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(62));
  console.log('  Published posts');
  console.log('═'.repeat(62));
  posts.forEach((p, i) => {
    console.log(`\n  ${String(i + 1).padStart(2)}. ${p.title}`);
    console.log(`      Author: ${p.author}  |  Date: ${p.date}`);
    console.log(`      Slug:   ${p.slug}`);
  });
  console.log('');

  const input = (await ask(rl, '  Enter number or slug to edit (q to quit): ')).trim();

  if (input.toLowerCase() === 'q' || input === '') {
    console.log('\n  Cancelled.\n');
    rl.close();
    process.exit(0);
  }

  let post;
  if (/^\d+$/.test(input)) {
    post = posts[parseInt(input, 10) - 1];
  } else {
    post = posts.find(p => p.slug === input);
  }

  if (!post) {
    console.error(`\n  [ERROR] No post found for: "${input}"\n`);
    rl.close();
    process.exit(1);
  }

  // ── Edit fields ──────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(62));
  console.log(`  Editing: ${post.slug}`);
  console.log('  Press Enter to keep the current value.\n');

  const newTitle = (await ask(rl, `  Title        [${post.title}]: `)).trim();
  const newAuthor = (await ask(rl, `  Author       [${post.author}]: `)).trim();
  const newDate = (await ask(rl, `  Date         [${post.date}]: `)).trim();

  console.log('');
  CATEGORIES.forEach((c, i) => console.log(`    ${String(i + 1).padStart(2)}. ${c}`));
  const catInput = (await ask(rl, `\n  Category     [${post.category}] (number, text, or Enter to keep): `)).trim();
  let newCategory = '';
  if (/^\d+$/.test(catInput)) {
    newCategory = CATEGORIES[parseInt(catInput, 10) - 1] || catInput;
  } else {
    newCategory = catInput;
  }

  console.log(`\n  Current description:\n  "${post.description}"\n`);
  const newDesc = (await ask(rl, '  New description (or Enter to keep): ')).trim();

  console.log(`\n  Current keywords: ${post.keywords.join(', ')}`);
  const kwInput = (await ask(rl, '  New keywords, comma-separated (or Enter to keep): ')).trim();
  const newKeywords = kwInput
    ? kwInput.split(',').map(k => k.trim()).filter(Boolean)
    : null;

  rl.close();

  // ── Apply changes ────────────────────────────────────────────────────────────
  const originalBlock = source.slice(post.blockStart, post.endPos);
  let updatedBlock = originalBlock;

  if (newTitle)    updatedBlock = replaceStringField(updatedBlock, 'title', newTitle);
  if (newAuthor) {
    updatedBlock = replaceStringField(updatedBlock, 'author', newAuthor);
    updatedBlock = replaceStringField(updatedBlock, 'authorSlug', authorToSlug(newAuthor));
  }
  if (newDate)     updatedBlock = replaceStringField(updatedBlock, 'date', newDate);
  if (newCategory) updatedBlock = replaceStringField(updatedBlock, 'category', newCategory);
  if (newDesc)     updatedBlock = replaceStringField(updatedBlock, 'description', newDesc);
  if (newKeywords) updatedBlock = replaceKeywords(updatedBlock, newKeywords);

  if (updatedBlock === originalBlock) {
    console.log('\n  No changes made.\n');
    process.exit(0);
  }

  const updatedSource = source.slice(0, post.blockStart) + updatedBlock + source.slice(post.endPos);
  fs.writeFileSync(POSTS_FILE, updatedSource, 'utf-8');

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(62));
  console.log('  Changes saved:');
  if (newTitle)    console.log(`  title       → ${newTitle}`);
  if (newAuthor)   console.log(`  author      → ${newAuthor}  (authorSlug auto-updated)`);
  if (newDate)     console.log(`  date        → ${newDate}`);
  if (newCategory) console.log(`  category    → ${newCategory}`);
  if (newDesc)     console.log(`  description → ${newDesc}`);
  if (newKeywords) console.log(`  keywords    → ${newKeywords.join(', ')}`);
  console.log('─'.repeat(62));
  console.log('\n  Done.');
  console.log('  Push to GitHub (or run npm run build) to publish the changes.\n');
}

main().catch(err => {
  console.error('\n  [FATAL]', err.message);
  process.exit(1);
});
