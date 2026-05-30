// ============================================================
// JOB SCHEDULER SERVICE
// Renewal, Cleanup, Report, Backup, Reminder, Sync Jobs
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class JobSchedulerService {
  // Create scheduled job
  static async createScheduledJob(data: {
    name: string;
    type: any;
    description?: string;
    cronExpression?: string;
    intervalMinutes?: number;
    runAt?: Date;
    enabled?: boolean;
    config?: any;
    metadata?: any;
  }) {
    const job = await prisma.scheduledJob.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        cronExpression: data.cronExpression,
        intervalMinutes: data.intervalMinutes,
        runAt: data.runAt,
        enabled: data.enabled ?? true,
        config: data.config,
        metadata: data.metadata
      }
    });

    // Calculate next run time
    if (job.enabled) {
      await this.calculateNextRun(job.id);
    }

    // Log job creation
    await prisma.auditLog.create({
      data: {
        action: 'SCHEDULED_JOB_CREATED',
        entity: 'ScheduledJob',
        entityId: job.id,
        metadata: { name: job.name, type: job.type }
      }
    });

    return job;
  }

  // Calculate next run time based on schedule
  static async calculateNextRun(jobId: string) {
    const job = await prisma.scheduledJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    let nextRunAt: Date | null = null;

    if (job.runAt) {
      // One-time job
      nextRunAt = job.runAt;
    } else if (job.intervalMinutes) {
      // Interval-based job
      const now = new Date();
      nextRunAt = new Date(now.getTime() + job.intervalMinutes * 60 * 1000);
    } else if (job.cronExpression) {
      // Cron-based job (simplified - would use a cron library in production)
      const now = new Date();
      // For now, just set to next day at midnight as a placeholder
      nextRunAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    }

    if (nextRunAt) {
      await prisma.scheduledJob.update({
        where: { id: jobId },
        data: { nextRunAt }
      });
    }

    return nextRunAt;
  }

  // Get due jobs
  static async getDueJobs() {
    const now = new Date();
    
    const jobs = await prisma.scheduledJob.findMany({
      where: {
        enabled: true,
        nextRunAt: { lte: now }
      },
      orderBy: { nextRunAt: 'asc' }
    });

    return jobs;
  }

  // Execute job
  static async executeJob(jobId: string) {
    const job = await prisma.scheduledJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const now = new Date();
    let success = false;
    let error: string | null = null;

    try {
      // Execute based on job type
      switch (job.type) {
        case 'RENEWAL':
          await this.executeRenewalJob(job);
          break;
        case 'CLEANUP':
          await this.executeCleanupJob(job);
          break;
        case 'REPORT':
          await this.executeReportJob(job);
          break;
        case 'BACKUP':
          await this.executeBackupJob(job);
          break;
        case 'REMINDER':
          await this.executeReminderJob(job);
          break;
        case 'SYNC':
          await this.executeSyncJob(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }
      success = true;
    } catch (e: any) {
      error = e.message;
    }

    // Update job execution tracking
    const updateData: any = {
      lastRunAt: now
    };

    if (success) {
      updateData.lastSuccessAt = now;
      updateData.successCount = { increment: 1 };
    } else {
      updateData.lastFailureAt = now;
      updateData.failureCount = { increment: 1 };
    }

    await prisma.scheduledJob.update({
      where: { id: jobId },
      data: updateData
    });

    // Calculate next run time for recurring jobs
    if (success && (job.cronExpression || job.intervalMinutes)) {
      await this.calculateNextRun(jobId);
    } else if (job.runAt) {
      // One-time job - disable after execution
      await prisma.scheduledJob.update({
        where: { id: jobId },
        data: { enabled: false }
      });
    }

    // Log execution
    await prisma.auditLog.create({
      data: {
        action: success ? 'JOB_EXECUTED_SUCCESS' : 'JOB_EXECUTED_FAILED',
        entity: 'ScheduledJob',
        entityId: jobId,
        metadata: { name: job.name, type: job.type, error }
      }
    });

    return { success, error };
  }

  // Job type implementations
  private static async executeRenewalJob(job: any) {
    // Process auto-renewals
    const { RenewalEngineService } = await import('./renewal.engine.service');
    await RenewalEngineService.processAutoRenewals();
  }

  private static async executeCleanupJob(job: any) {
    // Clean up old data
    const daysToKeep = job.config?.daysToKeep || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Clean up old queue jobs
    await prisma.queueJob.deleteMany({
      where: {
        status: 'COMPLETED',
        completedAt: { lt: cutoffDate }
      }
    });

    // Clean up old activity logs
    await prisma.activityLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });
  }

  private static async executeReportJob(job: any) {
    // Generate scheduled reports
    // This would integrate with the report generation system
    console.log('Generating report:', job.name);
  }

  private static async executeBackupJob(job: any) {
    // Perform database backup
    // This would integrate with the backup system
    console.log('Performing backup:', job.name);
  }

  private static async executeReminderJob(job: any) {
    // Send reminders (expiry, renewal, etc.)
    const { RenewalEngineService } = await import('./renewal.engine.service');
    
    // Send expiry reminders for licenses expiring in 7 days
    const expiringLicenses = await prisma.license.findMany({
      where: {
        validUntil: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        status: 'ACTIVE'
      }
    });

    for (const license of expiringLicenses) {
      await RenewalEngineService.sendExpiryReminder(license.id, 7);
    }
  }

  private static async executeSyncJob(job: any) {
    // Sync data with external systems
    console.log('Syncing data:', job.name);
  }

  // Get all scheduled jobs
  static async getAllScheduledJobs() {
    return prisma.scheduledJob.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get scheduled job by ID
  static async getScheduledJob(jobId: string) {
    return prisma.scheduledJob.findUnique({
      where: { id: jobId }
    });
  }

  // Update scheduled job
  static async updateScheduledJob(jobId: string, data: any) {
    const job = await prisma.scheduledJob.update({
      where: { id: jobId },
      data
    });

    // Recalculate next run time if schedule changed
    if (data.cronExpression || data.intervalMinutes || data.runAt) {
      await this.calculateNextRun(jobId);
    }

    // Log update
    await prisma.auditLog.create({
      data: {
        action: 'SCHEDULED_JOB_UPDATED',
        entity: 'ScheduledJob',
        entityId: jobId,
        metadata: { name: job.name, changes: data }
      }
    });

    return job;
  }

  // Delete scheduled job
  static async deleteScheduledJob(jobId: string) {
    const job = await prisma.scheduledJob.delete({
      where: { id: jobId }
    });

    // Log deletion
    await prisma.auditLog.create({
      data: {
        action: 'SCHEDULED_JOB_DELETED',
        entity: 'ScheduledJob',
        entityId: jobId,
        metadata: { name: job.name }
      }
    });

    return job;
  }

  // Enable scheduled job
  static async enableScheduledJob(jobId: string) {
    const job = await this.updateScheduledJob(jobId, { enabled: true });
    await this.calculateNextRun(jobId);
    return job;
  }

  // Disable scheduled job
  static async disableScheduledJob(jobId: string) {
    return this.updateScheduledJob(jobId, { enabled: false });
  }

  // Get job statistics
  static async getJobStatistics() {
    const [
      totalJobs,
      enabledJobs,
      disabledJobs,
      jobsDueNow,
      totalSuccess,
      totalFailures
    ] = await Promise.all([
      prisma.scheduledJob.count(),
      prisma.scheduledJob.count({ where: { enabled: true } }),
      prisma.scheduledJob.count({ where: { enabled: false } }),
      prisma.scheduledJob.count({
        where: {
          enabled: true,
          nextRunAt: { lte: new Date() }
        }
      }),
      prisma.scheduledJob.aggregate({
        _sum: { successCount: true }
      }),
      prisma.scheduledJob.aggregate({
        _sum: { failureCount: true }
      })
    ]);

    return {
      totalJobs,
      enabledJobs,
      disabledJobs,
      jobsDueNow,
      totalSuccess: totalSuccess._sum.successCount || 0,
      totalFailures: totalFailures._sum.failureCount || 0
    };
  }
}
