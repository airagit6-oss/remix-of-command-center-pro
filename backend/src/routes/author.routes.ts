import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';

// Mock author data
const mockAuthors = [
  {
    id: '1',
    userId: '1',
    name: 'John Author',
    bio: 'Experienced software engineer',
    avatar: 'https://example.com/avatar1.jpg',
    totalProducts: 5,
    totalRevenue: 5000,
  },
];

// Mock author chat threads
const mockChatThreads = [
  {
    id: '1',
    authorId: '1',
    title: 'Customer Support Chat',
    createdAt: new Date(),
  },
];

export function authorRoutes(fastify: FastifyInstance) {
  // GET /author/profile - Get author profile
  fastify.get(
    '/author/profile',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const author = mockAuthors[0];
        return reply.send(author);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to fetch author profile' });
      }
    }
  );

  // GET /author/products - Get author products
  fastify.get(
    '/author/products',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        return reply.send([
          { id: '1', name: 'Product 1', price: 99.99, sales: 10 },
          { id: '2', name: 'Product 2', price: 149.99, sales: 5 },
        ]);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to fetch products' });
      }
    }
  );

  // GET /author/earnings - Get author earnings
  fastify.get(
    '/author/earnings',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        return reply.send({
          totalEarnings: 5000,
          pendingEarnings: 500,
          thisMonth: 1200,
        });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to fetch earnings' });
      }
    }
  );

  // GET /author/chat/:threadId - Get chat thread
  fastify.get(
    '/author/chat/:threadId',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { threadId } = request.params;
        const thread = mockChatThreads.find(t => t.id === threadId);

        if (!thread) {
          return reply.status(404).send({ error: 'Thread not found' });
        }

        return reply.send({
          ...thread,
          messages: [
            { id: '1', text: 'Hello', sender: 'customer', createdAt: new Date() },
            { id: '2', text: 'Hi there!', sender: 'author', createdAt: new Date() },
          ],
        });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to fetch chat' });
      }
    }
  );

  // POST /author/chat/:threadId/message - Send chat message
  fastify.post(
    '/author/chat/:threadId/message',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { threadId } = request.params;
        const { text } = request.body || {};

        return reply.status(201).send({
          id: '3',
          text,
          sender: 'author',
          createdAt: new Date(),
        });
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to send message' });
      }
    }
  );

  // PATCH /author/profile - Update author profile
  fastify.patch(
    '/author/profile',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const updated = { ...mockAuthors[0], ...request.body };
        mockAuthors[0] = updated;
        return reply.send(updated);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to update profile' });
      }
    }
  );
}
