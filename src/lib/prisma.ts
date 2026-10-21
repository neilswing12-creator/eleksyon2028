import { PrismaClient } from "@/generated/prisma";
import fs from "fs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseDatasource() {
  const prodDb = "/var/data/eleksyon2028/live.db";
  try {
    if (fs.existsSync(prodDb)) {
      return { db: { url: `file:${prodDb}` } };
    }
  } catch {
    // Fall back to process.env.DATABASE_URL
  }
  return process.env.DATABASE_URL ? { db: { url: process.env.DATABASE_URL } } : undefined;
}

const datasources = getDatabaseDatasource();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
