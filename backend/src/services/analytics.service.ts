// ============================================================
// ANALYTICS SERVICE (STUB)
// Minimal stub - Models/fields not in Prisma schema
// ============================================================

export class AnalyticsService {
  static async getSalesAnalytics(timeframe?: string) {
    return { total: 0, byProduct: {}, trend: [] };
  }

  static async getUserAnalytics(userId: string, timeframe?: string) {
    return { visits: 0, conversions: 0, revenue: 0 };
  }

  static async getProductAnalytics(productId: string, timeframe?: string) {
    return { views: 0, sales: 0, revenue: 0 };
  }

  static async trackEvent(userId: string, eventType: string, data?: any) {
    return { id: '' };
  }

  static async getPlatformStats() {
    return {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      topProducts: [],
      topAuthors: []
    };
  }
}
