// ============================================================
// NOTIFICATION SERVICE (STUB)
// Minimal stub - Models not in Prisma schema
// ============================================================

export class NotificationService {
  static async sendNotification(userId: string, type: string, title: string, message: string, channels?: string[], data?: any, templateId?: string) {
    return { notification: { id: '' }, results: [] };
  }
  
  private static async sendToChannel(userId: string, channel: string, notification: any) {
    return { status: 'delivered' };
  }
  
  static async getUserNotifications(userId: string, limit?: number, unreadOnly?: boolean) {
    return [];
  }
  
  static async markAsRead(notificationId: string, userId: string) {
    return { success: true };
  }
  
  static async markAllAsRead(userId: string) {
    return { success: true };
  }
  
  static async getUnreadCount(userId: string) {
    return { count: 0 };
  }
  
  static async createTemplate(data: any) {
    return { id: '' };
  }
  
  static async getTemplates(type?: string) {
    return [];
  }
  
  static async sendFromTemplate(userId: string, templateName: string, variables?: any) {
    return { notification: { id: '' }, results: [] };
  }
  
  static async setPreferences(userId: string, type: string, channels: string[], enabled?: boolean) {
    return {};
  }
  
  static async getUserPreferences(userId: string) {
    return [];
  }
  
  static async getHistory(userId: string, limit?: number) {
    return [];
  }
  
  static async deleteNotification(notificationId: string, userId: string) {
    return { success: true };
  }
  
  static async bulkDeleteNotifications(notificationIds: string[], userId: string) {
    return { success: true, deletedCount: notificationIds.length };
  }
  
  static async getNotificationStats(userId: string) {
    return { total: 0, unread: 0, read: 0, byType: [] };
  }
}
