import "dotenv/config";
import { defineConfig } from "prisma/config";

// Vercel builds need to generate Prisma Client but do not connect to a database.
// A real DATABASE_URL must still be supplied for migrations and runtime database access.
const datasourceUrl =
  process.env.DATABASE_URL ??
  "postgresql://build:build@127.0.0.1:5432/build";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: datasourceUrl },
});
