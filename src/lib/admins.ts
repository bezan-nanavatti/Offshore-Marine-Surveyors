/**
 * Admin account storage layer — same two-tier fallback as submissions:
 *
 *   Tier 1 — MongoDB "admins" collection
 *   Tier 2 — data/admins.json (gitignored, local/self-hosted fallback)
 *
 * PASSWORDS:
 *   Passwords are NEVER stored in plaintext. bcrypt (cost 12) is used.
 *   The seed-admin script handles hashing before saving.
 *
 * SECURITY:
 *   data/admins.json is gitignored. Never commit admin credentials.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getDb } from './db';

const DATA_DIR   = path.join(process.cwd(), 'data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const COLLECTION  = 'admins';

export interface Admin {
  id:           string; // UUID v4
  adminId:      string; // login username (e.g. "admin_bezan")
  passwordHash: string; // bcrypt hash
  createdAt:    string; // ISO 8601
}

// ─── JSON helpers ─────────────────────────────────────────────────────────────

function readAdminsJson(): Admin[] {
  try {
    return JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeAdminsJson(admins: Admin[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2));
}

// ─── ID generation ────────────────────────────────────────────────────────────

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

export async function findAdmin(adminId: string): Promise<Admin | null> {
  // Tier 1: MongoDB
  const db = await getDb();
  if (db) {
    try {
      const doc = await db
        .collection<Admin>(COLLECTION)
        .findOne({ adminId }, { projection: { _id: 0 } });
      return doc ?? null;
    } catch (err) {
      console.error('[admins] MongoDB read failed — falling back to JSON file:', err);
    }
  }

  // Tier 2: JSON file
  const admins = readAdminsJson();
  return admins.find((a) => a.adminId === adminId) ?? null;
}

// ─── Create (used by seed script) ─────────────────────────────────────────────

export async function createAdmin(adminId: string, password: string): Promise<Admin> {
  const passwordHash = await bcrypt.hash(password, 12);
  const admin: Admin = {
    id:           makeId(),
    adminId,
    passwordHash,
    createdAt:    new Date().toISOString(),
  };

  // Tier 1: MongoDB
  const db = await getDb();
  if (db) {
    try {
      await db.collection(COLLECTION).replaceOne(
        { adminId },
        { ...admin },
        { upsert: true }
      );
    } catch (err) {
      console.error('[admins] MongoDB write failed — saving to JSON file only:', err);
    }
  }

  // Always save to JSON file as a local backup record
  const existing = readAdminsJson();
  const idx = existing.findIndex((a) => a.adminId === adminId);
  if (idx === -1) existing.push(admin);
  else existing[idx] = admin;
  writeAdminsJson(existing);

  return admin;
}

// ─── Password verification ────────────────────────────────────────────────────

export async function verifyPassword(
  admin: Admin,
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, admin.passwordHash);
}
