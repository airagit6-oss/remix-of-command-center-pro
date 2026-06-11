// ============================================================
// QUEUE ENGINE SERVICE (STUB)
// Minimal stub - queueJob model not in Prisma schema
// ============================================================

export class QueueEngineService {
  static async addJob(queue: any, type: string, data: any, options: any = {}) {
    return { id: '', queue, type, data, status: 'PENDING' };
  }

  static async getNextJob(queue: any) {
    return null;
  }

  static async completeJob(jobId: string, result?: any) {
    return { id: jobId, status: 'COMPLETED' };
  }

  static async failJob(jobId: string, error: string, errorMessage?: any) {
    return { id: jobId, status: 'FAILED' };
  }

  static async cancelJob(jobId: string) {
    return { id: jobId, status: 'CANCELLED' };
  }

  static async getQueueStatistics(queue?: any) {
    return { queue: queue || 'ALL', pending: 0, processing: 0, completed: 0, failed: 0, cancelled: 0, retrying: 0, total: 0 };
  }

  static async getJobsByStatus(status: any, queue?: any, limit: number = 50) {
    return [];
  }

  static async getJob(jobId: string) {
    return null;
  }

  static async retryFailedJobs(queue?: any) {
    return { retried: [], count: 0 };
  }

  static async cleanupOldJobs(daysToKeep: number = 7) {
    return { deleted: 0 };
  }

  static async addEmailJob(data: any, options?: any) {
    return { id: '', queue: 'EMAIL', type: 'SEND_EMAIL', data, status: 'PENDING' };
  }

  static async addNotificationJob(data: any, options?: any) {
    return { id: '', queue: 'NOTIFICATION', type: 'SEND_NOTIFICATION', data, status: 'PENDING' };
  }

  static async addLicenseJob(data: any, options?: any) {
    return { id: '', queue: 'LICENSE', type: 'PROCESS_LICENSE', data, status: 'PENDING' };
  }

  static async addWebhookJob(data: any, options?: any) {
    return { id: '', queue: 'WEBHOOK', type: 'SEND_WEBHOOK', data, status: 'PENDING' };
  }

  static async addPayoutJob(data: any, options?: any) {
    return { id: '', queue: 'PAYOUT', type: 'PROCESS_PAYOUT', data, status: 'PENDING' };
  }

  static async addReportJob(data: any, options?: any) {
    return { id: '', queue: 'REPORT', type: 'GENERATE_REPORT', data, status: 'PENDING' };
  }
}
