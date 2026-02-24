import { db } from "../db/client";
import { users } from "../db/schema";

export async function getDevUserId(): Promise<string> {
  const email = process.env.DEV_USER_EMAIL;
  if (!email?.trim()) {
    throw new Error("DEV_USER_EMAIL is not set (required for dev auth)");
  }
  const normalized = email.trim().toLowerCase();

  const [row] = await db
    .insert(users)
    .values({ email: normalized, displayName: null })
    .onConflictDoUpdate({ target: users.email, set: { updatedAt: new Date() } })
    .returning({ id: users.id });
  if (!row) throw new Error("Failed to upsert dev user");
  return row.id;
}
