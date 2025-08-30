import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connect(uri: string, dbName?: string) {
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName || 'grafometrics');
  return db;
}

export function getDb() {
  if (!db) throw new Error('MongoDB not initialized. Call connect() first.');
  return db;
}

export async function close() {
  if (client) await client.close();
}
