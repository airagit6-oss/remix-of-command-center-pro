import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

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

    const paymentIntent = await prisma.paymentIntent.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        currency: 'USD',
        provider: paymentMethod === 'stripe' ? 'STRIPE' : 'PAYPAL',
        status: 'PENDING'
      }
    });

    return reply.send({
      order,
      paymentIntent,
      clientSecret: paymentIntent.id
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create checkout' });
  }
}

// POST /payment/webhook
export async function handleWebhook(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { provider, eventType, payload, signature } = req.body as any;

    await prisma.paymentWebhookLog.create({
      data: {
        provider: provider.toUpperCase(),
        eventType,
        payload,
        signature,
        processed: false
      }
    });

    if (eventType === 'payment_intent.succeeded' || eventType === 'checkout.session.completed') {
      const paymentId = payload.data.object.id || payload.payment_intent;
      
      const paymentIntent = await prisma.paymentIntent.findFirst({
        where: { providerId: paymentId }
      });

      if (paymentIntent) {
        await prisma.paymentIntent.update({
          where: { id: paymentIntent.id },
          data: { status: 'SUCCEEDED' }
        });

        const order = await prisma.order.update({
          where: { id: paymentIntent.orderId },
          data: { status: 'COMPLETED' },
          include: { orderItems: true }
        });

        await prisma.transaction.create({
          data: {
            paymentId: paymentIntent.id,
            type: 'CHARGE',
            amount: paymentIntent.amount,
            gateway: provider,
            gatewayId: paymentId,
            status: 'COMPLETED'
          }
        });

        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              sales: { increment: item.quantity },
              revenue: { increment: item.total }
            }
          });

          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            include: { author: true }
          });

          if (product?.author) {
            await prisma.authorEarnings.create({
              data: {
                authorId: product.author.id,
                orderId: order.id,
                productId: item.productId,
                type: 'SALE',
                amount: item.total,
                status: 'PENDING'
              }
            });
          }

          const licenseKey = `LIC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

          await prisma.license.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              licenseKey,
              type: 'STANDARD',
              status: 'ACTIVE'
            }
          });
        }

        const invoiceNumber = `INV-${Date.now()}`;
        await prisma.invoice.create({
          data: {
            orderId: order.id,
            invoiceNumber,
            subtotal: order.totalAmount,
            tax: 0,
            discount: 0,
            total: order.totalAmount,
            billedTo: { userId: order.userId },
            billedFrom: { name: 'SoftwareVala' },
            status: 'PAID',
            paidAt: new Date()
          }
        });
      }
    }

    await prisma.paymentWebhookLog.updateMany({
      where: { eventType, processed: false },
      data: { processed: true }
    });

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

    const refund = await prisma.refund.create({
      data: {
        orderId,
        amount,
        reason,
        status: 'PENDING'
      }
    });

    return reply.send(refund);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to request refund' });
  }
}

export function paymentRoutes(fastify: FastifyInstance) {
  fastify.post('/payment/checkout', createCheckout);
  fastify.post('/payment/webhook', handleWebhook);
  fastify.get('/payment/orders', getOrders);
  fastify.get('/payment/orders/:id', getOrder);
  fastify.get('/payment/invoices', getInvoices);
  fastify.post('/payment/refund', requestRefund);
}
