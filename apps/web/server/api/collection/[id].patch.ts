import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/client";
import { collectionItems } from "../../db/schema";
import { getDevUserId } from "../../utils/devUser";

const conditionEnum = z.enum([
  "new_sealed",
  "new_opened",
  "used_good",
  "used_fair",
  "used_poor",
  "unknown",
]);

const bodySchema = z
  .object({
    item_type: z.enum(["set", "part", "minifig"]).optional(),
    item_id: z.string().min(1).optional(),
    qty: z.number().int().min(0).optional(),
    condition: conditionEnum.optional(),
    location: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    acquired_at: z.string().nullable().optional(),
  })
  .strict();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });
  try {
    const userId = await getDevUserId();
    const body = await readBody(event).catch(() => ({}));
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid body",
        data: parsed.error.flatten(),
      });
    }
    const updates: Record<string, unknown> = {};
    if (parsed.data.item_type !== undefined) updates.itemType = parsed.data.item_type;
    if (parsed.data.item_id !== undefined) updates.itemId = parsed.data.item_id;
    if (parsed.data.qty !== undefined) updates.qty = parsed.data.qty;
    if (parsed.data.condition !== undefined) updates.condition = parsed.data.condition;
    if (parsed.data.location !== undefined) updates.location = parsed.data.location;
    if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
    if (parsed.data.acquired_at !== undefined)
      updates.acquiredAt = parsed.data.acquired_at ?? null;

    if (Object.keys(updates).length === 0) {
      const [row] = await db
        .select()
        .from(collectionItems)
        .where(and(eq(collectionItems.id, id), eq(collectionItems.userId, userId)))
        .limit(1);
      if (!row) throw createError({ statusCode: 404, statusMessage: "Not found" });
      return row;
    }

    const [row] = await db
      .update(collectionItems)
      .set(updates as Record<string, unknown>)
      .where(and(eq(collectionItems.id, id), eq(collectionItems.userId, userId)))
      .returning();
    if (!row) throw createError({ statusCode: 404, statusMessage: "Not found" });
    return row;
  } catch (err) {
    if (err && typeof err === "object" && "statusCode" in err) throw err;
    const message = err instanceof Error ? err.message : "Failed to update item";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
