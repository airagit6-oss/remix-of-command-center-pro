import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /wishlist
export async function getWishlist(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            author: true,
            media: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(wishlist);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch wishlist' });
  }
}

// POST /wishlist
export async function addToWishlist(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;
    const { productId } = req.body as any;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    if (!productId) {
      return reply.status(400).send({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.status !== 'PUBLISHED') {
      return reply.status(404).send({ error: 'Product not available' });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      return reply.status(400).send({ error: 'Product already in wishlist' });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: {
        product: true
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ADD_TO_WISHLIST',
        entity: 'Wishlist',
        entityId: wishlistItem.id,
        changes: { productId }
      }
    });

    return reply.send(wishlistItem);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to add to wishlist' });
  }
}

// DELETE /wishlist/:productId
export async function removeFromWishlist(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;
    const { productId } = req.params as any;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (!wishlistItem) {
      return reply.status(404).send({ error: 'Wishlist item not found' });
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'REMOVE_FROM_WISHLIST',
        entity: 'Wishlist',
        entityId: wishlistItem.id
      }
    });

    return reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to remove from wishlist' });
  }
}

// GET /wishlist/count
export async function getWishlistCount(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const count = await prisma.wishlist.count({
      where: { userId }
    });

    return reply.send({ count });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch wishlist count' });
  }
}

export function wishlistRoutes(fastify: FastifyInstance) {
  fastify.get('/wishlist', { preHandler: [fastify.authenticate] }, getWishlist);
  fastify.post('/wishlist', { preHandler: [fastify.authenticate] }, addToWishlist);
  fastify.delete('/wishlist/:productId', { preHandler: [fastify.authenticate] }, removeFromWishlist);
  fastify.get('/wishlist/count', { preHandler: [fastify.authenticate] }, getWishlistCount);
}
