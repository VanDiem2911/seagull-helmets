import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/seagull_vn';

// Cache the connection on globalThis so dev hot-reloads don't open a new one each time.
const g = globalThis as unknown as { __mongo?: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } };
const cache = (g.__mongo ??= {});

export async function connectDB() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = undefined;
    throw e;
  }
  return cache.conn;
}

/** Convert a lean Mongo document (ObjectId, Date) to plain JSON-safe data. */
export function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}
