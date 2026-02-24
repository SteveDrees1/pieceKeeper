import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const itemTypeEnum = pgEnum("item_type", ["set", "part", "minifig"]);
export const itemConditionEnum = pgEnum("item_condition", [
  "new_sealed",
  "new_opened",
  "used_good",
  "used_fair",
  "used_poor",
  "unknown",
]);
export const listKindEnum = pgEnum("list_kind", ["wanted", "trade", "build"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const collectionItems = pgTable("collection_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  itemType: itemTypeEnum("item_type").notNull(),
  itemId: text("item_id").notNull(),
  qty: integer("qty").notNull().default(1),
  condition: itemConditionEnum("condition").notNull().default("unknown"),
  location: text("location"),
  notes: text("notes"),
  acquiredAt: date("acquired_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lists = pgTable(
  "lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    kind: listKindEnum("kind").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.name)]
);

export const listItems = pgTable(
  "list_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    itemType: itemTypeEnum("item_type").notNull(),
    itemId: text("item_id").notNull(),
    targetQty: integer("target_qty").notNull().default(1),
    maxPrice: numeric("max_price", { precision: 12, scale: 2 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.listId, t.itemType, t.itemId)]
);
