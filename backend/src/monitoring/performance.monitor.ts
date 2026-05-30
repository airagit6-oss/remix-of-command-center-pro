// ============================================================
// PERFORMANCE MONITOR
// Enterprise performance monitoring and alerting
// ============================================================

import { register, httpRequestDuration, dbQueryDuration, cacheDuration } from './prometheus.metrics';

export interface PerformanceMetrics {
  api: {
    avgResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  };
  database: {
    avgQueryTime: number;
    p95QueryTime: number;
    queriesPerSecond: number;
    connectionPoolUsage: number;
  };
  cache: {
    hitRate: number;
    avgLatency: number;
    operationsPerSecond: number;
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

export class PerformanceMonitor {
  private static apiResponseTimes: number[] = [];
  private static dbQueryTimes: number[] = [];
  private static cacheLatencies: number[] = [];
  private static maxSamples = 1000;

  static recordApiResponse(duration: number): void {
    this.apiResponseTimes.push(duration);
    if (this.apiResponseTimes.length > this.maxSamples) {
      this.apiResponseTimes.shift();
    }
  }

  static recordDbQuery(duration: number): void {
    this.dbQueryTimes.push(duration);
    if (this.dbQueryTimes.length > this.maxSamples) {
      this.dbQueryTimes.shift();
    }
  }

  static recordCacheLatency(duration: number): void {
    this.cacheLatencies.push(duration);
    if (this.cacheLatencies.length > this.maxSamples) {
      this.cacheLatencies.shift();
    }
  }

  static getPercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  static getAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  static async getMetrics(): Promise<PerformanceMetrics> {
    const apiMetrics = httpRequestDuration.get();
    const dbMetrics = dbQueryDuration.get();
    const cacheMetrics = cacheDuration.get();

    return {
      api: {
        avgResponseTime: this.getAverage(this.apiResponseTimes),
        p95ResponseTime: this.getPercentile(this.apiResponseTimes, 95),
        p99ResponseTime: this.getPercentile(this.apiResponseTimes, 99),
        requestsPerSecond: this.calculateRequestsPerSecond(),
        errorRate: this.calculateErrorRate(),
      },
      database: {
        avgQueryTime: this.getAverage(this.dbQueryTimes),
        p95QueryTime: this.getPercentile(this.dbQueryTimes, 95),
        queriesPerSecond: this.calculateQueriesPerSecond(),
        connectionPoolUsage: this.calculateConnectionPoolUsage(),
      },
      cache: {
        hitRate: this.calculateCacheHitRate(),
        avgLatency: this.getAverage(this.cacheLatencies),
        operationsPerSecond: this.calculateCacheOperationsPerSecond(),
      },
      system: {
        cpuUsage: this.getCpuUsage(),
        memoryUsage: this.getMemoryUsage(),
        diskUsage: this.getDiskUsage(),
      },
    };
  }

  private static calculateRequestsPerSecond(): number {
    // TODO: Implement actual RPS calculation
    return 0;
  }

  private static calculateErrorRate(): number {
    // TODO: Implement actual error rate calculation
    return 0;
  }

  private static calculateQueriesPerSecond(): number {
    // TODO: Implement actual QPS calculation
    return 0;
  }

  private static calculateConnectionPoolUsage(): number {
    // TODO: Implement actual connection pool usage calculation
    return 0;
  }

  private static calculateCacheHitRate(): number {
    // TODO: Implement actual cache hit rate calculation
    return 0;
  }

  private static calculateCacheOperationsPerSecond(): number {
    // TODO: Implement actual cache operations per second calculation
    return 0;
  }

  private static getCpuUsage(): number {
    // TODO: Implement actual CPU usage calculation
    return 0;
  }

  private static getMemoryUsage(): number {
    const usage = process.memoryUsage();
    const total = usage.heapTotal;
    const used = usage.heapUsed;
    return (used / total) * 100;
  }

  private static getDiskUsage(): number {
    // TODO: Implement actual disk usage calculation
    return 0;
  }

  static async getPrometheusMetrics(): Promise<string> {
    return await register.metrics();
  }

  static checkPerformanceThresholds(metrics: PerformanceMetrics): {
    warnings: string[];
    critical: string[];
  } {
    const warnings: string[] = [];
    const critical: string[] = [];

    // API thresholds
    if (metrics.api.p95ResponseTime > 1000) {
      critical.push('API P95 response time exceeds 1000ms');
    } else if (metrics.api.p95ResponseTime > 500) {
      warnings.push('API P95 response time exceeds 500ms');
    }

    if (metrics.api.errorRate > 5) {
      critical.push('API error rate exceeds 5%');
    } else if (metrics.api.errorRate > 1) {
      warnings.push('API error rate exceeds 1%');
    }

    // Database thresholds
    if (metrics.db.p95QueryTime > 100) {
      critical.push('Database P95 query time exceeds 100ms');
    } else if (metrics.db.p95QueryTime > 50) {
      warnings.push('Database P95 query time exceeds 50ms');
    }

    if (metrics.db.connectionPoolUsage > 90) {
      critical.push('Database connection pool usage exceeds 90%');
    } else if (metrics.db.connectionPoolUsage > 75) {
      warnings.push('Database connection pool usage exceeds 75%');
    }

    // Cache thresholds
    if (metrics.cache.hitRate < 50) {
      warnings.push('Cache hit rate below 50%');
    }

    // System thresholds
    if (metrics.system.cpuUsage > 90) {
      critical.push('CPU usage exceeds 90%');
    } else if (metrics.system.cpuUsage > 75) {
      warnings.push('CPU usage exceeds 75%');
    }

    if (metrics.system.memoryUsage > 90) {
      critical.push('Memory usage exceeds 90%');
    } else if (metrics.system.memoryUsage > 75) {
      warnings.push('Memory usage exceeds 75%');
    }

    return { warnings, critical };
  }
}
