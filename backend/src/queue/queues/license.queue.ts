// ============================================================
// LICENSE QUEUE
// Handles license generation and validation asynchronously
// ============================================================

import { createQueue } from '../bullmq.config';

export interface LicenseGenerateJobData {
  orderId: string;
  productId: string;
  userId: string;
  type: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' | 'LIFETIME' | 'TRIAL';
  metadata?: Record<string, any>;
}

export interface LicenseValidateJobData {
  licenseKey: string;
  deviceId?: string;
  ipAddress?: string;
}

export const licenseQueue = createQueue('licenses', {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export async function addLicenseGenerateJob(data: LicenseGenerateJobData): Promise<void> {
  await licenseQueue.add('generate-license', data, {
    priority: 5,
  });
}

export async function addLicenseValidateJob(data: LicenseValidateJobData): Promise<void> {
  await licenseQueue.add('validate-license', data, {
    priority: 1, // High priority for validation
  });
}
