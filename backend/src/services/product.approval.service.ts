// ============================================================
// PRODUCT APPROVAL WORKFLOW SERVICE
// Draft, Pending Review, Approved, Rejected, Needs Changes, Published, Archived
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductApprovalService {
  static async createApproval(data: {
    productId: string;
    submittedBy: string;
    metadata?: any;
  }) {
    const approval = await prisma.productApproval.create({
      data
    });

    // Log approval creation
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_APPROVAL_CREATED',
        entity: 'ProductApproval',
        entityId: approval.id,
        metadata: { productId: approval.productId, submittedBy: approval.submittedBy }
      }
    });

    return approval;
  }

  static async getApprovals(productId?: string, status?: any, submittedBy?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (submittedBy) where.submittedBy = submittedBy;

    return prisma.productApproval.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getApproval(approvalId: string) {
    return prisma.productApproval.findUnique({
      where: { id: approvalId },
      include: { product: true }
    });
  }

  static async submitForReview(approvalId: string, submittedBy: string) {
    const approval = await prisma.productApproval.update({
      where: { id: approvalId },
      data: {
        status: 'PENDING_REVIEW',
        submittedAt: new Date()
      }
    });

    // Log submission
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_SUBMITTED_FOR_REVIEW',
        entity: 'ProductApproval',
        entityId: approvalId,
        metadata: { submittedBy }
      }
    });

    return approval;
  }

  static async approveProduct(approvalId: string, reviewedBy: string) {
    const approval = await prisma.productApproval.update({
      where: { id: approvalId },
      data: {
        status: 'APPROVED',
        reviewedBy,
        reviewedAt: new Date()
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: approval.productId },
      data: { status: 'PUBLISHED', publishedAt: new Date() }
    });

    // Log approval
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_APPROVED',
        entity: 'ProductApproval',
        entityId: approvalId,
        metadata: { reviewedBy }
      }
    });

    return approval;
  }

  static async rejectProduct(approvalId: string, reviewedBy: string, rejectionReason: string) {
    const approval = await prisma.productApproval.update({
      where: { id: approvalId },
      data: {
        status: 'REJECTED',
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: approval.productId },
      data: { status: 'DRAFT' }
    });

    // Log rejection
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_REJECTED',
        entity: 'ProductApproval',
        entityId: approvalId,
        metadata: { reviewedBy, rejectionReason }
      }
    });

    return approval;
  }

  static async requestChanges(approvalId: string, reviewedBy: string, changeRequests: any) {
    const approval = await prisma.productApproval.update({
      where: { id: approvalId },
      data: {
        status: 'NEEDS_CHANGES',
        reviewedBy,
        reviewedAt: new Date(),
        changeRequests
      }
    });

    // Log change request
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_CHANGES_REQUESTED',
        entity: 'ProductApproval',
        entityId: approvalId,
        metadata: { reviewedBy }
      }
    });

    return approval;
  }

  static async publishProduct(approvalId: string) {
    const approval = await prisma.productApproval.update({
      where: { id: approvalId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: approval.productId },
      data: { status: 'PUBLISHED', publishedAt: new Date() }
    });

    // Log publication
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_PUBLISHED',
        entity: 'ProductApproval',
        entityId: approvalId
      }
    });

    return approval;
  }

  static async archiveProduct(approvalId: string) {
    const approval = await prisma.productApproval.update({
      where: { id: approvalId },
      data: {
        status: 'ARCHIVED',
        archivedAt: new Date()
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: approval.productId },
      data: { status: 'ARCHIVED' }
    });

    // Log archival
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_ARCHIVED',
        entity: 'ProductApproval',
        entityId: approvalId
      }
    });

    return approval;
  }

  static async getApprovalStatistics() {
    const [
      totalApprovals,
      draft,
      pendingReview,
      approved,
      rejected,
      needsChanges,
      published,
      archived
    ] = await Promise.all([
      prisma.productApproval.count(),
      prisma.productApproval.count({ where: { status: 'DRAFT' } }),
      prisma.productApproval.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.productApproval.count({ where: { status: 'APPROVED' } }),
      prisma.productApproval.count({ where: { status: 'REJECTED' } }),
      prisma.productApproval.count({ where: { status: 'NEEDS_CHANGES' } }),
      prisma.productApproval.count({ where: { status: 'PUBLISHED' } }),
      prisma.productApproval.count({ where: { status: 'ARCHIVED' } })
    ]);

    return {
      total: totalApprovals,
      draft,
      pendingReview,
      approved,
      rejected,
      needsChanges,
      published,
      archived
    };
  }
}
