import { z } from "zod";
import { db } from "../../db/client";
import { collectionItems } from "../../db/schema";
import { getDevUserId } from "../../utils/devUser";

const itemTypeEnum = z.enum(["set", "part", "minifig"]);
const conditionEnum = z.enum([
  "new_sealed",
  "new_opened",
  "used_good",
  "used_fair",
  "used_poor",
  "unknown",
]);

const bodySchema = z.object({
  item_type: itemTypeEnum,
  item_id: z.string().min(1),
  qty: z.number().int().min(0).default(1),
  condition: conditionEnum.default("unknown"),
  location: z.string().optional(),
  notes: z.string().optional(),
  acquired_at: z.string().optional(), // ISO date string
});

export default defineEventHandler(async (event) => {
  try {
    const userId = await getDevUserId();
    const body = await readBody(event);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid body",
        data: parsed.error.flatten(),
      });
    }
    const { item_type, item_id, qty, condition, location, notes, acquired_at } = parsed.data;
    const [row] = await db
      .insert(collectionItems)
      .values({
        userId,
        itemType: item_type,
        itemId: item_id,
        qty,
        condition,
        location: location ?? null,
        notes: notes ?? null,
        acquiredAt: acquired_at ?? null,
      })
      .returning();
    if (!row) throw createError({ statusCode: 500, statusMessage: "Insert failed" });
    return row;
  } catch (err) {
    if (err && typeof err === "object" && "statusCode" in err) throw err;
    const message = err instanceof Error ? err.message : "Failed to add item";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
