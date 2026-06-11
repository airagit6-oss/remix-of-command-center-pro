// ============================================================
// PRODUCT APPROVAL WORKFLOW SERVICE (STUB)
// Minimal stub - Models not in Prisma schema
// ============================================================

export class ProductApprovalService {
  static async createApproval(data: any) {
    return { id: '', ...data };
  }

  static async getApprovals(productId?: string, status?: any, submittedBy?: string) {
    return [];
  }

  static async getApproval(approvalId: string) {
    return null;
  }

  static async submitForReview(approvalId: string, submittedBy: string) {
    return { id: approvalId, status: 'PENDING_REVIEW' };
  }

  static async approveProduct(approvalId: string, reviewedBy: string) {
    return { id: approvalId, status: 'APPROVED' };
  }

  static async rejectProduct(approvalId: string, reviewedBy: string, rejectionReason: string) {
    return { id: approvalId, status: 'REJECTED' };
  }

  static async requestChanges(approvalId: string, reviewedBy: string, changeRequests: any) {
    return { id: approvalId, status: 'NEEDS_CHANGES' };
  }

  static async publishProduct(approvalId: string) {
    return { id: approvalId, status: 'PUBLISHED' };
  }

  static async archiveProduct(approvalId: string) {
    return { id: approvalId, status: 'ARCHIVED' };
  }

  static async getApprovalStatistics() {
    return {
      total: 0,
      draft: 0,
      pendingReview: 0,
      approved: 0,
      rejected: 0,
      needsChanges: 0,
      published: 0,
      archived: 0
    };
  }
}
