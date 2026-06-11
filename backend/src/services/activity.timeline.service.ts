// ============================================================
// ACTIVITY TIMELINE SERVICE (STUB)
// Minimal stub - Models/fields not in Prisma schema
// ============================================================

export class ActivityTimelineService {
  static async logActivity(userId: string, action: string, resource: string, resourceId?: string, metadata?: any) {
    return { id: '' };
  }

  static async getUserTimeline(userId: string, limit?: number, offset?: number) {
    return [];
  }

  static async getActivityStats(userId: string, timeframe?: string) {
    return { total: 0, byAction: {}, byResource: {} };
  }
}
