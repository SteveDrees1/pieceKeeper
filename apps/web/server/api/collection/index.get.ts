import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { collectionItems } from "../../db/schema";
import { getDevUserId } from "../../utils/devUser";

export default defineEventHandler(async () => {
  try {
    const userId = await getDevUserId();
    const rows = await db
      .select()
      .from(collectionItems)
      .where(eq(collectionItems.userId, userId))
      .orderBy(desc(collectionItems.updatedAt));
    return rows;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load collection";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
