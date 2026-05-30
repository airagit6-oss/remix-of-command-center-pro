// ============================================================
// NOTIFICATION SERVICE
// Multi-channel notification system: In-App, Email, WhatsApp, Push
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  // Send notification to multiple channels
  static async sendNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    channels: string[] = ['IN_APP'],
    data?: any,
    templateId?: string
  ) {
    // Check user preferences
    const preferences = await prisma.notificationPreference.findUnique({
      where: { userId_type: { userId, type: type as any } }
    });

    const enabledChannels = preferences?.enabled ? preferences.channels : channels;

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type as any,
        title,
        message,
        data,
        channels: enabledChannels as any,
        templateId
      }
    });

    // Send to each enabled channel
    const results: any[] = [];
    for (const channel of enabledChannels) {
      try {
        const result = await this.sendToChannel(userId, channel as any, notification);
        results.push({ channel, success: true, result });
        
        // Log to history
        await prisma.notificationHistory.create({
          data: {
            userId,
            type: type as any,
            channel: channel as any,
            status: 'SENT' as any,
            subject: title,
            body: message,
            metadata: { notificationId: notification.id }
          }
        });
      } catch (error: any) {
        results.push({ channel, success: false, error: error.message });
        
        // Log failure to history
        await prisma.notificationHistory.create({
          data: {
            userId,
            type: type as any,
            channel: channel as any,
            status: 'FAILED' as any,
            subject: title,
            body: message,
            error: error.message,
            metadata: { notificationId: notification.id }
          }
        });
      }
    }

    return { notification, results };
  }

  // Send to specific channel
  private static async sendToChannel(
    userId: string,
    channel: string,
    notification: any
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    switch (channel) {
      case 'IN_APP':
        // Already stored in database, no additional action needed
        return { status: 'delivered' };
      
      case 'EMAIL':
        // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
        console.log(`[EMAIL] Sending to ${user?.email}: ${notification.title}`);
        return { status: 'sent' };
      
      case 'WHATSAPP':
        // TODO: Integrate with WhatsApp Business API
        console.log(`[WHATSAPP] Sending to ${user?.name}: ${notification.message}`);
        return { status: 'sent' };
      
      case 'PUSH':
        // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
        console.log(`[PUSH] Sending to ${userId}: ${notification.title}`);
        return { status: 'sent' };
      
      case 'SMS':
        // TODO: Integrate with SMS service (Twilio, etc.)
        console.log(`[SMS] Sending to ${user?.name}: ${notification.message}`);
        return { status: 'sent' };
      
      default:
        throw new Error(`Unknown channel: ${channel}`);
    }
  }

  // Get user notifications
  static async getUserNotifications(userId: string, limit: number = 50, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { sentAt: 'desc' },
      take: limit
    });

    return notifications;
  }

  // Mark notification as read
  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ' as any
      }
    });

    return { success: true };
  }

  // Mark all notifications as read
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ' as any
      }
    });

    return { success: true };
  }

  // Get unread count
  static async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return { count };
  }

  // Create notification template
  static async createTemplate(data: {
    name: string;
    type: string;
    channels: string[];
    subject?: string;
    body: string;
    htmlBody?: string;
    variables?: any;
  }) {
    const template = await prisma.notificationTemplate.create({
      data: {
        name: data.name,
        type: data.type as any,
        channels: data.channels as any,
        subject: data.subject,
        body: data.body,
        htmlBody: data.htmlBody,
        variables: data.variables
      }
    });

    return template;
  }

  // Get notification templates
  static async getTemplates(type?: string) {
    const where: any = {};
    if (type) {
      where.type = type as any;
    }

    const templates = await prisma.notificationTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return templates;
  }

  // Send notification using template
  static async sendFromTemplate(
    userId: string,
    templateName: string,
    variables: any = {}
  ) {
    const template = await prisma.notificationTemplate.findUnique({
      where: { name: templateName }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    if (!template.isActive) {
      throw new Error('Template is not active');
    }

    // Replace variables in body
    let body = template.body;
    let subject = template.subject || '';
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      body = body.replace(new RegExp(placeholder, 'g'), String(value));
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return this.sendNotification(
      userId,
      template.type,
      subject,
      body,
      template.channels,
      variables,
      template.id
    );
  }

  // Set user notification preferences
  static async setPreferences(
    userId: string,
    type: string,
    channels: string[],
    enabled: boolean = true
  ) {
    const preference = await prisma.notificationPreference.upsert({
      where: { userId_type: { userId, type: type as any } },
      create: {
        userId,
        type: type as any,
        channels: channels as any,
        enabled
      },
      update: {
        channels: channels as any,
        enabled
      }
    });

    return preference;
  }

  // Get user preferences
  static async getUserPreferences(userId: string) {
    const preferences = await prisma.notificationPreference.findMany({
      where: { userId }
    });

    return preferences;
  }

  // Get notification history
  static async getHistory(userId: string, limit: number = 100) {
    const history = await prisma.notificationHistory.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit
    });

    return history;
  }

  // Delete notification
  static async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return { success: true };
  }

  // Bulk delete notifications
  static async bulkDeleteNotifications(notificationIds: string[], userId: string) {
    await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId
      }
    });

    return { success: true, deletedCount: notificationIds.length };
  }

  // Get notification stats
  static async getNotificationStats(userId: string) {
    const total = await prisma.notification.count({ where: { userId } });
    const unread = await prisma.notification.count({ where: { userId, isRead: false } });
    const read = total - unread;

    const byType = await prisma.notification.groupBy({
      by: ['type'],
      where: { userId },
      _count: true
    });

    return {
      total,
      unread,
      read,
      byType: byType.map(item => ({
        type: item.type,
        count: item._count
      }))
    };
  }
}
