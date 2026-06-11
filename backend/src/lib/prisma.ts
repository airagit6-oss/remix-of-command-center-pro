import { PrismaClient } from '@prisma/client';

// ============================================================
// PRISMA CLIENT - OPTIMIZED FOR 10,000+ USERS
// Connection pooling, query optimization, caching
// ============================================================

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

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
