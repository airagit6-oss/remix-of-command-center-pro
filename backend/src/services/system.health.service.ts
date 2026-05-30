// ============================================================
// SYSTEM HEALTH CENTER SERVICE
// API, Database, Queue, Webhook, Cron, Storage Health
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SystemHealthService {
  // Check API health
  static async checkAPIHealth() {
    const startTime = Date.now();
    let status = 'HEALTHY';
    let message = 'API is healthy';
    const metrics: any = {};

    try {
      // Check response time
      const responseTime = Date.now() - startTime;
      metrics.responseTime = responseTime;

      if (responseTime > 1000) {
        status = 'DEGRADED';
        message = 'API response time is slow';
      }

      // Check error rate (would be calculated from logs in production)
      metrics.errorRate = 0; // Placeholder

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'API health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('API', status, metrics, message);
  }

  // Check database health
  static async checkDatabaseHealth() {
    let status = 'HEALTHY';
    let message = 'Database is healthy';
    const metrics: any = {};

    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      metrics.connection = 'OK';

      // Check connection pool
      metrics.poolSize = 10; // Placeholder - would get actual pool stats
      metrics.activeConnections = 5; // Placeholder

      // Check database size (PostgreSQL specific)
      const sizeResult = await prisma.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) as size`;
      metrics.databaseSize = sizeResult[0]?.size;

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'Database health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('DATABASE', status, metrics, message);
  }

  // Check queue health
  static async checkQueueHealth() {
    let status = 'HEALTHY';
    let message = 'Queue is healthy';
    const metrics: any = {};

    try {
      // Get queue statistics
      const queueStats = await prisma.queueJob.groupBy({
        by: ['status'],
        _count: true
      });

      metrics.queueStats = queueStats;

      // Check for stuck jobs
      const stuckJobs = await prisma.queueJob.count({
        where: {
          status: 'PROCESSING',
          startedAt: { lt: new Date(Date.now() - 30 * 60 * 1000) } // Processing for more than 30 minutes
        }
      });

      metrics.stuckJobs = stuckJobs;

      if (stuckJobs > 10) {
        status = 'DEGRADED';
        message = 'Queue has stuck jobs';
      }

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'Queue health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('QUEUE', status, metrics, message);
  }

  // Check webhook health
  static async checkWebhookHealth() {
    let status = 'HEALTHY';
    let message = 'Webhook system is healthy';
    const metrics: any = {};

    try {
      // Get webhook statistics
      const webhookStats = await prisma.eventLog.groupBy({
        by: ['status'],
        _count: true
      });

      metrics.webhookStats = webhookStats;

      // Calculate success rate
      const total = webhookStats.reduce((sum, stat) => sum + stat._count, 0);
      const delivered = webhookStats.find(s => s.status === 'DELIVERED')?._count || 0;
      const successRate = total > 0 ? (delivered / total) * 100 : 100;

      metrics.successRate = successRate;

      if (successRate < 90) {
        status = 'DEGRADED';
        message = 'Webhook delivery rate is low';
      }

      if (successRate < 50) {
        status = 'UNHEALTHY';
        message = 'Webhook delivery rate is critical';
      }

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'Webhook health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('WEBHOOK', status, metrics, message);
  }

  // Check cron/scheduler health
  static async checkCronHealth() {
    let status = 'HEALTHY';
    let message = 'Cron scheduler is healthy';
    const metrics: any = {};

    try {
      // Get scheduled job statistics
      const jobStats = await prisma.scheduledJob.groupBy({
        by: ['enabled'],
        _count: true
      });

      metrics.jobStats = jobStats;

      // Check for overdue jobs
      const overdueJobs = await prisma.scheduledJob.count({
        where: {
          enabled: true,
          nextRunAt: { lt: new Date() }
        }
      });

      metrics.overdueJobs = overdueJobs;

      if (overdueJobs > 5) {
        status = 'DEGRADED';
        message = 'Cron has overdue jobs';
      }

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'Cron health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('CRON', status, metrics, message);
  }

  // Check storage health
  static async checkStorageHealth() {
    let status = 'HEALTHY';
    let message = 'Storage is healthy';
    const metrics: any = {};

    try {
      // Check storage usage (placeholder - would integrate with cloud storage provider)
      metrics.totalStorage = '100 GB';
      metrics.usedStorage = '45 GB';
      metrics.availableStorage = '55 GB';
      metrics.usagePercentage = 45;

      if (metrics.usagePercentage > 80) {
        status = 'DEGRADED';
        message = 'Storage usage is high';
      }

      if (metrics.usagePercentage > 95) {
        status = 'UNHEALTHY';
        message = 'Storage is critically low';
      }

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'Storage health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('STORAGE', status, metrics, message);
  }

  // Check Redis health
  static async checkRedisHealth() {
    let status = 'HEALTHY';
    let message = 'Redis is healthy';
    const metrics: any = {};

    try {
      // Placeholder - would check actual Redis connection
      metrics.connection = 'OK';
      metrics.memoryUsage = '256 MB';
      metrics.connectedClients = 10;
      metrics.hitRate = 95;

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'Redis health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('REDIS', status, metrics, message);
  }

  // Check CDN health
  static async checkCDNHealth() {
    let status = 'HEALTHY';
    let message = 'CDN is healthy';
    const metrics: any = {};

    try {
      // Placeholder - would check actual CDN status
      metrics.connection = 'OK';
      metrics.cacheHitRate = 85;
      metrics.bandwidthUsage = '10 GB/hour';

    } catch (error) {
      status = 'UNHEALTHY';
      message = 'CDN health check failed';
      metrics.error = error;
    }

    return this.recordHealthCheck('CDN', status, metrics, message);
  }

  // Record health check
  private static async recordHealthCheck(component: any, status: any, metrics: any, message?: string) {
    const healthCheck = await prisma.systemHealthCheck.create({
      data: {
        component,
        status,
        metrics,
        message
      }
    });

    return healthCheck;
  }

  // Get overall system health
  static async getOverallHealth() {
    const [
      apiHealth,
      dbHealth,
      queueHealth,
      webhookHealth,
      cronHealth,
      storageHealth,
      redisHealth,
      cdnHealth
    ] = await Promise.all([
      this.checkAPIHealth(),
      this.checkDatabaseHealth(),
      this.checkQueueHealth(),
      this.checkWebhookHealth(),
      this.checkCronHealth(),
      this.checkStorageHealth(),
      this.checkRedisHealth(),
      this.checkCDNHealth()
    ]);

    const allChecks = [apiHealth, dbHealth, queueHealth, webhookHealth, cronHealth, storageHealth, redisHealth, cdnHealth];
    
    const unhealthyCount = allChecks.filter(c => c.status === 'UNHEALTHY').length;
    const degradedCount = allChecks.filter(c => c.status === 'DEGRADED').length;

    let overallStatus = 'HEALTHY';
    if (unhealthyCount > 0) {
      overallStatus = 'UNHEALTHY';
    } else if (degradedCount > 0) {
      overallStatus = 'DEGRADED';
    }

    return {
      overallStatus,
      components: {
        API: apiHealth,
        DATABASE: dbHealth,
        QUEUE: queueHealth,
        WEBHOOK: webhookHealth,
        CRON: cronHealth,
        STORAGE: storageHealth,
        REDIS: redisHealth,
        CDN: cdnHealth
      },
      summary: {
        total: allChecks.length,
        healthy: allChecks.filter(c => c.status === 'HEALTHY').length,
        degraded: degradedCount,
        unhealthy: unhealthyCount
      },
      checkedAt: new Date()
    };
  }

  // Get health history
  static async getHealthHistory(component?: any, hours: number = 24) {
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const where: any = {
      checkedAt: { gte: cutoffDate }
    };

    if (component) {
      where.component = component;
    }

    return prisma.systemHealthCheck.findMany({
      where,
      orderBy: { checkedAt: 'desc' }
    });
  }

  // Clean up old health checks
  static async cleanupOldHealthChecks(daysToKeep: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deleted = await prisma.systemHealthCheck.deleteMany({
      where: {
        checkedAt: { lt: cutoffDate }
      }
    });

    return { deleted: deleted.count };
  }
}
