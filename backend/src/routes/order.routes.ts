import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CommissionService } from '../services/commission.service';

const prisma = new PrismaClient();

// POST /orders - Create order and trigger commission
export async function createOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { items, referralCode } = req.body as any;
    
    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || product.status !== 'PUBLISHED') {
        return reply.status(400).send({ error: `Product ${item.productId} not available` });
      }

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        orderItems: {
          create: orderItems
        }
      },
      include: {
        orderItems: true
      }
    });

    // Handle referral
    let referralId = null;
    if (referralCode) {
      const reseller = await prisma.resellerProfile.findUnique({
        where: { referralCode }
      });

      if (reseller) {
        // Validate referral
        try {
          await CommissionService.validateReferral(reseller.userId, (req as any).user.email);
          
          const referral = await prisma.referral.create({
            data: {
              referrerId: reseller.userId,
              referredUserId: userId,
              code: referralCode,
              orderId: order.id
            }
          });

          referralId = referral.id;
        } catch (error) {
          // Referral validation failed, continue without referral
          console.log('Referral validation failed:', error);
        }
      }
    }

    // Update order with referral
    if (referralId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { referralId }
      });
    }

    // Process payment (placeholder)
    // In production, this would integrate with Stripe/PayPal
    const paymentSuccess = true;

    if (paymentSuccess) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      // Update product sales and revenue
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sales: { increment: item.quantity },
            revenue: { increment: item.total }
          }
        });

        // Update author stats
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { author: true }
        });

        if (product) {
          await prisma.authorProfile.update({
            where: { id: product.authorId },
            data: {
              totalRevenue: { increment: item.total },
              totalSales: { increment: item.quantity }
            }
          });

          // Create author earnings
          await prisma.authorEarnings.create({
            data: {
              authorId: product.authorId,
              orderId: order.id,
              productId: item.productId,
              type: 'SALE',
              amount: item.total,
              status: 'PENDING'
            }
          });
        }
      }

      // Trigger commission if referral exists
      if (referralId) {
        await CommissionService.calculateReferralCommission(referralId, totalAmount);
      }

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_ORDER',
          entity: 'Order',
          entityId: order.id,
          changes: { totalAmount, itemCount: items.length, referralCode }
        }
      });
    }

    reply.status(201).send({
      ...order,
      totalAmount: Number(order.totalAmount),
      orderItems: order.orderItems.map((oi: any) => ({
        ...oi,
        price: Number(oi.price),
        total: Number(oi.total)
      }))
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create order' });
  }
}

// GET /orders
export async function getOrders(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true }
        },
        referral: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    reply.send(orders.map((o: any) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      orderItems: o.orderItems.map((oi: any) => ({
        ...oi,
        price: Number(oi.price),
        total: Number(oi.total)
      }))
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch orders' });
  }
}

// GET /orders/:id
export async function getOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        orderItems: {
          include: { product: true }
        },
        referral: true
      }
    });

    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }

    reply.send({
      ...order,
      totalAmount: Number(order.totalAmount),
      orderItems: order.orderItems.map((oi: any) => ({
        ...oi,
        price: Number(oi.price),
        total: Number(oi.total)
      }))
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch order' });
  }
}

export function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/orders', { preHandler: [fastify.authenticate] }, createOrder);
  fastify.get('/orders', { preHandler: [fastify.authenticate] }, getOrders);
  fastify.get('/orders/:id', { preHandler: [fastify.authenticate] }, getOrder);
}
