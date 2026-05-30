// ============================================================
// PRODUCT HEALTH CENTER SERVICE
// Crash Reports, Bug Reports, Issue Tracking, Known Issues,
// Version Health, User Complaints
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductHealthCenterService {
  // Crash Report Methods
  static async createCrashReport(data: {
    productId: string;
    userId?: string;
    version: string;
    platform: string;
    os?: string;
    stackTrace: string;
    errorMessage?: string;
    metadata?: any;
  }) {
    const crash = await prisma.crashReport.create({
      data
    });

    // Log crash report
    await prisma.auditLog.create({
      data: {
        action: 'CRASH_REPORT_CREATED',
        entity: 'CrashReport',
        entityId: crash.id,
        metadata: { productId: crash.productId, version: crash.version }
      }
    });

    return crash;
  }

  static async getCrashReports(productId?: string, status?: any, version?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (version) where.version = version;

    return prisma.crashReport.findMany({
      where,
      include: { product: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateCrashStatus(crashId: string, status: any) {
    const crash = await prisma.crashReport.update({
      where: { id: crashId },
      data: { status }
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'CRASH_STATUS_UPDATED',
        entity: 'CrashReport',
        entityId: crashId,
        metadata: { status }
      }
    });

    return crash;
  }

  // Product Bug Report Methods
  static async createProductBugReport(data: {
    productId: string;
    userId?: string;
    title: string;
    description: string;
    severity: any;
    priority: any;
    metadata?: any;
  }) {
    const bug = await prisma.productBugReport.create({
      data
    });

    // Log bug report
    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_BUG_REPORT_CREATED',
        entity: 'ProductBugReport',
        entityId: bug.id,
        metadata: { productId: bug.productId, severity: bug.severity }
      }
    });

    return bug;
  }

  static async getProductBugReports(productId?: string, status?: any, severity?: any) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return prisma.productBugReport.findMany({
      where,
      include: { product: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateBugStatus(bugId: string, status: any, assignedTo?: string) {
    const data: any = { status };
    if (status === 'RESOLVED') data.resolvedAt = new Date();
    if (assignedTo) data.assignedTo = assignedTo;

    const bug = await prisma.productBugReport.update({
      where: { id: bugId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'BUG_STATUS_UPDATED',
        entity: 'ProductBugReport',
        entityId: bugId,
        metadata: { status, assignedTo }
      }
    });

    return bug;
  }

  // Issue Tracking Methods
  static async createIssue(data: {
    productId: string;
    type: any;
    title: string;
    description: string;
    severity: any;
    metadata?: any;
  }) {
    const issue = await prisma.issue.create({
      data
    });

    // Log issue creation
    await prisma.auditLog.create({
      data: {
        action: 'ISSUE_CREATED',
        entity: 'Issue',
        entityId: issue.id,
        metadata: { productId: issue.productId, type: issue.type }
      }
    });

    return issue;
  }

  static async getIssues(productId?: string, status?: any, type?: any) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (type) where.type = type;

    return prisma.issue.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateIssueStatus(issueId: string, status: any, assignedTo?: string) {
    const data: any = { status };
    if (status === 'RESOLVED') data.resolvedAt = new Date();
    if (assignedTo) data.assignedTo = assignedTo;

    const issue = await prisma.issue.update({
      where: { id: issueId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'ISSUE_STATUS_UPDATED',
        entity: 'Issue',
        entityId: issueId,
        metadata: { status, assignedTo }
      }
    });

    return issue;
  }

  // Known Issues Methods
  static async createKnownIssue(data: {
    productId: string;
    version: string;
    title: string;
    description: string;
    workaround?: string;
    severity: any;
    metadata?: any;
  }) {
    const knownIssue = await prisma.knownIssue.create({
      data
    });

    // Log known issue creation
    await prisma.auditLog.create({
      data: {
        action: 'KNOWN_ISSUE_CREATED',
        entity: 'KnownIssue',
        entityId: knownIssue.id,
        metadata: { productId: knownIssue.productId, version: knownIssue.version }
      }
    });

    return knownIssue;
  }

  static async getKnownIssues(productId?: string, status?: any, version?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (status) where.status = status;
    if (version) where.version = version;

    return prisma.knownIssue.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateKnownIssueStatus(issueId: string, status: any, fixedInVersion?: string) {
    const data: any = { status };
    if (fixedInVersion) data.fixedInVersion = fixedInVersion;

    const knownIssue = await prisma.knownIssue.update({
      where: { id: issueId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'KNOWN_ISSUE_STATUS_UPDATED',
        entity: 'KnownIssue',
        entityId: issueId,
        metadata: { status, fixedInVersion }
      }
    });

    return knownIssue;
  }

  // Version Health Methods
  static async createVersionHealth(data: {
    productId: string;
    version: string;
    crashRate?: number;
    bugCount?: number;
    issueCount?: number;
    healthScore?: number;
    metadata?: any;
  }) {
    const health = await prisma.versionHealth.create({
      data
    });

    // Log version health creation
    await prisma.auditLog.create({
      data: {
        action: 'VERSION_HEALTH_CREATED',
        entity: 'VersionHealth',
        entityId: health.id,
        metadata: { productId: health.productId, version: health.version }
      }
    });

    return health;
  }

  static async getVersionHealth(productId?: string, version?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (version) where.version = version;

    return prisma.versionHealth.findMany({
      where,
      include: { product: true },
      orderBy: { version: 'desc' }
    });
  }

  static async updateVersionHealth(healthId: string, data: any) {
    const health = await prisma.versionHealth.update({
      where: { id: healthId },
      data
    });

    // Log health update
    await prisma.auditLog.create({
      data: {
        action: 'VERSION_HEALTH_UPDATED',
        entity: 'VersionHealth',
        entityId: healthId
      }
    });

    return health;
  }

  // User Complaint Methods
  static async createUserComplaint(data: {
    productId: string;
    userId: string;
    category: any;
    subject: string;
    description: string;
    severity: any;
    metadata?: any;
  }) {
    const complaint = await prisma.userComplaint.create({
      data
    });

    // Log complaint creation
    await prisma.auditLog.create({
      data: {
        action: 'USER_COMPLAINT_CREATED',
        entity: 'UserComplaint',
        entityId: complaint.id,
        metadata: { productId: complaint.productId, userId: complaint.userId }
      }
    });

    return complaint;
  }

  static async getUserComplaints(productId?: string, userId?: string, status?: any) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return prisma.userComplaint.findMany({
      where,
      include: { product: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateComplaintStatus(complaintId: string, status: any, resolvedBy?: string) {
    const data: any = { status };
    if (status === 'RESOLVED' || status === 'CLOSED') {
      data.resolvedAt = new Date();
      if (resolvedBy) data.resolvedBy = resolvedBy;
    }

    const complaint = await prisma.userComplaint.update({
      where: { id: complaintId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'COMPLAINT_STATUS_UPDATED',
        entity: 'UserComplaint',
        entityId: complaintId,
        metadata: { status, resolvedBy }
      }
    });

    return complaint;
  }

  // Health Statistics
  static async getProductHealthStatistics(productId?: string) {
    const where = productId ? { productId } : {};

    const [
      totalCrashes,
      activeCrashes,
      totalBugs,
      activeBugs,
      totalIssues,
      activeIssues,
      totalKnownIssues,
      activeKnownIssues,
      totalComplaints,
      activeComplaints,
      avgHealthScore
    ] = await Promise.all([
      prisma.crashReport.count({ where }),
      prisma.crashReport.count({ where: { ...where, status: 'NEW' } }),
      prisma.productBugReport.count({ where }),
      prisma.productBugReport.count({ where: { ...where, status: 'NEW' } }),
      prisma.issue.count({ where }),
      prisma.issue.count({ where: { ...where, status: 'OPEN' } }),
      prisma.knownIssue.count({ where }),
      prisma.knownIssue.count({ where: { ...where, status: 'ACTIVE' } }),
      prisma.userComplaint.count({ where }),
      prisma.userComplaint.count({ where: { ...where, status: 'NEW' } }),
      prisma.versionHealth.aggregate({
        where,
        _avg: { healthScore: true }
      })
    ]);

    return {
      crashes: {
        total: totalCrashes,
        active: activeCrashes
      },
      bugs: {
        total: totalBugs,
        active: activeBugs
      },
      issues: {
        total: totalIssues,
        active: activeIssues
      },
      knownIssues: {
        total: totalKnownIssues,
        active: activeKnownIssues
      },
      complaints: {
        total: totalComplaints,
        active: activeComplaints
      },
      averageHealthScore: avgHealthScore._avg.healthScore || 0
    };
  }
}
