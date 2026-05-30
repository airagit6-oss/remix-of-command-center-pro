import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function reviewRoutes(fastify: FastifyInstance) {
  // GET /api/v1/reviews - List reviews for a product
  fastify.get('/reviews', async (request, reply) => {
    try {
      const { productId, page = 1, limit = 20, sort = 'createdAt' } = request.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (productId) {
        where.productId = productId;
      }

      const orderBy: any = {};
      if (sort === 'helpful') orderBy.helpfulCount = 'desc';
      else if (sort === 'rating') orderBy.rating = 'desc';
      else orderBy.createdAt = 'desc';

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { ...where, status: 'APPROVED' },
          include: {
            user: {
              select: { id: true, name: true },
            },
            product: {
              select: { id: true, name: true },
            },
          },
          orderBy,
          skip,
          take: Number(limit),
        }),
        prisma.review.count({ where: { ...where, status: 'APPROVED' } }),
      ]);

      return reply.send({
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch reviews' });
    }
  });

  // POST /api/v1/reviews - Create a review
  fastify.post('/reviews', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;
      const { productId, rating, title, content } = request.body as any;

      // Check if user already reviewed this product
      const existing = await prisma.review.findFirst({
        where: { userId, productId },
      });

      if (existing) {
        return reply.status(400).send({ error: 'You have already reviewed this product' });
      }

      // Check if user has purchased this product (verified purchase)
      const orderItem = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: { userId },
        },
      });

      const isVerified = !!orderItem;

      const review = await prisma.review.create({
        data: {
          userId,
          productId,
          rating,
          title,
          content,
          isVerified,
          status: 'PENDING', // Reviews need approval
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
          product: {
            select: { id: true, name: true },
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_REVIEW',
          entity: 'Review',
          entityId: review.id,
          changes: { productId, rating },
        },
      });

      return reply.status(201).send(review);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create review' });
    }
  });

  // PUT /api/v1/reviews/:id - Update a review
  fastify.put('/reviews/:id', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };
      const { rating, title, content } = request.body as any;

      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        return reply.status(404).send({ error: 'Review not found' });
      }

      if (review.userId !== userId) {
        return reply.status(403).send({ error: 'You can only update your own reviews' });
      }

      const updated = await prisma.review.update({
        where: { id },
        data: {
          rating,
          title,
          content,
          isEdited: true,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
          product: {
            select: { id: true, name: true },
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_REVIEW',
          entity: 'Review',
          entityId: id,
          changes: { rating, title },
        },
      });

      return reply.send(updated);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update review' });
    }
  });

  // DELETE /api/v1/reviews/:id - Delete a review
  fastify.delete('/reviews/:id', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };

      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        return reply.status(404).send({ error: 'Review not found' });
      }

      if (review.userId !== userId) {
        return reply.status(403).send({ error: 'You can only delete your own reviews' });
      }

      await prisma.review.delete({
        where: { id },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_REVIEW',
          entity: 'Review',
          entityId: id,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete review' });
    }
  });

  // POST /api/v1/reviews/:id/helpful - Mark review as helpful
  fastify.post('/reviews/:id/helpful', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const review = await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return reply.send(review);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to mark review as helpful' });
    }
  });
}
