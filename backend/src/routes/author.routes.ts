import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireOwnership } from '../middleware/auth.middleware';
import { PAYOUT_CONFIG } from '../config/constants';

const prisma = new PrismaClient();

// GET /author/dashboard
export async function getAuthorDashboard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId },
      include: {
        products: {
          where: { status: 'PUBLISHED' },
          select: { id: true, name: true, sales: true, revenue: true }
        }
      }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const analytics = await prisma.authorAnalytics.findMany({
      where: { authorId: author.id },
      orderBy: { date: 'desc' },
      take: 30
    });

    const monthlyRevenue = analytics
      .filter(a => a.metric === 'revenue')
      .map(a => ({ month: a.date.toISOString().slice(0, 7), revenue: Number(a.value) }));

    const topProducts = author.products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({ name: p.name, sales: p.sales, revenue: Number(p.revenue) }));

    reply.send({
      totalRevenue: Number(author.totalRevenue),
      totalSales: author.totalSales,
      totalProducts: author.products.length,
      followers: author.followers,
      rating: Number(author.rating),
      availableBalance: Number(author.availableBalance),
      pendingBalance: Number(author.pendingBalance),
      monthlyRevenue,
      topProducts
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch dashboard' });
  }
}

// GET /author/products
export async function getAuthorProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const products = await prisma.product.findMany({
      where: { authorId: author.id },
      include: {
        mediaFiles: { orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    reply.send(products.map(p => ({
      ...p,
      price: Number(p.price),
      revenue: Number(p.revenue),
      rating: Number(p.rating)
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch products' });
  }
}

// POST /author/products
export async function createProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { name, description, price, media, tags, category } = req.body as any;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const product = await prisma.product.create({
      data: {
        authorId: author.id,
        name,
        description,
        price: price,
        media,
        tags: tags || [],
        category,
        status: 'DRAFT'
      }
    });

    // Create media records
    if (media && Array.isArray(media)) {
      await prisma.productMedia.createMany({
        data: media.map((m: any, i: number) => ({
          productId: product.id,
          type: m.type || 'IMAGE',
          url: m.url,
          alt: m.alt,
          order: i
        }))
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE_PRODUCT',
        entity: 'Product',
        entityId: product.id,
        changes: { name, price, status: 'DRAFT' }
      }
    });

    reply.status(201).send({
      ...product,
      price: Number(product.price),
      revenue: Number(product.revenue),
      rating: Number(product.rating)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create product' });
  }
}

// PATCH /author/products/:id
export async function updateProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    const { name, description, price, media, tags, category, status } = req.body as any;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const product = await prisma.product.findFirst({
      where: { id, authorId: author.id }
    });

    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(media && { media }),
        ...(tags && { tags }),
        ...(category && { category }),
        ...(status && { status, ...(status === 'PUBLISHED' && !product.publishedAt && { publishedAt: new Date() }) })
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_PRODUCT',
        entity: 'Product',
        entityId: id,
        changes: { name, price, status }
      }
    });

    reply.send({
      ...updated,
      price: Number(updated.price),
      revenue: Number(updated.revenue),
      rating: Number(updated.rating)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update product' });
  }
}

// DELETE /author/products/:id
export async function deleteProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const product = await prisma.product.findFirst({
      where: { id, authorId: author.id }
    });

    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }

    await prisma.product.delete({ where: { id } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE_PRODUCT',
        entity: 'Product',
        entityId: id
      }
    });

    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete product' });
  }
}

// GET /author/analytics
export async function getAuthorAnalytics(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const analytics = await prisma.authorAnalytics.findMany({
      where: { authorId: author.id },
      orderBy: { date: 'desc' },
      take: 90
    });

    const monthlyRevenue = analytics
      .filter(a => a.metric === 'revenue')
      .map(a => ({ month: a.date.toISOString().slice(0, 7), revenue: Number(a.value) }));

    const monthlySales = analytics
      .filter(a => a.metric === 'sales')
      .map(a => ({ month: a.date.toISOString().slice(0, 7), sales: Number(a.value) }));

    reply.send({
      totalRevenue: Number(author.totalRevenue),
      totalSales: author.totalSales,
      monthlyRevenue,
      monthlySales,
      followers: author.followers,
      rating: Number(author.rating)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch analytics' });
  }
}

// GET /author/earnings
export async function getAuthorEarnings(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId },
      include: {
        earnings: {
          where: { status: 'AVAILABLE' },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    const lastPayout = await prisma.payout.findFirst({
      where: { userId },
      orderBy: { requestedAt: 'desc' }
    });

    const totalLifetimeEarnings = author.earnings.reduce((sum, e) => sum + Number(e.amount), 0);

    reply.send({
      availableBalance: Number(author.availableBalance),
      pendingBalance: Number(author.pendingBalance),
      totalLifetimeEarnings,
      lastPayout: lastPayout ? {
        amount: Number(lastPayout.amount),
        date: lastPayout.requestedAt,
        status: lastPayout.status
      } : null
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch earnings' });
  }
}

// GET /author/payouts
export async function getAuthorPayouts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const payouts = await prisma.payout.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
      take: 50
    });

    reply.send(payouts.map(p => ({
      ...p,
      amount: Number(p.amount)
    })));
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch payouts' });
  }
}

