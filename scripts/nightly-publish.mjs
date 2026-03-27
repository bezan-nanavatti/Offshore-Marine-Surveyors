#!/usr/bin/env node
/**
 * scripts/nightly-publish.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates the full nightly blog pipeline:
 *
 *   1. Checks "upload blog - word file only/" for .docx files
 *   2. Runs import-blog --auto to convert them
 *   3. If new posts were added: git add → commit → push
 *   4. Vercel (or your host) auto-deploys from the push
 *
 * This script is called by Windows Task Scheduler at 00:00 IST every day.
 * It is safe to run when no files exist — it exits cleanly with no changes.
 *
 * Logs are written to logs/nightly-publish.log
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs                       from 'fs';
import path                     from 'path';
import { spawnSync, execSync }  from 'child_process';
import { fileURLToPath }        from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const DROP_DIR  = path.join(ROOT, 'upload blog - word file only');
const LOG_DIR   = path.join(ROOT, 'logs');
const LOG_FILE  = path.join(LOG_DIR, 'nightly-publish.log');

// ─── Logging ─────────────────────────────────────────────────────────────────

fs.mkdirSync(LOG_DIR, { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf-8');
}

function logSection(title) {
  const bar = '─'.repeat(60);
  log(bar);
  log(title);
  log(bar);
}

// ─── Git helpers ─────────────────────────────────────────────────────────────

function git(args) {
  const result = execSync(`git ${args}`, { cwd: ROOT, encoding: 'utf-8' });
  return result.trim();
}

function hasUnstagedChanges() {
  // Returns true if blog-posts.ts or blog images changed
  const status = git('status --porcelain src/lib/blog-posts.ts public/images/blogs/');
  return status.length > 0;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  logSection(`Nightly publish — ${new Date().toUTCString()}`);

  // ── Step 1: Check for files ───────────────────────────────────────────────
  if (!fs.existsSync(DROP_DIR)) {
    log('ERROR: Drop folder not found. Check path.');
    process.exit(1);
  }

  const pending = fs.readdirSync(DROP_DIR).filter(
    f => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$')
  );

  if (pending.length === 0) {
    log('No .docx files found. Nothing to do. Exiting.');
    return;
  }

  log(`Found ${pending.length} file(s): ${pending.join(', ')}`);

  // ── Step 2: Run import-blog --auto ────────────────────────────────────────
  log('Running: node scripts/import-blog.mjs --auto');

  const importResult = spawnSync(
    'node', ['scripts/import-blog.mjs', '--auto'],
    { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' }
  );

  if (importResult.stdout) importResult.stdout.trim().split('\n').forEach(l => log('  ' + l));
  if (importResult.stderr) importResult.stderr.trim().split('\n').forEach(l => log('  [STDERR] ' + l));

  // Exit code 2 = posts were added; 0 = nothing added; anything else = error
  if (importResult.status === 1) {
    log('ERROR: import-blog exited with an error. Aborting publish.');
    process.exit(1);
  }

  if (importResult.status === 0) {
    log('Import ran but no posts were added. Nothing to commit.');
    return;
  }

  // ── Step 3: Verify changes exist ─────────────────────────────────────────
  if (!hasUnstagedChanges()) {
    log('No changes detected in git. Skipping commit.');
    return;
  }

  // ── Step 4: git add ───────────────────────────────────────────────────────
  log('Staging changes...');
  git('add src/lib/blog-posts.ts');
  git('add public/images/blogs/');

  // ── Step 5: git commit ────────────────────────────────────────────────────
  const date   = new Date().toISOString().split('T')[0];
  const msg    = `blog: nightly auto-import ${date}`;
  log(`Committing: "${msg}"`);
  git(`commit -m "${msg}"`);

  // ── Step 6: git push ──────────────────────────────────────────────────────
  log('Pushing to origin...');
  try {
    git('push');
    log('Push successful. Vercel rebuild triggered.');
  } catch (err) {
    log(`ERROR: git push failed — ${err.message}`);
    log('The commit was made locally. Run "git push" manually to deploy.');
    process.exit(1);
  }

  log('Nightly publish complete.');
}

main().catch(err => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
