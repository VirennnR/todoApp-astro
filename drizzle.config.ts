import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  // @ts-ignore
  dialect: "sqlite",
  driver: "better-sqlite",
  dbCredentials: {
    url: "todo.db",
  },
} satisfies Config;
