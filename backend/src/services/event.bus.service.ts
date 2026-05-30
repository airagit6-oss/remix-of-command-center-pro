// ============================================================
// EVENT BUS SERVICE
// Order, Payment, License, Commission, Payout, Notification Events
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EventBusService {
  // Publish event
  static async publishEvent(eventType: any, aggregateId: string, aggregateType: string, data: any, metadata?: any) {
    const event = await prisma.event.create({
      data: {
        eventType,
        aggregateId,
        aggregateType,
        data,
        metadata
      }
    });

    // Trigger event delivery to subscribers
    await this.deliverEvent(event);

    // Log event publication
    await prisma.auditLog.create({
      data: {
        action: 'EVENT_PUBLISHED',
        entity: 'Event',
        entityId: event.id,
        metadata: { eventType, aggregateId, aggregateType }
      }
    });

    return event;
  }

  // Deliver event to subscribers
  private static async deliverEvent(event: any) {
    const subscriptions = await prisma.eventSubscription.findMany({
      where: {
        eventType: event.eventType,
        enabled: true
      }
    });

    for (const subscription of subscriptions) {
      await this.createEventLog(event.id, subscription.id, event.eventType, subscription.webhookUrl);
    }
  }

  // Create event log for delivery
  private static async createEventLog(eventId: string, subscriptionId: string, eventType: any, webhookUrl: string) {
    return prisma.eventLog.create({
      data: {
        eventId,
        subscriptionId,
        eventType,
        webhookUrl,
        status: 'PENDING'
      }
    });
  }

  // Process pending event logs
  static async processPendingEventLogs() {
    const pendingLogs = await prisma.eventLog.findMany({
      where: { status: 'PENDING' },
      take: 50,
      include: {
        event: true
      }
    });

    const processed = [];
    for (const log of pendingLogs) {
      try {
        await this.deliverWebhook(log);
        processed.push(log.id);
      } catch (error) {
        console.error(`Failed to deliver webhook for log ${log.id}:`, error);
      }
    }

    return { processed, count: processed.length };
  }

  // Deliver webhook
  private static async deliverWebhook(log: any) {
    const subscription = await prisma.eventSubscription.findUnique({
      where: { id: log.subscriptionId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Update log to sent
    await prisma.eventLog.update({
      where: { id: log.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        attempts: { increment: 1 }
      }
    });

    // In production, this would make an actual HTTP request to the webhook URL
    // For now, we'll simulate successful delivery
    const success = true;
    const statusCode = 200;
    const response = 'Webhook delivered successfully';

    const updateData: any = {
      statusCode,
      response
    };

    if (success) {
      updateData.status = 'DELIVERED';
      updateData.deliveredAt = new Date();
    } else {
      updateData.status = 'FAILED';
      updateData.failedAt = new Date();
      updateData.error = response;
    }

    await prisma.eventLog.update({
      where: { id: log.id },
      data: updateData
    });

    return { success, statusCode, response };
  }

  // Subscribe to event
  static async subscribeToEvent(eventType: any, webhookUrl: string, secret?: string, metadata?: any) {
    const subscription = await prisma.eventSubscription.create({
      data: {
        eventType,
        webhookUrl,
        secret,
        enabled: true,
        metadata
      }
    });

    // Log subscription creation
    await prisma.auditLog.create({
      data: {
        action: 'EVENT_SUBSCRIPTION_CREATED',
        entity: 'EventSubscription',
        entityId: subscription.id,
        metadata: { eventType, webhookUrl }
      }
    });

    return subscription;
  }

  // Unsubscribe from event
  static async unsubscribeFromEvent(subscriptionId: string) {
    const subscription = await prisma.eventSubscription.delete({
      where: { id: subscriptionId }
    });

    // Log subscription deletion
    await prisma.auditLog.create({
      data: {
        action: 'EVENT_SUBSCRIPTION_DELETED',
        entity: 'EventSubscription',
        entityId: subscriptionId,
        metadata: { eventType: subscription.eventType }
      }
    });

    return subscription;
  }

  // Get all subscriptions
  static async getAllSubscriptions() {
    return prisma.eventSubscription.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get subscriptions by event type
  static async getSubscriptionsByEventType(eventType: any) {
    return prisma.eventSubscription.findMany({
      where: { eventType },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Enable subscription
  static async enableSubscription(subscriptionId: string) {
    return prisma.eventSubscription.update({
      where: { id: subscriptionId },
      data: { enabled: true }
    });
  }

  // Disable subscription
  static async disableSubscription(subscriptionId: string) {
    return prisma.eventSubscription.update({
      where: { id: subscriptionId },
      data: { enabled: false }
    });
  }

  // Get events
  static async getEvents(filters?: {
    eventType?: any;
    aggregateId?: string;
    aggregateType?: string;
    limit?: number;
  }) {
    const where: any = {};
    if (filters?.eventType) where.eventType = filters.eventType;
    if (filters?.aggregateId) where.aggregateId = filters.aggregateId;
    if (filters?.aggregateType) where.aggregateType = filters.aggregateType;

    return prisma.event.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: filters?.limit || 50
    });
  }

  // Get event logs
  static async getEventLogs(filters?: {
    eventId?: string;
    subscriptionId?: string;
    eventType?: any;
    status?: any;
    limit?: number;
  }) {
    const where: any = {};
    if (filters?.eventId) where.eventId = filters.eventId;
    if (filters?.subscriptionId) where.subscriptionId = filters.subscriptionId;
    if (filters?.eventType) where.eventType = filters.eventType;
    if (filters?.status) where.status = filters.status;

    return prisma.eventLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50
    });
  }

  // Get event statistics
  static async getEventStatistics() {
    const [
      totalEvents,
      totalSubscriptions,
      totalLogs,
      pendingLogs,
      deliveredLogs,
      failedLogs
    ] = await Promise.all([
      prisma.event.count(),
      prisma.eventSubscription.count(),
      prisma.eventLog.count(),
      prisma.eventLog.count({ where: { status: 'PENDING' } }),
      prisma.eventLog.count({ where: { status: 'DELIVERED' } }),
      prisma.eventLog.count({ where: { status: 'FAILED' } })
    ]);

    const successRate = totalLogs > 0 ? (deliveredLogs / totalLogs) * 100 : 100;

    return {
      totalEvents,
      totalSubscriptions,
      totalLogs,
      pendingLogs,
      deliveredLogs,
      failedLogs,
      successRate
    };
  }

  // Retry failed event logs
  static async retryFailedLogs(limit: number = 50) {
    const failedLogs = await prisma.eventLog.findMany({
      where: { status: 'FAILED' },
      take: limit
    });

    const retried = [];
    for (const log of failedLogs) {
      await prisma.eventLog.update({
        where: { id: log.id },
        data: {
          status: 'PENDING',
          attempts: 0,
          error: null,
          failedAt: null
        }
      });
      retried.push(log.id);
    }

    return { retried, count: retried.length };
  }

  // Clean up old events
  static async cleanupOldEvents(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deleted = await prisma.event.deleteMany({
      where: {
        publishedAt: { lt: cutoffDate }
      }
    });

    return { deleted: deleted.count };
  }

  // Clean up old event logs
  static async cleanupOldEventLogs(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deleted = await prisma.eventLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        status: { in: ['DELIVERED', 'FAILED'] }
      }
    });

    return { deleted: deleted.count };
  }
}
