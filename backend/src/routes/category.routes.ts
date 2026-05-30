import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function categoryRoutes(fastify: FastifyInstance) {
  // GET /api/v1/categories - List all categories
  fastify.get('/categories', async (request, reply) => {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true },
          },
          parent: {
            select: { id: true, name: true },
          },
        },
        orderBy: { order: 'asc' },
      });

      return reply.send(categories);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch categories' });
    }
  });

  // GET /api/v1/categories/:id - Get single category by ID
  fastify.get('/categories/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          children: {
            where: { isActive: true },
            include: {
              _count: {
                select: { products: true },
              },
            },
          },
          products: {
            where: { status: 'PUBLISHED' },
            include: {
              author: {
                include: {
                  user: {
                    select: { id: true, name: true },
                  },
                },
              },
              mediaFiles: {
                where: { type: 'IMAGE' },
                orderBy: { order: 'asc' },
                take: 1,
              },
            },
            take: 12,
          },
        },
      });

      if (!category) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return reply.send(category);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch category' });
    }
  });

  // POST /api/v1/categories - Create category (admin only)
  fastify.post('/categories', {
    preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
  }, async (request, reply) => {
    try {
      const { name, slug, description, parentId, icon, color, order } = request.body as any;

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
          parentId,
          icon,
          color,
          order,
        },
      });

      return reply.status(201).send(category);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create category' });
    }
  });

  // PUT /api/v1/categories/:id - Update category (admin only)
  fastify.put('/categories/:id', {
    preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { name, slug, description, parentId, icon, color, order, isActive } = request.body as any;

      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          parentId,
          icon,
          color,
          order,
          isActive,
        },
      });

      return reply.send(category);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update category' });
    }
  });

  // DELETE /api/v1/categories/:id - Delete category (admin only)
  fastify.delete('/categories/:id', {
    preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      await prisma.category.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete category' });
    }
  });
}
