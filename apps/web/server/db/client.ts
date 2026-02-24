import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

let _db: PostgresJsDatabase | null = null;

function getDb(): PostgresJsDatabase {
  if (_db) return _db;
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");
  // postgres.js does not support the "schema" query param; strip it to avoid "unrecognized configuration parameter"
  try {
    const u = new URL(url);
    u.searchParams.delete("schema");
    url = u.toString();
  } catch {
    // if URL parsing fails, use url as-is
  }
  const queryClient = postgres(url, { max: 10, idle_timeout: 20 });
  _db = drizzle(queryClient);
  return _db;
}

export const db = new Proxy({} as PostgresJsDatabase, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  }
});
