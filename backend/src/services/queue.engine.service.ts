// ============================================================
// QUEUE ENGINE SERVICE
// Email, Notification, License, Webhook, Payout, Report Queues
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class QueueEngineService {
  // Add job to queue
  static async addJob(queue: any, type: string, data: any, options: {
    priority?: number;
    maxAttempts?: number;
    scheduledAt?: Date;
    metadata?: any;
  } = {}) {
    const job = await prisma.queueJob.create({
      data: {
        queue,
        type,
        data,
        priority: options.priority || 0,
        maxAttempts: options.maxAttempts || 3,
        scheduledAt: options.scheduledAt,
        metadata: options.metadata
      }
    });

    // Log job creation
    await prisma.auditLog.create({
      data: {
        action: 'JOB_QUEUED',
        entity: 'QueueJob',
        entityId: job.id,
        metadata: { queue, type, jobId: job.id }
      }
    });

    return job;
  }

  // Get next job from queue
  static async getNextJob(queue: any) {
    const now = new Date();
    
    const job = await prisma.queueJob.findFirst({
      where: {
        queue,
        status: 'PENDING',
        OR: [
          { scheduledAt: null },
          { scheduledAt: { lte: now } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    if (job) {
      // Mark as processing
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: 'PROCESSING',
          startedAt: now
        }
      });
    }

    return job;
  }

  // Complete job
  static async completeJob(jobId: string, result?: any) {
    const job = await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        metadata: result
      }
    });

    // Log job completion
    await prisma.auditLog.create({
      data: {
        action: 'JOB_COMPLETED',
        entity: 'QueueJob',
        entityId: jobId,
        metadata: { queue: job.queue, type: job.type }
      }
    });

    return job;
  }

  // Fail job
  static async failJob(jobId: string, error: string, errorMessage?: any) {
    const job = await prisma.queueJob.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const shouldRetry = job.attempts < job.maxAttempts - 1;

    const updateData: any = {
      attempts: { increment: 1 },
      error,
      errorMessage
    };

    if (shouldRetry) {
      updateData.status = 'RETRYING';
    } else {
      updateData.status = 'FAILED';
      updateData.failedAt = new Date();
    }

    const updatedJob = await prisma.queueJob.update({
      where: { id: jobId },
      data: updateData
    });

    // Log job failure
    await prisma.auditLog.create({
      data: {
        action: 'JOB_FAILED',
        entity: 'QueueJob',
        entityId: jobId,
        metadata: { queue: job.queue, type: job.type, error, willRetry: shouldRetry }
      }
    });

    return updatedJob;
  }

  // Cancel job
  static async cancelJob(jobId: string) {
    const job = await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: 'CANCELLED'
      }
    });

    // Log job cancellation
    await prisma.auditLog.create({
      data: {
        action: 'JOB_CANCELLED',
        entity: 'QueueJob',
        entityId: jobId,
        metadata: { queue: job.queue, type: job.type }
      }
    });

    return job;
  }

  // Get queue statistics
  static async getQueueStatistics(queue?: any) {
    const where = queue ? { queue } : {};

    const [
      pending,
      processing,
      completed,
      failed,
      cancelled,
      retrying
    ] = await Promise.all([
      prisma.queueJob.count({ where: { ...where, status: 'PENDING' } }),
      prisma.queueJob.count({ where: { ...where, status: 'PROCESSING' } }),
      prisma.queueJob.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.queueJob.count({ where: { ...where, status: 'FAILED' } }),
      prisma.queueJob.count({ where: { ...where, status: 'CANCELLED' } }),
      prisma.queueJob.count({ where: { ...where, status: 'RETRYING' } })
    ]);

    return {
      queue: queue || 'ALL',
      pending,
      processing,
      completed,
      failed,
      cancelled,
      retrying,
      total: pending + processing + completed + failed + cancelled + retrying
    };
  }

  // Get jobs by status
  static async getJobsByStatus(status: any, queue?: any, limit: number = 50) {
    const where: any = { status };
    if (queue) {
      where.queue = queue;
    }

    return prisma.queueJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // Get job by ID
  static async getJob(jobId: string) {
    return prisma.queueJob.findUnique({
      where: { id: jobId }
    });
  }

  // Retry failed jobs
  static async retryFailedJobs(queue?: any) {
    const where: any = { status: 'FAILED' };
    if (queue) {
      where.queue = queue;
    }

    const jobs = await prisma.queueJob.findMany({
      where,
      take: 100
    });

    const retried = [];
    for (const job of jobs) {
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: 'PENDING',
          attempts: 0,
          error: null,
          errorMessage: null,
          failedAt: null
        }
      });
      retried.push(job.id);
    }

    return { retried, count: retried.length };
  }

  // Clean up old completed jobs
  static async cleanupOldJobs(daysToKeep: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deleted = await prisma.queueJob.deleteMany({
      where: {
        status: 'COMPLETED',
        completedAt: { lt: cutoffDate }
      }
    });

    return { deleted: deleted.count };
  }

  // Email queue helpers
  static async addEmailJob(data: any, options?: any) {
    return this.addJob('EMAIL', 'SEND_EMAIL', data, options);
  }

  // Notification queue helpers
  static async addNotificationJob(data: any, options?: any) {
    return this.addJob('NOTIFICATION', 'SEND_NOTIFICATION', data, options);
  }

  // License queue helpers
  static async addLicenseJob(data: any, options?: any) {
    return this.addJob('LICENSE', 'PROCESS_LICENSE', data, options);
  }

  // Webhook queue helpers
  static async addWebhookJob(data: any, options?: any) {
    return this.addJob('WEBHOOK', 'SEND_WEBHOOK', data, options);
  }

  // Payout queue helpers
  static async addPayoutJob(data: any, options?: any) {
    return this.addJob('PAYOUT', 'PROCESS_PAYOUT', data, options);
  }

  // Report queue helpers
  static async addReportJob(data: any, options?: any) {
    return this.addJob('REPORT', 'GENERATE_REPORT', data, options);
  }
}
