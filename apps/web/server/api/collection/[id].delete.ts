import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { collectionItems } from "../../db/schema";
import { getDevUserId } from "../../utils/devUser";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });
  try {
    const userId = await getDevUserId();
    const [row] = await db
      .delete(collectionItems)
      .where(and(eq(collectionItems.id, id), eq(collectionItems.userId, userId)))
      .returning({ id: collectionItems.id });
    if (!row) throw createError({ statusCode: 404, statusMessage: "Not found" });
    return { deleted: true, id: row.id };
  } catch (err) {
    if (err && typeof err === "object" && "statusCode" in err) throw err;
    const message = err instanceof Error ? err.message : "Failed to delete item";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
