import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export class SubscriptionService {
  static async createSubscription(userId: string, priceId: string, paymentMethodId: string) {
    try {
      // Check if user already has active subscription
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          user: { userId },
          status: 'ACTIVE'
        }
      });

      if (existingSubscription) {
        throw new Error('User already has an active subscription');
      }

      // Create Stripe customer if not exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      let customerId = user.email; // Using email as customer ID for simplicity
      
      // Create Stripe subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { payment_method_types: ['card'] },
        expand: ['latest_invoice.payment_intent']
      });

      // Save to database
      const dbSubscription = await prisma.subscription.create({
        data: {
          userId,
          provider: 'STRIPE',
          providerId: subscription.id,
          status: this.mapStripeStatus(subscription.status),
          priceId,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_SUBSCRIPTION',
          entity: 'Subscription',
          entityId: dbSubscription.id,
          changes: { priceId, subscriptionId: subscription.id }
        }
      });

      return {
        subscription: dbSubscription,
        clientSecret: (subscription.latest_invoice as any).payment_intent?.client_secret
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
      await stripe.subscriptions.update(subscription.providerId, {
        cancel_at_period_end: true
      });

      // Update database
      const updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { cancelAtPeriodEnd: true }
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CANCEL_SUBSCRIPTION',
          entity: 'Subscription',
          entityId: subscriptionId,
          changes: { cancelAtPeriodEnd: true }
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

      // Update in Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.providerId);
      
      const updatedSubscription = await stripe.subscriptions.update(subscription.providerId, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: priceId
        }]
      });

      // Update database
      const updated = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          priceId,
          status: this.mapStripeStatus(updatedSubscription.status)
        }
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_SUBSCRIPTION',
          entity: 'Subscription',
          entityId: subscriptionId,
          changes: { priceId }
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

  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }
  }

  private static async syncSubscription(stripeSubscription: Stripe.Subscription) {
    const subscription = await prisma.subscription.findFirst({
      where: { providerId: stripeSubscription.id }
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: this.mapStripeStatus(stripeSubscription.status),
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
        }
      });
    }
  }

  private static async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { providerId: stripeSubscription.id },
      data: { status: 'CANCELLED' }
    });
  }

  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      await prisma.subscription.updateMany({
        where: { providerId: invoice.subscription as string },
        data: { status: 'ACTIVE' }
      });
    }
  }

  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      await prisma.subscription.updateMany({
        where: { providerId: invoice.subscription as string },
        data: { status: 'PAST_DUE' }
      });
    }
  }

  private static mapStripeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'active': 'ACTIVE',
      'past_due': 'PAST_DUE',
      'canceled': 'CANCELLED',
      'unpaid': 'UNPAID',
      'incomplete': 'INCOMPLETE',
      'incomplete_expired': 'EXPIRED',
      'trialing': 'TRIALING'
    };
    return statusMap[status] || 'UNKNOWN';
  }
}
