// ============================================================
// CUSTOMER SUCCESS CENTER SERVICE
// Onboarding, Usage Tracking, Adoption Tracking,
// Renewal Prediction, Churn Prediction, Retention Campaigns
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerSuccessCenterService {
  // Customer Onboarding Methods
  static async createCustomerOnboarding(data: {
    userId: string;
    steps?: any;
    totalSteps: number;
    metadata?: any;
  }) {
    const onboarding = await prisma.customerOnboarding.create({
      data
    });

    // Log onboarding creation
    await prisma.auditLog.create({
      data: {
        action: 'CUSTOMER_ONBOARDING_CREATED',
        entity: 'CustomerOnboarding',
        entityId: onboarding.id,
        metadata: { userId: onboarding.userId }
      }
    });

    return onboarding;
  }

  static async getCustomerOnboarding(userId: string) {
    return prisma.customerOnboarding.findUnique({
      where: { userId },
      include: { user: true }
    });
  }

  static async updateOnboardingProgress(onboardingId: string, data: any) {
    const onboarding = await prisma.customerOnboarding.update({
      where: { id: onboardingId },
      data
    });

    // Log progress update
    await prisma.auditLog.create({
      data: {
        action: 'ONBOARDING_PROGRESS_UPDATED',
        entity: 'CustomerOnboarding',
        entityId: onboardingId
      }
    });

    return onboarding;
  }

  // Usage Tracking Methods
  static async trackUsage(data: {
    userId: string;
    productId?: string;
    action: string;
    feature?: string;
    metadata?: any;
  }) {
    const usage = await prisma.usageTracking.create({
      data
    });

    // Log usage tracking
    await prisma.auditLog.create({
      data: {
        action: 'USAGE_TRACKED',
        entity: 'UsageTracking',
        entityId: usage.id,
        metadata: { userId: usage.userId, action: usage.action }
      }
    });

    return usage;
  }

  static async getUsageTracking(userId: string, productId?: string, action?: string) {
    const where: any = { userId };
    if (productId) where.productId = productId;
    if (action) where.action = action;

    return prisma.usageTracking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  // Adoption Tracking Methods
  static async createAdoptionTracking(data: {
    userId: string;
    productId: string;
    adoptionScore?: number;
    featuresUsed?: string[];
    metadata?: any;
  }) {
    const adoption = await prisma.adoptionTracking.create({
      data
    });

    // Log adoption tracking
    await prisma.auditLog.create({
      data: {
        action: 'ADOPTION_TRACKING_CREATED',
        entity: 'AdoptionTracking',
        entityId: adoption.id,
        metadata: { userId: adoption.userId, productId: adoption.productId }
      }
    });

    return adoption;
  }

  static async getAdoptionTracking(userId: string, productId?: string) {
    const where: any = { userId };
    if (productId) where.productId = productId;

    return prisma.adoptionTracking.findMany({
      where,
      orderBy: { adoptionScore: 'desc' }
    });
  }

  static async updateAdoptionScore(adoptionId: string, data: any) {
    const adoption = await prisma.adoptionTracking.update({
      where: { id: adoptionId },
      data
    });

    // Log score update
    await prisma.auditLog.create({
      data: {
        action: 'ADOPTION_SCORE_UPDATED',
        entity: 'AdoptionTracking',
        entityId: adoptionId
      }
    });

    return adoption;
  }

  // Renewal Prediction Methods
  static async createRenewalPrediction(data: {
    userId: string;
    subscriptionId?: string;
    renewalProbability: number;
    riskLevel: any;
    factors?: any;
    metadata?: any;
  }) {
    const prediction = await prisma.renewalPrediction.create({
      data
    });

    // Log prediction creation
    await prisma.auditLog.create({
      data: {
        action: 'RENEWAL_PREDICTION_CREATED',
        entity: 'RenewalPrediction',
        entityId: prediction.id,
        metadata: { userId: prediction.userId, riskLevel: prediction.riskLevel }
      }
    });

    return prediction;
  }

  static async getRenewalPredictions(userId?: string, riskLevel?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (riskLevel) where.riskLevel = riskLevel;

    return prisma.renewalPrediction.findMany({
      where,
      include: { user: true },
      orderBy: { renewalProbability: 'asc' }
    });
  }

  static async updateRenewalPrediction(predictionId: string, data: any) {
    const prediction = await prisma.renewalPrediction.update({
      where: { id: predictionId },
      data
    });

    // Log prediction update
    await prisma.auditLog.create({
      data: {
        action: 'RENEWAL_PREDICTION_UPDATED',
        entity: 'RenewalPrediction',
        entityId: predictionId
      }
    });

    return prediction;
  }

  // Churn Prediction Methods
  static async createChurnPrediction(data: {
    userId: string;
    churnProbability: number;
    riskLevel: any;
    factors?: any;
    metadata?: any;
  }) {
    const prediction = await prisma.churnPrediction.create({
      data
    });

    // Log prediction creation
    await prisma.auditLog.create({
      data: {
        action: 'CHURN_PREDICTION_CREATED',
        entity: 'ChurnPrediction',
        entityId: prediction.id,
        metadata: { userId: prediction.userId, riskLevel: prediction.riskLevel }
      }
    });

    return prediction;
  }

  static async getChurnPredictions(userId?: string, riskLevel?: any) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (riskLevel) where.riskLevel = riskLevel;

    return prisma.churnPrediction.findMany({
      where,
      include: { user: true },
      orderBy: { churnProbability: 'desc' }
    });
  }

  static async updateChurnPrediction(predictionId: string, data: any) {
    const prediction = await prisma.churnPrediction.update({
      where: { id: predictionId },
      data
    });

    // Log prediction update
    await prisma.auditLog.create({
      data: {
        action: 'CHURN_PREDICTION_UPDATED',
        entity: 'ChurnPrediction',
        entityId: predictionId
      }
    });

    return prediction;
  }

  // Retention Campaign Methods
  static async createRetentionCampaign(data: {
    name: string;
    description?: string;
    type: any;
    targetAudience?: any;
    startDate?: Date;
    endDate?: Date;
    metadata?: any;
  }) {
    const campaign = await prisma.retentionCampaign.create({
      data
    });

    // Log campaign creation
    await prisma.auditLog.create({
      data: {
        action: 'RETENTION_CAMPAIGN_CREATED',
        entity: 'RetentionCampaign',
        entityId: campaign.id,
        metadata: { type: campaign.type }
      }
    });

    return campaign;
  }

  static async getRetentionCampaigns(status?: any, type?: any) {
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    return prisma.retentionCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateRetentionCampaign(campaignId: string, data: any) {
    const campaign = await prisma.retentionCampaign.update({
      where: { id: campaignId },
      data
    });

    // Log campaign update
    await prisma.auditLog.create({
      data: {
        action: 'RETENTION_CAMPAIGN_UPDATED',
        entity: 'RetentionCampaign',
        entityId: campaignId
      }
    });

    return campaign;
  }

  // Campaign Target Methods
  static async addCampaignTarget(data: {
    campaignId: string;
    userId: string;
    metadata?: any;
  }) {
    const target = await prisma.campaignTarget.create({
      data
    });

    // Log target addition
    await prisma.auditLog.create({
      data: {
        action: 'CAMPAIGN_TARGET_ADDED',
        entity: 'CampaignTarget',
        entityId: target.id,
        metadata: { campaignId: target.campaignId, userId: target.userId }
      }
    });

    return target;
  }

  static async getCampaignTargets(campaignId: string, status?: any) {
    const where: any = { campaignId };
    if (status) where.status = status;

    return prisma.campaignTarget.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateCampaignTargetStatus(targetId: string, status: any) {
    const data: any = { status };
    if (status === 'SENT') data.sentAt = new Date();
    if (status === 'OPENED') data.openedAt = new Date();
    if (status === 'CLICKED') data.clickedAt = new Date();

    const target = await prisma.campaignTarget.update({
      where: { id: targetId },
      data
    });

    // Log status update
    await prisma.auditLog.create({
      data: {
        action: 'CAMPAIGN_TARGET_STATUS_UPDATED',
        entity: 'CampaignTarget',
        entityId: targetId,
        metadata: { status }
      }
    });

    return target;
  }

  // Customer Success Statistics
  static async getCustomerSuccessStatistics() {
    const [
      totalOnboarding,
      completedOnboarding,
      inProgressOnboarding,
      totalUsage,
      totalAdoption,
      highRiskRenewals,
      highRiskChurn,
      activeCampaigns,
      totalTargets,
      convertedTargets
    ] = await Promise.all([
      prisma.customerOnboarding.count(),
      prisma.customerOnboarding.count({ where: { status: 'COMPLETED' } }),
      prisma.customerOnboarding.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.usageTracking.count(),
      prisma.adoptionTracking.count(),
      prisma.renewalPrediction.count({ where: { riskLevel: 'CRITICAL' } }),
      prisma.churnPrediction.count({ where: { riskLevel: 'CRITICAL' } }),
      prisma.retentionCampaign.count({ where: { status: 'ACTIVE' } }),
      prisma.campaignTarget.count(),
      prisma.campaignTarget.count({ where: { status: 'CONVERTED' } })
    ]);

    return {
      onboarding: {
        total: totalOnboarding,
        completed: completedOnboarding,
        inProgress: inProgressOnboarding
      },
      usage: {
        total: totalUsage
      },
      adoption: {
        total: totalAdoption
      },
      risk: {
        highRenewalRisk: highRiskRenewals,
        highChurnRisk: highRiskChurn
      },
      campaigns: {
        active: activeCampaigns,
        totalTargets,
        convertedTargets
      }
    };
  }
}
