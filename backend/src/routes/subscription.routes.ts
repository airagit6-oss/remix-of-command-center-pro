import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import { SubscriptionService } from '../services/subscription.service';

// POST /subscriptions
export async function createSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { priceId } = req.body as any;

    if (!priceId) {
      return reply.status(400).send({ error: 'Price ID is required' });
    }

    const result = await SubscriptionService.createSubscription(userId, priceId);

    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create subscription' });
  }
}

// GET /subscriptions
export async function getSubscriptions(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;

    const subscriptions = await SubscriptionService.getUserSubscriptions(userId);

    return reply.send(subscriptions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch subscriptions' });
  }
}

// PATCH /subscriptions/:id/cancel
export async function cancelSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const userId = (req as any).user.id;

    const subscription = await SubscriptionService.cancelSubscription(id, userId);

    return reply.send(subscription);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to cancel subscription' });
  }
}

// PATCH /subscriptions/:id
export async function updateSubscription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const userId = (req as any).user.id;
    const { priceId } = req.body as any;

    if (!priceId) {
      return reply.status(400).send({ error: 'Price ID is required' });
    }

    const subscription = await SubscriptionService.updateSubscription(id, priceId, userId);

    return reply.send(subscription);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to update subscription' });
  }
}

export function subscriptionRoutes(fastify: FastifyInstance) {
  fastify.post('/subscriptions', { preHandler: [authenticate] }, createSubscription);
  fastify.get('/subscriptions', { preHandler: [authenticate] }, getSubscriptions);
  fastify.patch('/subscriptions/:id/cancel', { preHandler: [authenticate] }, cancelSubscription);
  fastify.patch('/subscriptions/:id', { preHandler: [authenticate] }, updateSubscription);
}
