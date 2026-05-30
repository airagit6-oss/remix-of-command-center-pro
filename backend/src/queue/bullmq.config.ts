// ============================================================
// BULLMQ CONFIGURATION
// Enterprise-grade queue system configuration
// ============================================================

import { Queue, Worker, QueueScheduler } from 'bullmq';
import { getRedisClient } from '../cache/redis.client';

const connection = getRedisClient();

export interface QueueConfig {
  connection: typeof connection;
  defaultJobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete?: number;
    removeOnFail?: number;
  };
}

export const defaultQueueConfig: QueueConfig = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 1000,
    removeOnFail: 500,
  },
};

export function createQueue<T = any>(name: string, config?: QueueConfig): Queue<T> {
  return new Queue<T>(name, {
    ...defaultQueueConfig,
    ...config,
  });
}

export function createWorker<T = any>(
  name: string,
  processor: (job: any) => Promise<any>,
  config?: QueueConfig
): Worker<T> {
  return new Worker<T>(name, processor, {
    ...defaultQueueConfig,
    ...config,
  });
}

export function createScheduler(name: string): QueueScheduler {
  return new QueueScheduler(name, { connection });
}
