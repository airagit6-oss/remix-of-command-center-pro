import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export class PaymentService {
  static async createPaymentIntent(orderId: string, amount: number, currency: string = 'usd') {
    try {
      // Verify order exists and belongs to user
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Check for existing payment intent
      const existingPayment = await prisma.paymentIntent.findFirst({
        where: { orderId, status: { in: ['PENDING', 'PROCESSING'] } }
      });

      if (existingPayment) {
        return existingPayment;
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          orderId,
          userId: order.userId
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      // Save to database
      const dbPaymentIntent = await prisma.paymentIntent.create({
        data: {
          orderId,
          amount: new Decimal(amount),
          currency: currency.toUpperCase(),
          provider: 'STRIPE',
          providerId: paymentIntent.id,
          status: 'PENDING',
          metadata: { clientSecret: paymentIntent.client_secret }
        }
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: order.userId,
          action: 'CREATE_PAYMENT_INTENT',
          entity: 'PaymentIntent',
          entityId: dbPaymentIntent.id,
          changes: { orderId, amount, currency }
        }
      });

      return dbPaymentIntent;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await prisma.paymentIntent.findUnique({
        where: { id: paymentIntentId },
        include: { order: true }
      });

      if (!paymentIntent) {
        throw new Error('Payment intent not found');
      }

      // Retrieve from Stripe
      const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.providerId!);

      if (stripePaymentIntent.status === 'succeeded') {
        // Update payment status
        await prisma.paymentIntent.update({
          where: { id: paymentIntentId },
          data: { status: 'SUCCEEDED' }
        });

        // Update order status
        await prisma.order.update({
          where: { id: paymentIntent.orderId },
          data: { status: 'COMPLETED' }
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            paymentId: paymentIntentId,
            type: 'CHARGE',
            amount: paymentIntent.amount,
            gateway: 'STRIPE',
            gatewayId: stripePaymentIntent.id,
            status: 'COMPLETED'
          }
        });

        // Generate licenses
        await this.generateLicenses(paymentIntent.orderId);

        // Create invoice
        await this.createInvoice(paymentIntent.orderId);

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: paymentIntent.order.userId,
            action: 'PAYMENT_CONFIRMED',
            entity: 'PaymentIntent',
            entityId: paymentIntentId,
            changes: { status: 'SUCCEEDED' }
          }
        });

        return { success: true, paymentIntent };
      }

      return { success: false, paymentIntent };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  static async generateLicenses(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });

    if (!order) return;

    for (const item of order.orderItems) {
      const licenseKey = this.generateLicenseKey();
      
      await prisma.license.create({
        data: {
          orderId,
          productId: item.productId,
          licenseKey,
          type: 'STANDARD',
          status: 'ACTIVE',
          validFrom: new Date(),
          validUntil: null, // Lifetime license
          maxActivations: 5,
          currentActivations: 0
        }
      });
    }
  }

  static async createInvoice(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true, user: true }
    });

    if (!order) return;

    const invoiceNumber = `INV-${Date.now()}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

    await prisma.invoice.create({
      data: {
        orderId,
        invoiceNumber,
        subtotal: order.totalAmount,
        tax: new Decimal(0),
        discount: new Decimal(0),
        total: order.totalAmount,
        currency: 'USD',
        billedTo: {
          userId: order.userId,
          email: order.user.email,
          name: order.user.name
        },
        billedFrom: {
          name: 'SoftwareVala',
          email: 'support@softwarevala.net'
        },
        status: 'PAID',
        paidAt: new Date()
      }
    });
  }

  static generateLicenseKey(): string {
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(crypto.randomUUID().split('-')[0].toUpperCase());
    }
    return segments.join('-');
  }

  static async processRefund(orderId: string, amount: number, reason?: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { paymentIntents: true }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const paymentIntent = order.paymentIntents[0];
      if (!paymentIntent || paymentIntent.status !== 'SUCCEEDED') {
        throw new Error('Payment not found or not successful');
      }

      // Process refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntent.providerId!,
        amount: Math.round(amount * 100),
        reason: (reason as any) || 'requested_by_customer'
      });

      // Create refund record
      const dbRefund = await prisma.refund.create({
        data: {
          orderId,
          amount: new Decimal(amount),
          reason,
          status: 'COMPLETED',
          processedAt: new Date(),
          metadata: { stripeRefundId: refund.id }
        }
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          paymentId: paymentIntent.id,
          type: 'REFUND',
          amount: new Decimal(amount),
          gateway: 'STRIPE',
          gatewayId: refund.id,
          status: 'COMPLETED'
        }
      });

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'REFUNDED' }
      });

      // Revoke licenses
      await prisma.license.updateMany({
        where: { orderId },
        data: { status: 'REVOKED' }
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: order.userId,
          action: 'PROCESS_REFUND',
          entity: 'Refund',
          entityId: dbRefund.id,
          changes: { orderId, amount, reason }
        }
      });

      return dbRefund;
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  static async verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }
}
