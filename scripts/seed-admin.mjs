#!/usr/bin/env node
/**
 * scripts/seed-admin.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates or updates an admin account.
 * Saves to MongoDB (if MONGODB_URI is set in .env.local) AND to
 * data/admins.json as a local backup.
 *
 * USAGE:
 *   node scripts/seed-admin.mjs <adminId> <password>
 *
 * EXAMPLES:
 *   node scripts/seed-admin.mjs admin_bezan MyStr0ngP@ssword
 *   node scripts/seed-admin.mjs admin_john  AnotherP@ss123
 *
 * REQUIREMENTS:
 *   • Run from the project root (where package.json lives)
 *   • .env.local must exist with MONGODB_URI (optional) and DASHBOARD_JWT_SECRET
 *   • npm install must have been run (bcryptjs needs to be available)
 *
 * SECURITY:
 *   • data/admins.json is gitignored — never commit it
 *   • Never share or log the password after hashing
 *   • Use a strong, unique password (12+ chars, mixed case, digits, symbols)
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const require   = createRequire(import.meta.url);

// ─── Load .env.local ──────────────────────────────────────────────────────────

const envFile = path.join(ROOT, '.env.local');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    process.env[key] = val;
  }
}

// ─── Args ─────────────────────────────────────────────────────────────────────

const [, , adminId, password] = process.argv;

if (!adminId || !password) {
  console.error('\nUsage: node scripts/seed-admin.mjs <adminId> <password>\n');
  console.error('Example: node scripts/seed-admin.mjs admin_bezan MyStr0ngP@ssword\n');
  process.exit(1);
}

if (password.length < 8) {
  console.error('\n⚠  Password must be at least 8 characters.\n');
  process.exit(1);
}

// ─── Hash & save ─────────────────────────────────────────────────────────────

const bcrypt  = require('bcryptjs');
const DATA_DIR = path.join(ROOT, 'data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 9)}`;
}

async function main() {
  console.log(`\nCreating admin account: ${adminId}`);

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = {
    id:           makeId(),
    adminId,
    passwordHash,
    createdAt:    new Date().toISOString(),
  };

  // 1. Try MongoDB
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    try {
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(MONGODB_URI, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db(process.env.MONGODB_DB_NAME ?? 'oms');
      await db.collection('admins').replaceOne({ adminId }, { ...admin }, { upsert: true });
      await client.close();
      console.log('✓ Saved to MongoDB');
    } catch (err) {
      console.warn('⚠  MongoDB save failed (will save to JSON file only):', err.message);
    }
  } else {
    console.log('  ℹ  MONGODB_URI not set — skipping MongoDB, saving to JSON file only.');
  }

  // 2. Always save to JSON file as local backup
  fs.mkdirSync(DATA_DIR, { recursive: true });
  let existing = [];
  try { existing = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf-8')); } catch { /* first admin */ }
  const idx = existing.findIndex((a) => a.adminId === adminId);
  if (idx === -1) existing.push(admin);
  else existing[idx] = admin;
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(existing, null, 2));
  console.log(`✓ Saved to ${ADMINS_FILE}`);

  console.log('\n✅ Admin account ready.');
  console.log(`   Admin ID : ${adminId}`);
  console.log('   Password : [set as provided — not shown for security]\n');
  console.log('Login at: /dashboard/login\n');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
