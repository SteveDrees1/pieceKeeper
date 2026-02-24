import { db } from "../../db/client";
import { sql } from "drizzle-orm";

export default defineEventHandler(async () => {
  try {
    await db.execute(sql`select 1`);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database unavailable";
    throw createError({ statusCode: 503, statusMessage: message });
  }
});
