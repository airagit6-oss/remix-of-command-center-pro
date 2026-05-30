// ============================================================
// FEATURE FLAG ENGINE
// Enable/Disable, Role-Based, Country-Based, Beta Testing, A/B Testing
// ============================================================

import { PrismaClient } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';

const prisma = new PrismaClient();

export class FeatureFlagService {
  // Check if feature is enabled for user
  static async isFeatureEnabled(key: string, userId?: string, userRole?: string, countryCode?: string, userSegment?: string): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key }
    });

    if (!flag) {
      return false; // Default to disabled if flag doesn't exist
    }

    if (!flag.enabled) {
      return false;
    }

    // Role-based check
    if (flag.roles.length > 0 && userRole) {
      if (!flag.roles.includes(userRole as any)) {
        return false;
      }
    }

    // Country-based check
    if (flag.countries.length > 0 && countryCode) {
      if (!flag.countries.includes(countryCode)) {
        return false;
      }
    }

    // User segment check
    if (flag.userSegments.length > 0 && userSegment) {
      if (!flag.userSegments.includes(userSegment)) {
        return false;
      }
    }

    return true;
  }

  // Get feature flag value (for A/B testing)
  static async getFeatureFlag(key: string, userId?: string): Promise<any> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key }
    });

    if (!flag || !flag.enabled) {
      return null;
    }

    if (!flag.isABTest) {
      return flag.metadata;
    }

    // A/B testing logic
    if (userId) {
      const hash = createHash('md5').update(userId + key).digest('hex');
      const hashInt = parseInt(hash.substring(0, 8), 16);
      const percentage = hashInt % 100;

      if (percentage < flag.splitPercentage) {
        return { variant: 'A', config: flag.variantA };
      } else {
        return { variant: 'B', config: flag.variantB };
      }
    }

    return flag.metadata;
  }

  // Create feature flag
  static async createFeatureFlag(data: {
    key: string;
    name: string;
    description?: string;
    enabled?: boolean;
    roles?: string[];
    countries?: string[];
    userSegments?: string[];
    isABTest?: boolean;
    variantA?: any;
    variantB?: any;
    splitPercentage?: number;
    metadata?: any;
  }) {
    const flag = await prisma.featureFlag.create({
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
        enabled: data.enabled ?? true,
        roles: (data.roles || []) as any,
        countries: data.countries || [],
        userSegments: data.userSegments || [],
        isABTest: data.isABTest ?? false,
        variantA: data.variantA,
        variantB: data.variantB,
        splitPercentage: data.splitPercentage ?? 50,
        metadata: data.metadata
      }
    });

    // Log creation
    await prisma.auditLog.create({
      data: {
        action: 'FEATURE_FLAG_CREATED',
        entity: 'FeatureFlag',
        entityId: flag.id,
        metadata: { key: flag.key, name: flag.name }
      }
    });

    return flag;
  }

  // Update feature flag
  static async updateFeatureFlag(key: string, data: any) {
    const flag = await prisma.featureFlag.update({
      where: { key },
      data
    });

    // Log update
    await prisma.auditLog.create({
      data: {
        action: 'FEATURE_FLAG_UPDATED',
        entity: 'FeatureFlag',
        entityId: flag.id,
        metadata: { key: flag.key, changes: data }
      }
    });

    return flag;
  }

  // Delete feature flag
  static async deleteFeatureFlag(key: string) {
    const flag = await prisma.featureFlag.delete({
      where: { key }
    });

    // Log deletion
    await prisma.auditLog.create({
      data: {
        action: 'FEATURE_FLAG_DELETED',
        entity: 'FeatureFlag',
        entityId: flag.id,
        metadata: { key: flag.key }
      }
    });

    return flag;
  }

  // Get all feature flags
  static async getAllFeatureFlags() {
    return prisma.featureFlag.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get feature flag by key
  static async getFeatureFlagByKey(key: string) {
    return prisma.featureFlag.findUnique({
      where: { key }
    });
  }

  // Enable feature flag
  static async enableFeatureFlag(key: string) {
    return this.updateFeatureFlag(key, { enabled: true });
  }

  // Disable feature flag
  static async disableFeatureFlag(key: string) {
    return this.updateFeatureFlag(key, { enabled: false });
  }

  // Get feature flags for user
  static async getFeatureFlagsForUser(userId: string, userRole: string, countryCode?: string, userSegment?: string) {
    const flags = await prisma.featureFlag.findMany({
      where: { enabled: true }
    });

    const userFlags: any[] = [];

    for (const flag of flags) {
      const isEnabled = await this.isFeatureEnabled(flag.key, userId, userRole, countryCode, userSegment);
      if (isEnabled) {
        const value = await this.getFeatureFlag(flag.key, userId);
        userFlags.push({
          key: flag.key,
          name: flag.name,
          enabled: true,
          value
        });
      }
    }

    return userFlags;
  }

  // Set beta testing segment for user
  static async setUserSegment(userId: string, segment: string) {
    // This would typically be stored in a separate UserSegment model
    // For now, we'll use metadata in the User model
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const metadata = (user.metadata as any) || {};
    metadata.segment = segment;

    await prisma.user.update({
      where: { id: userId },
      data: { metadata }
    });

    return { success: true, segment };
  }

  // Get user segment
  static async getUserSegment(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return null;
    }

    const metadata = user.metadata as any;
    return metadata?.segment || null;
  }
}
