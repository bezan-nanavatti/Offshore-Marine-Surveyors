/**
 * Blog read-count persistence layer.
 *
 * Strategy:
 *   • Development / self-hosted: reads and writes `data/read-counts.json`
 *     in the project root (filesystem is writable).
 *   • Vercel serverless: falls back to an in-process Map.
 *     Counts persist for the lifetime of the Lambda container (~minutes),
 *     then reset on the next cold start.
 *
 * To make counts persistent on Vercel, replace the file I/O with
 * Vercel KV (formerly Upstash Redis) — the API is identical but durable:
 *
 *   npm install @vercel/kv
 *   import { kv } from '@vercel/kv';
 *   const count = await kv.incr(`reads:${slug}`);
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR  = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'read-counts.json');

// In-memory fallback (used when the filesystem is read-only, e.g. Vercel)
const memoryStore: Record<string, number> = {};

function readFromFile(): Record<string, number> {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeToFile(data: Record<string, number>): boolean {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
}

export function getReadCount(slug: string): number {
  const fromFile = readFromFile();
  if (Object.keys(fromFile).length > 0 || slug in fromFile) {
    return fromFile[slug] ?? 0;
  }
  return memoryStore[slug] ?? 0;
}

export function incrementReadCount(slug: string): number {
  const data = readFromFile();
  data[slug] = (data[slug] ?? 0) + 1;

  const saved = writeToFile(data);
  if (!saved) {
    // Filesystem not writable — use memory
    memoryStore[slug] = (memoryStore[slug] ?? 0) + 1;
    return memoryStore[slug];
  }
  return data[slug];
}

export function getAllReadCounts(): Record<string, number> {
  const fromFile = readFromFile();
  if (Object.keys(fromFile).length > 0) return fromFile;
  return { ...memoryStore };
}
