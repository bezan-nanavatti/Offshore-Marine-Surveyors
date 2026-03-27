/**
 * MongoDB connection singleton.
 *
 * Returns a connected Db instance, or null if MONGODB_URI is not set or if
 * the connection fails. Callers must fall back to local JSON storage in that
 * case — this ensures the system is always functional regardless of DB status.
 *
 * Uses globalThis to survive Next.js hot-reloads in development (avoids
 * exhausting the MongoClient connection pool by re-creating on every module
 * re-evaluation).
 *
 * ENVIRONMENT VARIABLES:
 *   MONGODB_URI      — MongoDB connection string (Atlas or private instance)
 *   MONGODB_DB_NAME  — Database name (defaults to "oms")
 */

import { MongoClient, type Db } from 'mongodb';

const URI    = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME ?? 'oms';

// Keep singletons across hot-reloads in dev
declare global {
  var _omsMongoClient: MongoClient | undefined;
  var _omsMongoDb: Db | undefined;
}

export async function getDb(): Promise<Db | null> {
  if (!URI) return null; // Not configured — caller uses JSON fallback

  if (global._omsMongoDb) return global._omsMongoDb;

  try {
    if (!global._omsMongoClient) {
      global._omsMongoClient = new MongoClient(URI, {
        connectTimeoutMS:         5_000,
        serverSelectionTimeoutMS: 5_000,
      });
    }

    await global._omsMongoClient.connect();
    global._omsMongoDb = global._omsMongoClient.db(DB_NAME);
    return global._omsMongoDb;
  } catch (err) {
    console.error('[db] MongoDB connection failed — falling back to local storage:', err);
    // Reset so the next request tries again (transient failure recovery)
    global._omsMongoClient = undefined;
    global._omsMongoDb = undefined;
    return null;
  }
}
