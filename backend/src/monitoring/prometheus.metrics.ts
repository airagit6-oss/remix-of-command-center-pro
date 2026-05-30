// ============================================================
// PROMETHEUS METRICS
// Enterprise-grade metrics collection for monitoring
// ============================================================

import { Registry, Counter, Histogram, Gauge, Summary } from 'prom-client';

const register = new Registry();

// HTTP Request Metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestInProgress = new Gauge({
  name: 'http_requests_in_progress',
  help: 'Number of HTTP requests currently in progress',
  labelNames: ['method', 'route'],
});

// Database Metrics
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

export const dbQueryTotal = new Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'table', 'status'],
});

export const dbConnectionsActive = new Gauge({
  name: 'db_connections_active',
  help: 'Number of active database connections',
});

export const dbConnectionsIdle = new Gauge({
  name: 'db_connections_idle',
  help: 'Number of idle database connections',
});

// Cache Metrics
export const cacheHitRate = new Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage',
  labelNames: ['cache_type'],
});

export const cacheOperationsTotal = new Counter({
  name: 'cache_operations_total',
  help: 'Total number of cache operations',
  labelNames: ['operation', 'cache_type', 'status'],
});

export const cacheDuration = new Histogram({
  name: 'cache_duration_seconds',
  help: 'Duration of cache operations in seconds',
  labelNames: ['operation', 'cache_type'],
  buckets: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.025, 0.05, 0.1],
});

// Queue Metrics
export const queueJobsTotal = new Counter({
  name: 'queue_jobs_total',
  help: 'Total number of queue jobs processed',
  labelNames: ['queue', 'status'],
});

export const queueJobsDuration = new Histogram({
  name: 'queue_jobs_duration_seconds',
  help: 'Duration of queue job processing in seconds',
  labelNames: ['queue', 'job_type'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10, 30, 60, 120, 300],
});

export const queueJobsWaiting = new Gauge({
  name: 'queue_jobs_waiting',
  help: 'Number of jobs waiting in queue',
  labelNames: ['queue'],
});

export const queueJobsActive = new Gauge({
  name: 'queue_jobs_active',
  help: 'Number of jobs currently being processed',
  labelNames: ['queue'],
});

// Business Metrics
export const ordersTotal = new Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status', 'payment_method'],
});

export const revenueTotal = new Counter({
  name: 'revenue_total',
  help: 'Total revenue',
  labelNames: ['currency'],
});

export const usersTotal = new Gauge({
  name: 'users_total',
  help: 'Total number of users',
  labelNames: ['role'],
});

export const productsTotal = new Gauge({
  name: 'products_total',
  help: 'Total number of products',
  labelNames: ['status'],
});

// Error Metrics
export const errorsTotal = new Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'severity'],
});

export const errorRate = new Gauge({
  name: 'error_rate',
  help: 'Error rate percentage',
  labelNames: ['type'],
});

// System Metrics
export const memoryUsage = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type'],
});

export const cpuUsage = new Gauge({
  name: 'cpu_usage_percent',
  help: 'CPU usage percentage',
});

export const diskUsage = new Gauge({
  name: 'disk_usage_percent',
  help: 'Disk usage percentage',
  labelNames: ['mount_point'],
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestInProgress);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbQueryTotal);
register.registerMetric(dbConnectionsActive);
register.registerMetric(dbConnectionsIdle);
register.registerMetric(cacheHitRate);
register.registerMetric(cacheOperationsTotal);
register.registerMetric(cacheDuration);
register.registerMetric(queueJobsTotal);
register.registerMetric(queueJobsDuration);
register.registerMetric(queueJobsWaiting);
register.registerMetric(queueJobsActive);
register.registerMetric(ordersTotal);
register.registerMetric(revenueTotal);
register.registerMetric(usersTotal);
register.registerMetric(productsTotal);
register.registerMetric(errorsTotal);
register.registerMetric(errorRate);
register.registerMetric(memoryUsage);
register.registerMetric(cpuUsage);
register.registerMetric(diskUsage);

export { register };
