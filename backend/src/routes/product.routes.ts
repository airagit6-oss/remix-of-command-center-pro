import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function productRoutes(fastify: FastifyInstance) {
  // GET /api/v1/products - List all published products
  fastify.get('/products', async (request, reply) => {
    try {
      const { page = 1, limit = 20, category, search, sort = 'createdAt' } = request.query as any;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {
        status: 'PUBLISHED',
      };

      if (category) {
        where.categoryId = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ];
      }

      const orderBy: any = {};
      if (sort === 'price') orderBy.price = 'asc';
      else if (sort === 'price-desc') orderBy.price = 'desc';
      else if (sort === 'rating') orderBy.rating = 'desc';
      else if (sort === 'sales') orderBy.sales = 'desc';
      else orderBy.createdAt = 'desc';

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            author: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
            category: true,
            mediaFiles: {
              where: { type: 'IMAGE' },
              orderBy: { order: 'asc' },
              take: 1,
            },
            _count: {
              select: { reviews: true },
            },
          },
          orderBy,
          skip,
          take: Number(limit),
        }),
        prisma.product.count({ where }),
      ]);

      return reply.send({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch products' });
    }
  });

  // GET /api/v1/products/:id - Get single product by ID
  fastify.get('/products/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          author: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          category: true,
          mediaFiles: {
            orderBy: { order: 'asc' },
          },
          reviews: {
            where: { status: 'APPROVED' },
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      return reply.send(product);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch product' });
    }
  });

  // GET /api/v1/products/:id/related - Get related products
  fastify.get('/products/:id/related', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { limit = 6 } = request.query as any;

      const product = await prisma.product.findUnique({
        where: { id },
        select: { categoryId: true, tags: true },
      });

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      const related = await prisma.product.findMany({
        where: {
          id: { not: id },
          status: 'PUBLISHED',
          OR: [
            { categoryId: product.categoryId },
            { tags: { hasSome: product.tags } },
          ],
        },
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
        take: Number(limit),
      });

      return reply.send(related);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch related products' });
    }
  });
}
