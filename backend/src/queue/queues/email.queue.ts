// ============================================================
// EMAIL QUEUE
// Handles email sending operations asynchronously
// ============================================================

import { createQueue } from '../bullmq.config';

export interface EmailJobData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
  priority?: 'high' | 'normal' | 'low';
}

export const emailQueue = createQueue<EmailJobData>('emails', {
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

export async function addEmailJob(data: EmailJobData): Promise<void> {
  const priority = data.priority || 'normal';
  const priorityMap = {
    high: 1,
    normal: 5,
    low: 10,
  };
  
  await emailQueue.add('send-email', data, {
    priority: priorityMap[priority],
  });
}

export async function addBulkEmailJobs(jobs: EmailJobData[]): Promise<void> {
  const bulkJobs = jobs.map((job, index) => ({
    name: 'send-email',
    data: job,
    opts: {
      priority: job.priority === 'high' ? 1 : job.priority === 'low' ? 10 : 5,
    },
  }));
  
  await emailQueue.addBulk(bulkJobs);
}
