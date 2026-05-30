// ============================================================
// NOTIFICATION QUEUE
// Handles in-app notification operations asynchronously
// ============================================================

import { createQueue } from '../bullmq.config';

export interface NotificationJobData {
  userId: string;
  type: 'ORDER' | 'PAYOUT' | 'COMMISSION' | 'REFERRAL' | 'LEAD' | 'PRODUCT' | 'SYSTEM' | 'ALERT';
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: ('in_app' | 'email' | 'push' | 'sms')[];
  priority?: 'high' | 'normal' | 'low';
}

export const notificationQueue = createQueue<NotificationJobData>('notifications', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
});

export async function addNotificationJob(data: NotificationJobData): Promise<void> {
  const priority = data.priority || 'normal';
  const priorityMap = {
    high: 1,
    normal: 5,
    low: 10,
  };
  
  await notificationQueue.add('send-notification', data, {
    priority: priorityMap[priority],
  });
}

export async function addBulkNotificationJobs(jobs: NotificationJobData[]): Promise<void> {
  const bulkJobs = jobs.map((job) => ({
    name: 'send-notification',
    data: job,
    opts: {
      priority: job.priority === 'high' ? 1 : job.priority === 'low' ? 10 : 5,
    },
  }));
  
  await notificationQueue.addBulk(bulkJobs);
}
