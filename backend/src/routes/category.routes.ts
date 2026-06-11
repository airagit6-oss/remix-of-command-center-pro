import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';

// Mock categories data
const mockCategories = [
  {
    id: '1',
    name: 'Software',
    slug: 'software',
    description: 'Software products and tools',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    name: 'Templates',
    slug: 'templates',
    description: 'Design templates and themes',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Digital Assets',
    slug: 'digital-assets',
    description: 'Digital media and assets',
    isActive: true,
    order: 3,
  },
];

export function categoryRoutes(fastify: FastifyInstance) {
  // GET /categories - List all categories
  fastify.get('/categories', async (request: any, reply: any) => {
    try {
      return reply.send(mockCategories.filter(c => c.isActive));
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch categories' });
    }
  });

  // GET /categories/:id - Get single category by ID
  fastify.get('/categories/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const category = mockCategories.find(c => c.id === id);

      if (!category) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return reply.send(category);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch category' });
    }
  });

  // POST /categories - Create category (admin only)
  fastify.post(
    '/categories',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { name, slug, description } = request.body || {};

        const newCategory = {
          id: String(mockCategories.length + 1),
          name,
          slug,
          description,
          isActive: true,
          order: mockCategories.length + 1,
        };

        mockCategories.push(newCategory);
        return reply.status(201).send(newCategory);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to create category' });
      }
    }
  );

  // PUT /categories/:id - Update category
  fastify.put(
    '/categories/:id',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { id } = request.params;
        const category = mockCategories.find(c => c.id === id);

        if (!category) {
          return reply.status(404).send({ error: 'Category not found' });
        }

        Object.assign(category, request.body || {});
        return reply.send(category);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to update category' });
      }
    }
  );

  // DELETE /categories/:id - Delete category
  fastify.delete(
    '/categories/:id',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { id } = request.params;
        const index = mockCategories.findIndex(c => c.id === id);

        if (index === -1) {
          return reply.status(404).send({ error: 'Category not found' });
        }

        const removed = mockCategories.splice(index, 1);
        return reply.send(removed[0]);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to delete category' });
      }
    }
  );
}
