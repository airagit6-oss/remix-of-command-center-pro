// ============================================================
// OPERATIONS CENTER SERVICE (STUB)
// Minimal stub - Models/fields not in Prisma schema
// ============================================================

export class OperationsCenterService {
  static async getPendingReviews() {
    return [];
  }

  static async getPendingProducts() {
    return [];
  }

  static async getPendingAuthorProfiles() {
    return [];
  }

  static async getPaymentStatus() {
    return { pending: 0, processing: 0, completed: 0 };
  }

  static async getOperationsSummary() {
    return {
      pendingReviews: 0,
      pendingProducts: 0,
      pendingAuthorProfiles: 0,
      totalTransactions: 0
    };
  }
}
