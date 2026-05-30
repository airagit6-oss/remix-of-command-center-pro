// ============================================================
// CONFIG CENTER SERVICE
// Tax, Commission, License, Renewal, Referral, Notification Rules
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ConfigCenterService {
  // Create config rule
  static async createConfigRule(data: {
    type: any;
    category: string;
    key: string;
    value: any;
    description?: string;
    enabled?: boolean;
    priority?: number;
    validFrom?: Date;
    validTo?: Date;
    metadata?: any;
  }) {
    const rule = await prisma.configRule.create({
      data: {
        type: data.type,
        category: data.category,
        key: data.key,
        value: data.value,
        description: data.description,
        enabled: data.enabled ?? true,
        priority: data.priority ?? 0,
        validFrom: data.validFrom,
        validTo: data.validTo,
        metadata: data.metadata
      }
    });

    // Log config creation
    await prisma.auditLog.create({
      data: {
        action: 'CONFIG_RULE_CREATED',
        entity: 'ConfigRule',
        entityId: rule.id,
        metadata: { type: rule.type, key: rule.key }
      }
    });

    return rule;
  }

  // Update config rule
  static async updateConfigRule(ruleId: string, data: any) {
    const rule = await prisma.configRule.update({
      where: { id: ruleId },
      data
    });

    // Log config update
    await prisma.auditLog.create({
      data: {
        action: 'CONFIG_RULE_UPDATED',
        entity: 'ConfigRule',
        entityId: ruleId,
        metadata: { key: rule.key }
      }
    });

    return rule;
  }

  // Delete config rule
  static async deleteConfigRule(ruleId: string) {
    const rule = await prisma.configRule.delete({
      where: { id: ruleId }
    });

    // Log config deletion
    await prisma.auditLog.create({
      data: {
        action: 'CONFIG_RULE_DELETED',
        entity: 'ConfigRule',
        entityId: ruleId,
        metadata: { key: rule.key }
      }
    });

    return rule;
  }

  // Get config rules by type
  static async getConfigRules(type?: any, category?: string, enabledOnly: boolean = true) {
    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (enabledOnly) where.enabled = true;

    return prisma.configRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    });
  }

  // Get config rule by ID
  static async getConfigRule(ruleId: string) {
    return prisma.configRule.findUnique({
      where: { id: ruleId }
    });
  }

  // Get config rule by key and type
  static async getConfigRuleByKey(type: any, key: string) {
    const now = new Date();
    
    return prisma.configRule.findFirst({
      where: {
        type,
        key,
        enabled: true,
        OR: [
          { validFrom: null, validTo: null },
          { validFrom: { lte: now }, validTo: null },
          { validFrom: null, validTo: { gte: now } },
          { validFrom: { lte: now }, validTo: { gte: now } }
        ]
      },
      orderBy: { priority: 'desc' }
    });
  }

  // Get config value by key
  static async getConfigValue(type: any, key: string) {
    const rule = await this.getConfigRuleByKey(type, key);
    return rule?.value;
  }

  // Enable config rule
  static async enableConfigRule(ruleId: string) {
    return this.updateConfigRule(ruleId, { enabled: true });
  }

  // Disable config rule
  static async disableConfigRule(ruleId: string) {
    return this.updateConfigRule(ruleId, { enabled: false });
  }

  // Get tax rules
  static async getTaxRules(countryCode?: string) {
    const where: any = { type: 'TAX', enabled: true };
    if (countryCode) {
      where.category = countryCode;
    }

    return prisma.configRule.findMany({
      where,
      orderBy: { priority: 'desc' }
    });
  }

  // Get commission rules
  static async getCommissionRules(role?: string) {
    const where: any = { type: 'COMMISSION', enabled: true };
    if (role) {
      where.category = role;
    }

    return prisma.configRule.findMany({
      where,
      orderBy: { priority: 'desc' }
    });
  }

  // Get license rules
  static async getLicenseRules(licenseType?: string) {
    const where: any = { type: 'LICENSE', enabled: true };
    if (licenseType) {
      where.category = licenseType;
    }

    return prisma.configRule.findMany({
      where,
      orderBy: { priority: 'desc' }
    });
  }

  // Get renewal rules
  static async getRenewalRules() {
    return prisma.configRule.findMany({
      where: { type: 'RENEWAL', enabled: true },
      orderBy: { priority: 'desc' }
    });
  }

  // Get referral rules
  static async getReferralRules() {
    return prisma.configRule.findMany({
      where: { type: 'REFERRAL', enabled: true },
      orderBy: { priority: 'desc' }
    });
  }

  // Get notification rules
  static async getNotificationRules(notificationType?: string) {
    const where: any = { type: 'NOTIFICATION', enabled: true };
    if (notificationType) {
      where.category = notificationType;
    }

    return prisma.configRule.findMany({
      where,
      orderBy: { priority: 'desc' }
    });
  }

  // Get config statistics
  static async getConfigStatistics() {
    const [
      totalRules,
      enabledRules,
      disabledRules,
      taxRules,
      commissionRules,
      licenseRules,
      renewalRules,
      referralRules,
      notificationRules
    ] = await Promise.all([
      prisma.configRule.count(),
      prisma.configRule.count({ where: { enabled: true } }),
      prisma.configRule.count({ where: { enabled: false } }),
      prisma.configRule.count({ where: { type: 'TAX' } }),
      prisma.configRule.count({ where: { type: 'COMMISSION' } }),
      prisma.configRule.count({ where: { type: 'LICENSE' } }),
      prisma.configRule.count({ where: { type: 'RENEWAL' } }),
      prisma.configRule.count({ where: { type: 'REFERRAL' } }),
      prisma.configRule.count({ where: { type: 'NOTIFICATION' } })
    ]);

    return {
      totalRules,
      enabledRules,
      disabledRules,
      byType: {
        TAX: taxRules,
        COMMISSION: commissionRules,
        LICENSE: licenseRules,
        RENEWAL: renewalRules,
        REFERRAL: referralRules,
        NOTIFICATION: notificationRules
      }
    };
  }

  // Bulk update config rules
  static async bulkUpdateConfigRules(updates: Array<{ id: string; data: any }>) {
    const results = [];
    for (const update of updates) {
      const rule = await this.updateConfigRule(update.id, update.data);
      results.push(rule);
    }
    return results;
  }

  // Validate config rule
  static async validateConfigRule(type: any, category: string, key: string, value: any) {
    // Type-specific validation
    switch (type) {
      case 'TAX':
        if (typeof value !== 'number' || value < 0 || value > 100) {
          throw new Error('Tax rate must be a number between 0 and 100');
        }
        break;
      case 'COMMISSION':
        if (typeof value !== 'number' || value < 0 || value > 100) {
          throw new Error('Commission rate must be a number between 0 and 100');
        }
        break;
      case 'LICENSE':
        if (category === 'DURATION' && typeof value !== 'number') {
          throw new Error('License duration must be a number');
        }
        break;
    }
  }
}
