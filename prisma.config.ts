import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });
loadDotenv();

const rawDatabaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL || process.env.MYSQL_URL;

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: rawDatabaseUrl,
  },
};
