// Starts a throw-away local MongoDB on 127.0.0.1:27017 (data kept in .mongo-data) for machines without Docker/Atlas.
// Usage: npm run db:dev   (leave it running in its own terminal, then `npm run seed` and `npm run dev`)
import fs from 'node:fs';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';

const dbPath = path.resolve(import.meta.dirname, '..', '.mongo-data');
fs.mkdirSync(dbPath, { recursive: true });

const server = await MongoMemoryServer.create({
  instance: { port: 27017, ip: '127.0.0.1', dbPath, storageEngine: 'wiredTiger' },
});
console.log(`MongoDB ready at ${server.getUri()}seagull_vn  (Ctrl+C to stop)`);

const stop = async () => {
  await server.stop({ doCleanup: false });
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
