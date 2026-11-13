import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Driver adapter obligatoire depuis Prisma 7 (plus de moteur Rust intégré).
// DATABASE_URL (poolée via PgBouncer côté Neon) — la connexion directe
// (DIRECT_URL) reste réservée aux opérations CLI, cf. prisma.config.ts.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
