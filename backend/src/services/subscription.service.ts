import { PrismaClient, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class SubscriptionService {
  static async createSubscription(userId: string, tierId: string) {
    try {
      // Check if user already has active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        }
      });

      if (existingSubscription) {
        throw new Error('User already has an active subscription');
      }

      // Create subscription with basic data only (Stripe integration stubbed)
      const dbSubscription = await prisma.subscription.create({
        data: {
          userId,
          tier: tierId as any,
          status: 'ACTIVE'
        }
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE',
          target: `Subscription:${dbSubscription.id}`
        }
      });

      return {
        subscription: dbSubscription,
        clientSecret: null
      };
    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId: string, userId: string) {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { id: subscriptionId, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Cancel in Stripe
      // Stub - providerId field doesn't exist, cannot update in Stripe
      
      // Update database locally - cancel subscription
      const updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: 'CANCELLED' }
      });

      // Audit log with valid fields and actions
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE',
          target: `Subscription:${subscriptionId}`,
          changes: 'Status changed to CANCELLED'
        }
      });

      return updated;
    } catch (error) {
      console.error('Subscription cancellation failed:', error);
      throw error;
    }
  }

  static async updateSubscription(subscriptionId: string, priceId: string, userId: string) {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { id: subscriptionId, userId }
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Stub - providerId field doesn't exist, cannot sync with Stripe
      // Update database locally only
      const status = 'ACTIVE' as const;
      const updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status
        }
      });

      // Audit log with valid AuditAction value
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE',
          target: 'Subscription'
        }
      });

      return updated;
    } catch (error) {
      console.error('Subscription update failed:', error);
      throw error;
    }
  }

  static async getUserSubscriptions(userId: string) {
    return prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async handleWebhook(event: any) {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.syncSubscription(event.data.object);
        break;
      case 'customer.subscription.deleted':
        // Stub - webhookEvent handler
        break;
      case 'invoice.payment_succeeded':
        // Stub
        break;
      case 'invoice.payment_failed':
        // Stub
        break;
    }
  }

  private static async syncSubscription(data: any) {
    // Stub - Stripe integration not supported in current schema
    return;
  }

  private static async handleSubscriptionDeleted(data: any) {
    // Stub
    return;
  }

  private static async handleInvoicePaymentSucceeded(data: any) {
    // Stub
    return;
  }

  private static async handleInvoicePaymentFailed(data: any) {
    // Stub
    return;
  }

  private static mapStripeStatus(status: string): SubscriptionStatus {
    // Map to valid SubscriptionStatus: ACTIVE | CANCELLED | EXPIRED | SUSPENDED
    const statusMap: Record<string, SubscriptionStatus> = {
      'active': 'ACTIVE',
      'past_due': 'SUSPENDED',
      'canceled': 'CANCELLED',
      'unpaid': 'SUSPENDED',
      'incomplete': 'SUSPENDED',
      'incomplete_expired': 'EXPIRED',
      'trialing': 'ACTIVE'
    };
    return statusMap[status] || 'SUSPENDED';
  }
}
