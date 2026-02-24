import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(rootDir, "../../.env") });

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;