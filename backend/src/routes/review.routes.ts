import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    userId: '1',
    productId: '1',
    rating: 5,
    title: 'Excellent product',
    content: 'Really satisfied with this purchase',
    isVerified: true,
    status: 'APPROVED',
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '2',
    productId: '1',
    rating: 4,
    title: 'Good quality',
    content: 'Good quality, arrived quickly',
    isVerified: true,
    status: 'APPROVED',
    createdAt: new Date(),
  },
];

export function reviewRoutes(fastify: FastifyInstance) {
  // GET /reviews - List reviews for a product
  fastify.get('/reviews', async (request: any, reply: any) => {
    try {
      const { productId, page = 1, limit = 20 } = request.query || {};
      const filtered = productId
        ? mockReviews.filter(r => r.productId === productId && r.status === 'APPROVED')
        : mockReviews.filter(r => r.status === 'APPROVED');

      const skip = (Number(page) - 1) * Number(limit);
      const paged = filtered.slice(skip, skip + Number(limit));

      return reply.send({
        reviews: paged,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / Number(limit)),
        },
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch reviews' });
    }
  });

  // POST /reviews - Create a review
  fastify.post(
    '/reviews',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { productId, rating, title, content } = request.body || {};

        const newReview = {
          id: String(mockReviews.length + 1),
          userId: (request as any).user?.id || '1',
          productId,
          rating,
          title,
          content,
          isVerified: true,
          status: 'PENDING',
          createdAt: new Date(),
        };

        mockReviews.push(newReview);
        return reply.status(201).send(newReview);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to create review' });
      }
    }
  );

  // PATCH /reviews/:id/approve - Approve review (admin only)
  fastify.patch(
    '/reviews/:id/approve',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { id } = request.params;
        const review = mockReviews.find(r => r.id === id);

        if (!review) {
          return reply.status(404).send({ error: 'Review not found' });
        }

        review.status = 'APPROVED';
        return reply.send(review);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to approve review' });
      }
    }
  );

  // DELETE /reviews/:id - Delete review
  fastify.delete(
    '/reviews/:id',
    { preHandler: [authenticate] },
    async (request: any, reply: any) => {
      try {
        const { id } = request.params;
        const index = mockReviews.findIndex(r => r.id === id);

        if (index === -1) {
          return reply.status(404).send({ error: 'Review not found' });
        }

        const removed = mockReviews.splice(index, 1);
        return reply.send(removed[0]);
      } catch (error) {
        return reply.status(500).send({ error: 'Failed to delete review' });
      }
    }
  );
}
