#!/usr/bin/env node
/**
 * scripts/delete-blog.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactively remove a published blog post and its images.
 *
 * Usage:
 *   npm run delete-blog
 *
 * What it does:
 *   1. Lists every published post with a number, title, and slug
 *   2. You pick one by number or slug
 *   3. Type DELETE to confirm
 *   4. Removes the entry from src/lib/blog-posts.ts
 *   5. Deletes the image folder from public/images/blogs/{slug}/
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs       from 'fs';
import path     from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const ROOT        = path.resolve(__dirname, '..');
const POSTS_FILE  = path.join(ROOT, 'src', 'lib', 'blog-posts.ts');
const IMAGES_BASE = path.join(ROOT, 'public', 'images', 'blogs');

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
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
    const block = source.slice(blockStart, endIdx);
    // Field regex accepts both quote styles
    const titleM    = block.match(/\n    title: ['"]([^'"]*)['"]/);
    const authorM   = block.match(/\n    author: ['"]([^'"]*)['"]/);
    const categoryM = block.match(/\n    category: ['"]([^'"]*)['"]/);
    const dateM     = block.match(/\n    date: ['"]([^'"]*)['"]/);
    posts.push({
      slug,
      title:    titleM    ? titleM[1]    : slug,
      author:   authorM   ? authorM[1]   : '',
      category: categoryM ? categoryM[1] : '',
      date:     dateM     ? dateM[1]     : '',
    });
  }
  return posts;
}

/** Remove one post entry from the source string. Returns the updated source. */
function removeEntry(source, slug) {
  // Match slug in either single or double quotes
  const startPattern = new RegExp(`\n  \\{\\n    slug: ['"]${slug}['"]`);
  const startMatch   = startPattern.exec(source);
  if (!startMatch) return null;

  const startIdx = startMatch.index;
  const endMarker = '\n    `,\n  },';
  const endIdx = source.indexOf(endMarker, startIdx);
  if (endIdx === -1) return null;

  return source.slice(0, startIdx) + source.slice(endIdx + endMarker.length);
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

  console.log('\n' + '═'.repeat(62));
  console.log('  Published posts');
  console.log('═'.repeat(62));
  posts.forEach((p, i) => {
    console.log(`\n  ${String(i + 1).padStart(2)}. ${p.title}`);
    console.log(`      Author:   ${p.author}`);
    console.log(`      Category: ${p.category}  |  Date: ${p.date}`);
    console.log(`      Slug:     ${p.slug}`);
  });
  console.log('');

  const input = (await ask(rl, '  Enter number or slug to delete (q to quit): ')).trim();

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

  const imagesDir  = path.join(IMAGES_BASE, post.slug);
  const hasImages  = fs.existsSync(imagesDir);
  const imageCount = hasImages ? fs.readdirSync(imagesDir).length : 0;

  console.log('\n' + '─'.repeat(62));
  console.log('  You are about to permanently delete:');
  console.log(`\n  Title:  ${post.title}`);
  console.log(`  Author: ${post.author}`);
  console.log(`  Slug:   ${post.slug}`);
  if (hasImages) console.log(`  Images: ${imageCount} file(s) will also be deleted`);
  console.log('─'.repeat(62));

  const confirm = (await ask(rl, '\n  Type  DELETE  to confirm, anything else to cancel: ')).trim();
  rl.close();

  if (confirm !== 'DELETE') {
    console.log('\n  Cancelled. Nothing was changed.\n');
    process.exit(0);
  }

  // ── Remove from blog-posts.ts ──────────────────────────────────────────────
  const updated = removeEntry(source, post.slug);
  if (!updated) {
    console.error(`\n  [ERROR] Could not locate entry for "${post.slug}" in blog-posts.ts\n`);
    process.exit(1);
  }
  fs.writeFileSync(POSTS_FILE, updated, 'utf-8');
  console.log(`\n  ✓ Removed entry from blog-posts.ts`);

  // ── Delete images ──────────────────────────────────────────────────────────
  if (hasImages) {
    fs.rmSync(imagesDir, { recursive: true, force: true });
    console.log(`  ✓ Deleted public/images/blogs/${post.slug}/`);
  }

  console.log('\n  Done.');
  console.log('  Push to GitHub (or run npm run build) to take the post offline.\n');
}

main().catch(err => {
  console.error('\n  [FATAL]', err.message);
  process.exit(1);
});
