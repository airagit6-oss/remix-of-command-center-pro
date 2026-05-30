// ============================================================
// NOTIFICATION ROUTES
// API endpoints for notification center
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { NotificationService } from '../services/notification.service';

// GET /notifications
export async function getNotifications(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '50');
    const unreadOnly = (req.query as any).unreadOnly === 'true';
    
    const notifications = await NotificationService.getUserNotifications(userId, limit, unreadOnly);
    return reply.send(notifications);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch notifications' });
  }
}

// GET /notifications/unread-count
export async function getUnreadCount(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const result = await NotificationService.getUnreadCount(userId);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch unread count' });
  }
}

// POST /notifications/:notificationId/read
export async function markAsRead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { notificationId } = req.params as any;
    
    const result = await NotificationService.markAsRead(notificationId, userId);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to mark as read' });
  }
}

// POST /notifications/read-all
export async function markAllAsRead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const result = await NotificationService.markAllAsRead(userId);
    return reply.send(result);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to mark all as read' });
  }
}

// POST /notifications/send
export async function sendNotification(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId, type, title, message, channels, data, templateId } = req.body as any;
    
    if (!userId || !type || !title || !message) {
      return reply.status(400).send({ error: 'userId, type, title, and message are required' });
    }

    const result = await NotificationService.sendNotification(
      userId,
      type,
      title,
      message,
      channels || ['IN_APP'],
      data,
      templateId
    );
    
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to send notification' });
  }
}

// POST /notifications/send-template
export async function sendFromTemplate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId, templateName, variables } = req.body as any;
    
    if (!userId || !templateName) {
      return reply.status(400).send({ error: 'userId and templateName are required' });
    }

    const result = await NotificationService.sendFromTemplate(userId, templateName, variables);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to send notification from template' });
  }
}

// GET /notifications/templates
export async function getTemplates(req: FastifyRequest, reply: FastifyReply) {
  try {
    const type = (req.query as any).type;
    const templates = await NotificationService.getTemplates(type);
    return reply.send(templates);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch templates' });
  }
}

// POST /notifications/templates
export async function createTemplate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { name, type, channels, subject, body, htmlBody, variables } = req.body as any;
    
    if (!name || !type || !channels || !body) {
      return reply.status(400).send({ error: 'name, type, channels, and body are required' });
    }

    const template = await NotificationService.createTemplate({
      name,
      type,
      channels,
      subject,
      body,
      htmlBody,
      variables
    });
    
    return reply.send(template);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to create template' });
  }
}

// GET /notifications/preferences
export async function getUserPreferences(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const preferences = await NotificationService.getUserPreferences(userId);
    return reply.send(preferences);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch preferences' });
  }
}

// POST /notifications/preferences
export async function setPreferences(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { type, channels, enabled } = req.body as any;
    
    if (!type || !channels) {
      return reply.status(400).send({ error: 'type and channels are required' });
    }

    const preference = await NotificationService.setPreferences(userId, type, channels, enabled);
    return reply.send(preference);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to set preferences' });
  }
}

// GET /notifications/history
export async function getHistory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt((req.query as any).limit || '100');
    const history = await NotificationService.getHistory(userId, limit);
    return reply.send(history);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch history' });
  }
}

// DELETE /notifications/:notificationId
export async function deleteNotification(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { notificationId } = req.params as any;
    
    const result = await NotificationService.deleteNotification(notificationId, userId);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to delete notification' });
  }
}

// DELETE /notifications
export async function bulkDeleteNotifications(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const { notificationIds } = req.body as any;
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return reply.status(400).send({ error: 'notificationIds array is required' });
    }

    const result = await NotificationService.bulkDeleteNotifications(notificationIds, userId);
    return reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ error: error.message || 'Failed to bulk delete notifications' });
  }
}

// GET /notifications/stats
export async function getNotificationStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const stats = await NotificationService.getNotificationStats(userId);
    return reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch notification stats' });
  }
}

export function notificationRoutes(fastify: FastifyInstance) {
  fastify.get('/notifications', { preHandler: [fastify.authenticate] }, getNotifications);
  fastify.get('/notifications/unread-count', { preHandler: [fastify.authenticate] }, getUnreadCount);
  fastify.post('/notifications/:notificationId/read', { preHandler: [fastify.authenticate] }, markAsRead);
  fastify.post('/notifications/read-all', { preHandler: [fastify.authenticate] }, markAllAsRead);
  
  fastify.post('/notifications/send', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, sendNotification);
  fastify.post('/notifications/send-template', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, sendFromTemplate);
  
  fastify.get('/notifications/templates', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, getTemplates);
  fastify.post('/notifications/templates', { preHandler: [fastify.authenticate, fastify.requireRole('ADMIN')] }, createTemplate);
  
  fastify.get('/notifications/preferences', { preHandler: [fastify.authenticate] }, getUserPreferences);
  fastify.post('/notifications/preferences', { preHandler: [fastify.authenticate] }, setPreferences);
  
  fastify.get('/notifications/history', { preHandler: [fastify.authenticate] }, getHistory);
  fastify.delete('/notifications/:notificationId', { preHandler: [fastify.authenticate] }, deleteNotification);
  fastify.delete('/notifications', { preHandler: [fastify.authenticate] }, bulkDeleteNotifications);
  
  fastify.get('/notifications/stats', { preHandler: [fastify.authenticate] }, getNotificationStats);
}
