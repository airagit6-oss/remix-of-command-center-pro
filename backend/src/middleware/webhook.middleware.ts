import { FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function validateStripeWebhook(req: FastifyRequest, reply: FastifyReply) {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!signature) {
      return reply.status(400).send({ error: 'No signature provided' });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return reply.status(500).send({ error: 'Webhook secret not configured' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      
      // Log webhook
      await prisma.paymentWebhookLog.create({
        data: {
          provider: 'STRIPE',
          eventType: event.type,
          payload: req.body as any,
          signature,
          processed: false
        }
      });

      // Attach event to request for processing
      (req as any).webhookEvent = event;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return reply.status(400).send({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook validation error:', error);
    return reply.status(500).send({ error: 'Webhook validation failed' });
  }
}

export async function preventReplayAttack(req: FastifyRequest, reply: FastifyReply) {
  try {
    const event = (req as any).webhookEvent;
    
    if (!event) {
      return reply.status(400).send({ error: 'No webhook event found' });
    }

    // Check if this event ID has already been processed
    const existingLog = await prisma.paymentWebhookLog.findFirst({
      where: {
        provider: 'STRIPE',
        eventType: event.type,
        processed: true,
        metadata: {
          path: [],
          equals: { eventId: event.id }
        }
      }
    });

    if (existingLog) {
      console.log('Duplicate webhook event detected:', event.id);
      return reply.status(200).send({ received: true, duplicate: true });
    }

    // Mark as processed after successful validation
    await prisma.paymentWebhookLog.updateMany({
      where: {
        provider: 'STRIPE',
        eventType: event.type,
        processed: false,
        createdAt: {
          lte: new Date()
        }
      },
      data: {
        processed: true,
        metadata: { eventId: event.id }
      }
    });
  } catch (error) {
    console.error('Replay attack prevention error:', error);
    return reply.status(500).send({ error: 'Replay attack check failed' });
  }
}
