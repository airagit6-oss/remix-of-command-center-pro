import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';

// Mock orders data
const mockOrders = [
  {
    id: '1',
    userId: '1',
    totalAmount: 99.99,
    status: 'COMPLETED',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '2',
    totalAmount: 149.99,
    status: 'PENDING',
    createdAt: new Date(),
  },
];

export function orderRoutes(fastify: FastifyInstance) {
  // GET /orders - List user orders
  fastify.get('/orders', { preHandler: [authenticate] }, async (request: any, reply: any) => {
    try {
      const userId = (request as any).user?.id || '1';
      const userOrders = mockOrders.filter(o => o.userId === userId);
      return reply.send(userOrders);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch orders' });
    }
  });

  // GET /orders/:id - Get single order
  fastify.get('/orders/:id', { preHandler: [authenticate] }, async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const order = mockOrders.find(o => o.id === id);

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      return reply.send(order);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch order' });
    }
  });

  // POST /orders - Create order
  fastify.post(
    '/orders',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { items } = request.body || {};

        const newOrder = {
          id: String(mockOrders.length + 1),
          userId: (request as any).user?.id || '1',
          totalAmount: items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0,
          status: 'PENDING',
          createdAt: new Date(),
        };

        mockOrders.push(newOrder);
        return reply.status(201).send(newOrder);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to create order' });
      }
    }
  );

  // PATCH /orders/:id - Update order status
  fastify.patch(
    '/orders/:id',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { id } = request.params;
        const { status } = request.body || {};
        const order = mockOrders.find(o => o.id === id);

        if (!order) {
          return reply.status(404).send({ error: 'Order not found' });
        }

        if (status) order.status = status;
        return reply.send(order);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to update order' });
      }
    }
  );

  // DELETE /orders/:id - Cancel order
  fastify.delete(
    '/orders/:id',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { id } = request.params;
        const index = mockOrders.findIndex(o => o.id === id);

        if (index === -1) {
          return reply.status(404).send({ error: 'Order not found' });
        }

        const removed = mockOrders.splice(index, 1);
        return reply.send(removed[0]);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to delete order' });
      }
    }
  );
}