// POST /author/payouts
export async function requestPayout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { amount, method, accountDetails } = req.body as any;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    if (Number(author.availableBalance) < amount) {
      return reply.status(400).send({ error: 'Insufficient balance' });
    }

    if (amount < PAYOUT_CONFIG.MINIMUM_AMOUNT) {
      return reply.status(400).send({ error: `Minimum payout is $${PAYOUT_CONFIG.MINIMUM_AMOUNT}` });
    }

    // Create payout
    const payout = await prisma.payout.create({
      data: {
        userId,
        amount,
        method,
        accountDetails
      }
    });

    // Deduct from available balance
    await prisma.authorProfile.update({
      where: { id: author.id },
      data: {
        availableBalance: { decrement: amount }
      }
    });

    // Create held earnings
    await prisma.authorEarnings.create({
      data: {
        authorId: author.id,
        type: 'ADJUSTMENT',
        amount: -amount,
        status: 'HELD'
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REQUEST_PAYOUT',
        entity: 'Payout',
        entityId: payout.id,
        changes: { amount, method }
      }
    });

    reply.status(201).send({
      ...payout,
      amount: Number(payout.amount)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to request payout' });
  }
}

// DELETE /author/payouts/:id
export async function cancelPayout(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params as any;
    
    const payout = await prisma.payout.findFirst({
      where: { id, userId, status: 'PENDING' }
    });

    if (!payout) {
      return reply.status(404).send({ error: 'Payout not found or cannot be cancelled' });
    }

    await prisma.payout.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Refund to available balance
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    if (author) {
      await prisma.authorProfile.update({
        where: { id: author.id },
        data: {
          availableBalance: { increment: payout.amount }
        }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CANCEL_PAYOUT',
        entity: 'Payout',
        entityId: id
      }
    });

    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to cancel payout' });
  }
}

// GET /author/profile
export async function getAuthorProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    
    const author = await prisma.authorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    if (!author) {
      return reply.status(404).send({ error: 'Author profile not found' });
    }

    reply.send({
      ...author,
      totalRevenue: Number(author.totalRevenue),
      availableBalance: Number(author.availableBalance),
      pendingBalance: Number(author.pendingBalance),
      rating: Number(author.rating)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch profile' });
  }
}

// PATCH /author/profile
export async function updateAuthorProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { bio, website, socialLinks } = req.body as any;
    
    const author = await prisma.authorProfile.update({
      where: { userId },
      data: {
        ...(bio && { bio }),
        ...(website && { website }),
        ...(socialLinks && { socialLinks })
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_PROFILE',
        entity: 'AuthorProfile',
        entityId: author.id,
        changes: { bio, website }
      }
    });

    reply.send({
      ...author,
      totalRevenue: Number(author.totalRevenue),
      availableBalance: Number(author.availableBalance),
      pendingBalance: Number(author.pendingBalance),
      rating: Number(author.rating)
    });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update profile' });
  }
}

export function authorRoutes(fastify: FastifyInstance) {
  fastify.get('/author/dashboard', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, getAuthorDashboard);
  fastify.get('/author/products', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, getAuthorProducts);
  fastify.post('/author/products', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, createProduct);
  fastify.patch('/author/products/:id', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR'), requireOwnership('Product')] }, updateProduct);
  fastify.delete('/author/products/:id', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR'), requireOwnership('Product')] }, deleteProduct);
  fastify.get('/author/analytics', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, getAuthorAnalytics);
  fastify.get('/author/earnings', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, getAuthorEarnings);
  fastify.get('/author/payouts', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, getAuthorPayouts);
  fastify.post('/author/payouts', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, requestPayout);
  fastify.delete('/author/payouts/:id', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR'), requireOwnership('Payout')] }, cancelPayout);
  fastify.get('/author/profile', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, getAuthorProfile);
  fastify.patch('/author/profile', { preHandler: [fastify.authenticate, fastify.requireRole('AUTHOR')] }, updateAuthorProfile);
}
