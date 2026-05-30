import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from '../services/payment.service';
import { FraudDetectionService } from '../services/fraud.service';
import { validateStripeWebhook, preventReplayAttack } from '../middleware/webhook.middleware';

const prisma = new PrismaClient();

// POST /payment/checkout
export async function createCheckout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { items, paymentMethod } = req.body as any;

    if (!items || items.length === 0) {
      return reply.status(400).send({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || product.status !== 'PUBLISHED') {
        return reply.status(400).send({ error: `Product ${item.productId} not available` });
      }

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    // Fraud detection
    const fraudCheck = await FraudDetectionService.detectSuspiciousActivity(userId, totalAmount, {
      ipAddress: (req as any).ip,
      userAgent: req.headers['user-agent']
    });

    if (fraudCheck.isSuspicious) {
      await FraudDetectionService.blockPayment(userId, fraudCheck.reasons.join(', '));
      return reply.status(403).send({ 
        error: 'Payment blocked due to suspicious activity',
        riskScore: fraudCheck.riskScore,
        reasons: fraudCheck.reasons
      });
    }

    // Check for duplicate payment
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId,
        totalAmount,
        status: 'PENDING',
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      }
    });

    if (existingOrder) {
      return reply.status(400).send({ error: 'Duplicate order detected' });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        orderItems: {
          create: orderItemsData
        }
      },
      include: { orderItems: true }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE_ORDER',
        entity: 'Order',
        entityId: order.id,
        changes: { totalAmount, itemCount: items.length, paymentMethod }
      }
    });

    // Create payment intent with Stripe
    const paymentIntent = await PaymentService.createPaymentIntent(order.id, totalAmount, 'usd');

    return reply.send({
      order,
      paymentIntent,
      clientSecret: (paymentIntent.metadata as any)?.clientSecret
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create checkout' });
  }
}

// POST /payment/webhook
export async function handleWebhook(req: FastifyRequest, reply: FastifyReply) {
  try {
    const event = (req as any).webhookEvent;

    if (!event) {
      return reply.status(400).send({ error: 'No webhook event found' });
    }

    // Mark webhook as processed
    await prisma.paymentWebhookLog.updateMany({
      where: {
        provider: 'STRIPE',
        eventType: event.type,
        processed: false
      },
      data: { processed: true }
    });

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'checkout.session.completed': {
        const paymentId = event.data.object.id || event.data.object.payment_intent;
        
        const paymentIntent = await prisma.paymentIntent.findFirst({
          where: { providerId: paymentId }
        });

        if (paymentIntent) {
          await PaymentService.confirmPayment(paymentIntent.id);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentId = event.data.object.id;
        await prisma.paymentIntent.updateMany({
          where: { providerId: paymentId },
          data: { status: 'FAILED' }
        });
        break;
      }
      case 'charge.refunded': {
        const chargeId = event.data.object.id;
        const transaction = await prisma.transaction.findFirst({
          where: { gatewayId: chargeId }
        });
        
        if (transaction) {
          await prisma.paymentIntent.update({
            where: { id: transaction.paymentId },
            data: { status: 'REFUNDED' }
          });
        }
        break;
      }
    }

    return reply.send({ received: true });
  } catch (error) {
    reply.status(500).send({ error: 'Webhook processing failed' });
  }
}

// GET /payment/orders
export async function getOrders(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
        paymentIntents: true,
        invoices: true,
        licenses: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(orders);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch orders' });
  }
}

// GET /payment/orders/:id
export async function getOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const userId = (req as any).user.id;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        orderItems: { include: { product: true } },
        paymentIntents: true,
        invoices: true,
        licenses: true,
        refunds: true
      }
    });

    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }

    return reply.send(order);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch order' });
  }
}

// GET /payment/invoices
export async function getInvoices(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const invoices = await prisma.invoice.findMany({
      where: {
        order: { userId }
      },
      include: { order: true },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(invoices);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch invoices' });
  }
}

// POST /payment/refund
export async function requestRefund(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { orderId, amount, reason } = req.body as any;
    const userId = (req as any).user.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    });

    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }

    if (order.status !== 'COMPLETED') {
      return reply.status(400).send({ error: 'Order cannot be refunded' });
    }

    // Process refund through Stripe
    const refund = await PaymentService.processRefund(orderId, amount, reason);

    return reply.send(refund);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to process refund' });
  }
}

// GET /payment/licenses
export async function getLicenses(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const licenses = await prisma.license.findMany({
      where: {
        order: { userId }
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          }
        },
        activations: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(licenses);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch licenses' });
  }
}

// GET /payment/refunds
export async function getRefunds(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const refunds = await prisma.refund.findMany({
      where: {
        order: { userId }
      },
      include: {
        order: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(refunds);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch refunds' });
  }
}

export function paymentRoutes(fastify: FastifyInstance) {
  fastify.post('/payment/checkout', { preHandler: [fastify.authenticate] }, createCheckout);
  fastify.post('/payment/webhook', { preHandler: [validateStripeWebhook, preventReplayAttack] }, handleWebhook);
  fastify.get('/payment/orders', { preHandler: [fastify.authenticate] }, getOrders);
  fastify.get('/payment/orders/:id', { preHandler: [fastify.authenticate] }, getOrder);
  fastify.get('/payment/invoices', { preHandler: [fastify.authenticate] }, getInvoices);
  fastify.get('/payment/licenses', { preHandler: [fastify.authenticate] }, getLicenses);
  fastify.post('/payment/refund', { preHandler: [fastify.authenticate] }, requestRefund);
  fastify.get('/payment/refunds', { preHandler: [fastify.authenticate] }, getRefunds);
}
