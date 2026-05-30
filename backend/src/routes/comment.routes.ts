import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple spam detection based on content patterns
function detectSpam(content: string): { isSpam: boolean; score: number } {
  const spamPatterns = [
    /\b(buy now|click here|free money|win big|casino|lottery)\b/i,
    /\b(http|www\.|\.com)\b/i,
    /\b(viagra|cialis|pills)\b/i,
    /\b(100%|guaranteed|risk-free)\b/i,
  ];

  let score = 0;
  for (const pattern of spamPatterns) {
    if (pattern.test(content)) {
      score += 0.25;
    }
  }

  // Check for excessive repetition
  const words = content.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;
  if (wordCount > 0 && uniqueWords / wordCount < 0.3) {
    score += 0.3;
  }

  // Check for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5) {
    score += 0.2;
  }

  return {
    isSpam: score > 0.5,
    score,
  };
}

export function commentRoutes(fastify: FastifyInstance) {
  // GET /api/v1/comments - List comments
  fastify.get('/comments', async (request, reply) => {
    try {
      const { reviewId, productId, page = 1, limit = 20 } = request.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { status: 'APPROVED' };
      if (reviewId) where.reviewId = reviewId;
      if (productId) where.productId = productId;

      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where,
          include: {
            user: {
              select: { id: true, name: true },
            },
            replies: {
              where: { status: 'APPROVED' },
              include: {
                user: {
                  select: { id: true, name: true },
                },
              },
            },
          },
          where: { parentId: null, ...where },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.comment.count({ where }),
      ]);

      return reply.send({
        comments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch comments' });
    }
  });

  // POST /api/v1/comments - Create a comment
  fastify.post('/comments', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;
      const { reviewId, productId, content, parentId } = request.body as any;

      // Spam detection
      const spamCheck = detectSpam(content);

      const comment = await prisma.comment.create({
        data: {
          userId,
          reviewId,
          productId,
          content,
          parentId,
          spamScore: spamCheck.score,
          isSpam: spamCheck.isSpam,
          status: spamCheck.isSpam ? 'SPAM' : 'PENDING',
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_COMMENT',
          entity: 'Comment',
          entityId: comment.id,
          changes: { reviewId, productId, isSpam: spamCheck.isSpam },
        },
      });

      return reply.status(201).send(comment);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create comment' });
    }
  });

  // PUT /api/v1/comments/:id - Update a comment
  fastify.put('/comments/:id', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };
      const { content } = request.body as any;

      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' });
      }

      if (comment.userId !== userId) {
        return reply.status(403).send({ error: 'You can only update your own comments' });
      }

      // Re-run spam detection
      const spamCheck = detectSpam(content);

      const updated = await prisma.comment.update({
        where: { id },
        data: {
          content,
          isEdited: true,
          spamScore: spamCheck.score,
          isSpam: spamCheck.isSpam,
          status: spamCheck.isSpam ? 'SPAM' : comment.status,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_COMMENT',
          entity: 'Comment',
          entityId: id,
          changes: { content, isSpam: spamCheck.isSpam },
        },
      });

      return reply.send(updated);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update comment' });
    }
  });

  // DELETE /api/v1/comments/:id - Delete a comment
  fastify.delete('/comments/:id', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;
      const { id } = request.params as { id: string };

      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' });
      }

      if (comment.userId !== userId) {
        return reply.status(403).send({ error: 'You can only delete your own comments' });
      }

      await prisma.comment.delete({
        where: { id },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_COMMENT',
          entity: 'Comment',
          entityId: id,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete comment' });
    }
  });

  // POST /api/v1/comments/:id/approve - Approve comment (admin)
  fastify.post('/comments/:id/approve', {
    preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const comment = await prisma.comment.update({
        where: { id },
        data: { status: 'APPROVED', isSpam: false },
      });

      return reply.send(comment);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to approve comment' });
    }
  });

  // POST /api/v1/comments/:id/reject - Reject comment (admin)
  fastify.post('/comments/:id/reject', {
    preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const comment = await prisma.comment.update({
        where: { id },
        data: { status: 'REJECTED' },
      });

      return reply.send(comment);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to reject comment' });
    }
  });
}
