/**
 * Submission persistence layer — three-tier resilient fallback:
 *
 *   Tier 1 — MongoDB (primary)
 *     MONGODB_URI set in .env.local → writes and reads use Atlas / private DB.
 *
 *   Tier 2 — Local JSON file (data/submissions.json)
 *     MongoDB unavailable or not configured → reads/writes use the local file.
 *     Works perfectly for local dev and self-hosted Node servers.
 *
 *   Tier 3 — Console log only
 *     Filesystem also not writable (e.g. Vercel read-only FS) → submission is
 *     still captured by the email notification; a warning is logged.
 *
 * PRIMARY KEY:
 *   Each submission has an `id` field (UUID v4) as its canonical cross-system
 *   primary key. MongoDB also assigns its own `_id` (ObjectId) internally —
 *   that field is stripped from all responses (projection: { _id: 0 }).
 */

import fs from 'fs';
import path from 'path';
import { getDb } from './db';

const DATA_DIR   = path.join(process.cwd(), 'data');
const DATA_FILE  = path.join(DATA_DIR, 'submissions.json');
const COLLECTION = 'submissions';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SubmissionStatus = 'open' | 'in_progress' | 'closed';

export interface HistoryEntry {
  adminId:   string;           // who made the change
  status:    SubmissionStatus; // status it was changed TO
  timestamp: string;           // ISO 8601 — when the change was made
}

export interface Submission {
  id:        string;           // UUID v4 — canonical primary key (cross-system)
  timestamp: string;           // ISO 8601 — submitted at
  name:      string;
  company:   string;
  email:     string;
  phone:     string;           // full phone string including dial code
  location:  string;           // enquirer's location / country
  service:   string;
  message:   string;
  ip:        string;
  status:    SubmissionStatus; // open | in_progress | closed
  updatedAt: string;           // ISO 8601 — last status change
  source:    string;           // originating site, e.g. "oms-website"
  history:   HistoryEntry[];   // audit log of admin status changes
}

// ─── ID generation ───────────────────────────────────────────────────────────

function makeId(): string {
  // crypto.randomUUID is available in Node 19+ and modern environments
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Node 14-18 fallback — still collision-resistant for this use case
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── JSON file helpers (Tier 2) ──────────────────────────────────────────────

/** Read existing submissions, normalising old records that predate new fields. */
function readJson(): Submission[] {
  try {
    const raw: Partial<Submission>[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    return raw.map((s): Submission => ({
      id:        s.id        ?? makeId(),
      timestamp: s.timestamp ?? new Date().toISOString(),
      name:      s.name      ?? '',
      company:   s.company   ?? '',
      email:     s.email     ?? '',
      phone:     s.phone     ?? '',
      location:  s.location  ?? '',
      service:   s.service   ?? '',
      message:   s.message   ?? '',
      ip:        s.ip        ?? '',
      status:    (s.status as SubmissionStatus) ?? 'open',
      updatedAt: s.updatedAt ?? s.timestamp ?? new Date().toISOString(),
      source:    s.source    ?? 'oms-website',
      history:   Array.isArray(s.history) ? s.history as HistoryEntry[] : [],
    }));
  } catch {
    return [];
  }
}

function writeJson(submissions: Submission[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
}

// ─── Save ────────────────────────────────────────────────────────────────────

export async function saveSubmission(
  data: Omit<Submission, 'id' | 'timestamp' | 'status' | 'updatedAt' | 'source' | 'history'> & {
    source?: string;
  }
): Promise<Submission> {
  const now = new Date().toISOString();
  const submission: Submission = {
    id:        makeId(),
    timestamp: now,
    updatedAt: now,
    status:    'open',
    source:    data.source ?? 'oms-website',
    name:      data.name,
    company:   data.company,
    email:     data.email,
    phone:     data.phone,
    location:  data.location,
    service:   data.service,
    message:   data.message,
    ip:        data.ip,
    history:   [],
  };

  // Tier 1: MongoDB
  const db = await getDb();
  if (db) {
    try {
      await db.collection(COLLECTION).insertOne({ ...submission });
      return submission;
    } catch (err) {
      console.error('[submissions] MongoDB write failed — falling back to JSON file:', err);
    }
  }

  // Tier 2: local JSON file
  try {
    const existing = readJson();
    existing.push(submission);
    writeJson(existing);
    return submission;
  } catch (err) {
    // Tier 3: log only (filesystem not writable — email is the primary record)
    console.warn('[submissions] All storage tiers failed (email is primary record):', err);
  }

  return submission;
}

// ─── Read all ────────────────────────────────────────────────────────────────

export async function getAllSubmissions(): Promise<Submission[]> {
  // Tier 1: MongoDB
  const db = await getDb();
  if (db) {
    try {
      return db
        .collection<Submission>(COLLECTION)
        .find({}, { projection: { _id: 0 } })
        .sort({ timestamp: -1 })
        .toArray();
    } catch (err) {
      console.error('[submissions] MongoDB read failed — falling back to JSON file:', err);
    }
  }

  // Tier 2: JSON file (reverse so newest-first)
  return readJson().reverse();
}

// ─── Status update ───────────────────────────────────────────────────────────

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  adminId: string = 'unknown'
): Promise<boolean> {
  const updatedAt = new Date().toISOString();
  const entry: HistoryEntry = { adminId, status, timestamp: updatedAt };

  // Tier 1: MongoDB
  const db = await getDb();
  if (db) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await db.collection(COLLECTION).updateOne(
        { id },
        { $set: { status, updatedAt }, $push: { history: entry } } as any,
      );
      return result.matchedCount > 0;
    } catch (err) {
      console.error('[submissions] MongoDB update failed — falling back to JSON file:', err);
    }
  }

  // Tier 2: JSON file
  try {
    const existing = readJson();
    const idx = existing.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    existing[idx] = {
      ...existing[idx],
      status,
      updatedAt,
      history: [...(existing[idx].history ?? []), entry],
    };
    writeJson(existing);
    return true;
  } catch {
    return false;
  }
}
