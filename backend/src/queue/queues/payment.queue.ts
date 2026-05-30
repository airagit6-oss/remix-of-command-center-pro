// ============================================================
// PAYMENT QUEUE
// Handles payment processing and webhook operations asynchronously
// ============================================================

import { createQueue } from '../bullmq.config';

export interface PaymentWebhookJobData {
  provider: 'STRIPE' | 'PAYPAL' | 'CRYPTO' | 'BANK_TRANSFER';
  eventType: string;
  payload: Record<string, any>;
  signature?: string;
}

export interface PaymentProcessJobData {
  orderId: string;
  amount: number;
  currency: string;
  provider: 'STRIPE' | 'PAYPAL' | 'CRYPTO' | 'BANK_TRANSFER';
  metadata?: Record<string, any>;
}

export const paymentQueue = createQueue('payments', {
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

export async function addPaymentWebhookJob(data: PaymentWebhookJobData): Promise<void> {
  await paymentQueue.add('process-webhook', data, {
    priority: 1, // High priority for webhooks
  });
}

export async function addPaymentProcessJob(data: PaymentProcessJobData): Promise<void> {
  await paymentQueue.add('process-payment', data, {
    priority: 5,
  });
}
