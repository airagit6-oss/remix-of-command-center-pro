// ============================================================
// HEALTH MONITOR
// Continuous health monitoring for self-healing
// ============================================================

import { HealthCheckService, HealthCheckResult } from '../monitoring/health.check';
import { AuditLogService } from '../audit/audit.service';

export interface HealthThresholds {
  apiResponseTime: number;
  dbQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface HealthAlert {
  type: 'degraded' | 'critical';
  component: string;
  message: string;
  timestamp: Date;
  metrics: any;
}

export class HealthMonitor {
  private static isRunning = false;
  private static interval: NodeJS.Timeout | null = null;
  private static thresholds: HealthThresholds = {
    apiResponseTime: 1000,
    dbQueryTime: 100,
    cacheHitRate: 50,
    errorRate: 1,
    cpuUsage: 75,
    memoryUsage: 75,
  };
  private static alertCallbacks: ((alert: HealthAlert) => void)[] = [];

  static start(intervalMs: number = 30000): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.interval = setInterval(async () => {
      await this.checkHealth();
    }, intervalMs);

    console.log('Health monitor started');
  }

  static stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Health monitor stopped');
  }

  static setThresholds(thresholds: Partial<HealthThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  static onAlert(callback: (alert: HealthAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  private static async checkHealth(): Promise<void> {
    try {
      const healthCheck = await HealthCheckService.getHealthCheck();
      
      // Check each component
      for (const [component, status] of Object.entries(healthCheck.checks)) {
        if (status.status === 'down') {
          this.triggerAlert({
            type: 'critical',
            component,
            message: `${component} is down`,
            timestamp: new Date(),
            metrics: status,
          });
        } else if (status.status === 'degraded') {
          this.triggerAlert({
            type: 'degraded',
            component,
            message: `${component} is degraded`,
            timestamp: new Date(),
            metrics: status,
          });
        }
      }

      // Log health check
      await AuditLogService.logSystemEvent(
        'HEALTH_CHECK',
        'SYSTEM',
        'global',
        {
          status: healthCheck.status,
          uptime: healthCheck.uptime,
          checks: healthCheck.checks,
        }
      );
    } catch (error) {
      console.error('Health check failed:', error);
      this.triggerAlert({
        type: 'critical',
        component: 'health_monitor',
        message: 'Health check failed',
        timestamp: new Date(),
        metrics: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }

  private static triggerAlert(alert: HealthAlert): void {
    for (const callback of this.alertCallbacks) {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback failed:', error);
      }
    }

    // Log alert to audit
    AuditLogService.logSecurityEvent(
      'HEALTH_ALERT',
      alert.component,
      'system',
      {
        type: alert.type,
        message: alert.message,
        metrics: alert.metrics,
      },
      alert.type === 'critical' ? 'CRITICAL' : 'WARNING'
    ).catch(err => {
      console.error('Failed to log health alert:', err);
    });
  }
}
