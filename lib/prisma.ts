// @ts-nocheck
// Prisma singleton - compatible with Prisma 7.8.0

const globalForPrisma = globalThis as unknown as {
  prisma?: any;
};

if (!globalForPrisma.prisma) {
  const { getPrismaClientClass } = require("./prisma-generated/internal/class");
  const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
  const rawDatabaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL || process.env.MYSQL_URL;
  const databaseUrl = rawDatabaseUrl?.startsWith("mysql://")
    ? rawDatabaseUrl.replace("mysql://", "mariadb://")
    : rawDatabaseUrl;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize PrismaClient");
  }

  const PrismaClient = getPrismaClientClass();
  const adapter = new PrismaMariaDb(databaseUrl);
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;