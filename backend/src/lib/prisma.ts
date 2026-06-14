import { PrismaClient } from '@prisma/client';

// ============================================================
// PRISMA CLIENT - WITH FALLBACK SUPPORT
// Attempts direct PostgreSQL connection, falls back to REST API
// ============================================================

let prismaInstance: PrismaClient | null = null;
let connectionFailed = false;

const prismaClientSingleton = () => {
  try {
    const client = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
    return client;
  } catch (error) {
    console.error('❌ Prisma initialization error:', error);
    connectionFailed = true;
    return null as any;
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalThis.prisma = prisma;
}

/**
 * Check if database is connected
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!prisma) return false;
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected via Prisma');
    return true;
  } catch (error) {
    console.warn('⚠️ Prisma connection failed, will use Supabase REST API');
    connectionFailed = true;
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return !connectionFailed && prisma !== null;
}

/**
 * Database connection pool settings (in .env):
 * DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public&pool_size=20&connection_limit=20&statement_cache_size=250"
 * 
 * For High Concurrency:
 * - pool_size=20-50 (adjust based on load)
 * - statement_cache_size=250 (prepared statement cache)
 * - statement_timeout=30000 (30 seconds)
 */

/**
 * Connection pool metrics
 */
export async function getPoolMetrics() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        datname,
        count(*) as active_connections,
        max_conn,
        pg_database_size(datname) as size_bytes
      FROM pg_stat_activity
      JOIN pg_database ON datname = datname
      GROUP BY datname, max_conn
    `;
    return result;
  } catch (error) {
    console.warn('Could not fetch pool metrics:', error);
    return null;
  }
}

/**
 * Graceful disconnect
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}
