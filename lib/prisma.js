import dns from 'node:dns';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// 1. Force IPv4 so the mariadb driver doesn't hang on Filess.io DNS lookups
dns.setDefaultResultOrder('ipv4first');

const globalForPrisma = globalThis;

function createPrismaClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT), // Required: Filess.io uses a custom port
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 1,
    idleTimeout: 5, // Close idle connections after 5 seconds (in seconds, not ms)
    acquireTimeout: 10000,
    connectTimeout: 10000,
    // Uncomment the line below if Filess.io enforces SSL on your specific instance:
    // ssl: { rejectUnauthorized: false },
  });

  return new PrismaClient({ adapter });
}

// 2. Cache globally in ALL environments (including production on Vercel)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
