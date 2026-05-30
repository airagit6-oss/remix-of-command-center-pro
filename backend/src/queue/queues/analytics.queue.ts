// ============================================================
// ANALYTICS QUEUE
// Handles analytics aggregation and reporting asynchronously
// ============================================================

import { createQueue } from '../bullmq.config';

export interface AnalyticsAggregateJobData {
  type: 'daily' | 'weekly' | 'monthly';
  date?: Date;
  authorId?: string;
  resellerId?: string;
}

export interface AnalyticsReportJobData {
  reportType: 'revenue' | 'sales' | 'users' | 'performance';
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  recipients?: string[];
}

export const analyticsQueue = createQueue('analytics', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

export async function addAnalyticsAggregateJob(data: AnalyticsAggregateJobData): Promise<void> {
  await analyticsQueue.add('aggregate-analytics', data, {
    priority: 10, // Lower priority for analytics
  });
}

export async function addAnalyticsReportJob(data: AnalyticsReportJobData): Promise<void> {
  await analyticsQueue.add('generate-report', data, {
    priority: 5,
  });
}
