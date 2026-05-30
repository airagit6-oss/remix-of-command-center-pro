// ============================================================
// HEALTH CHECK
// Enterprise health check for system monitoring
// ============================================================

import { PrismaClient } from '@prisma/client';
import { getRedisClient, isRedisConnected } from '../cache/redis.client';
import { getMeilisearchClient, checkMeilisearchHealth } from '../search/meilisearch.client';
import { getS3Client, isS3Connected } from '../storage/s3.client';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  checks: {
    database: HealthStatus;
    redis: HealthStatus;
    search: HealthStatus;
    storage: HealthStatus;
    queue: HealthStatus;
  };
  uptime: number;
  version: string;
}

export interface HealthStatus {
  status: 'up' | 'down' | 'degraded';
  latency?: number;
  error?: string;
  details?: any;
}

const prisma = new PrismaClient();
const startTime = Date.now();

export class HealthCheckService {
  static async getHealthCheck(): Promise<HealthCheckResult> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkSearch(),
      this.checkStorage(),
      this.checkQueue(),
    ]);

    const results = {
      database: this.getHealthStatus(checks[0]),
      redis: this.getHealthStatus(checks[1]),
      search: this.getHealthStatus(checks[2]),
      storage: this.getHealthStatus(checks[3]),
      queue: this.getHealthStatus(checks[4]),
    };

    const overallStatus = this.determineOverallStatus(results);

    return {
      status: overallStatus,
      timestamp: new Date(),
      checks: results,
      uptime: Date.now() - startTime,
      version: process.env.APP_VERSION || '1.0.0',
    };
  }

  private static async checkDatabase(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      
      return {
        status: latency < 100 ? 'up' : 'degraded',
        latency,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static async checkRedis(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      if (!isRedisConnected()) {
        return {
          status: 'down',
          error: 'Redis client not connected',
        };
      }

      const redis = getRedisClient();
      await redis.ping();
      const latency = Date.now() - start;
      
      return {
        status: latency < 50 ? 'up' : 'degraded',
        latency,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static async checkSearch(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      const isHealthy = await checkMeilisearchHealth();
      const latency = Date.now() - start;
      
      return {
        status: isHealthy && latency < 100 ? 'up' : 'degraded',
        latency,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static async checkStorage(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      if (!isS3Connected()) {
        return {
          status: 'down',
          error: 'S3 client not connected',
        };
      }

      // TODO: Implement actual S3 health check
      const latency = Date.now() - start;
      
      return {
        status: latency < 200 ? 'up' : 'degraded',
        latency,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static async checkQueue(): Promise<HealthStatus> {
    const start = Date.now();
    try {
      // TODO: Implement actual queue health check
      const latency = Date.now() - start;
      
      return {
        status: latency < 100 ? 'up' : 'degraded',
        latency,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static getHealthStatus(result: PromiseSettledResult<HealthStatus>): HealthStatus {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      status: 'down',
      error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
    };
  }

  private static determineOverallStatus(checks: any): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(checks) as HealthStatus[];
    const downCount = statuses.filter(s => s.status === 'down').length;
    const degradedCount = statuses.filter(s => s.status === 'degraded').length;

    if (downCount > 0) {
      return 'unhealthy';
    }
    if (degradedCount > 0) {
      return 'degraded';
    }
    return 'healthy';
  }

  static async getLiveness(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  static async getReadiness(): Promise<{ status: string; checks: any }> {
    const healthCheck = await this.getHealthCheck();
    const isReady = healthCheck.status !== 'unhealthy';
    
    return {
      status: isReady ? 'ready' : 'not_ready',
      checks: healthCheck.checks,
    };
  }
}
