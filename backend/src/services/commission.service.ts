import { PrismaClient } from '@prisma/client';
import { COMMISSION_CONFIG, PAYOUT_CONFIG } from '../config/constants';

const prisma = new PrismaClient();

export class CommissionService {
  // Calculate commission for a referral
  static async calculateReferralCommission(referralId: string, orderAmount: number) {
    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: { referrer: true }
    });

    if (!referral || referral.status !== 'PENDING') {
      return null;
    }

    const rule = await prisma.commissionRule.findFirst({
      where: { type: 'REFERRAL', isActive: true }
    });

    const rate = rule ? Number(rule.rate) : COMMISSION_CONFIG.DEFAULT_REFERRAL_RATE;
    const amount = orderAmount * rate;

    // Check for duplicate commission
    const existing = await prisma.commission.findFirst({
      where: { referralId, orderId: referral.orderId }
    });

    if (existing) {
      return null;
    }

    // Create commission
    const commission = await prisma.commission.create({
      data: {
        resellerId: referral.referrerId,
        userId: referral.referredUserId,
        referralId,
        type: 'REFERRAL',
        amount,
        rate,
        status: 'PENDING'
      }
    });

    // Update referral status
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: 'CONVERTED', commission: amount }
    });

    // Update reseller stats
    await prisma.resellerProfile.update({
      where: { userId: referral.referrerId },
      data: {
        totalReferrals: { increment: 1 },
        totalCommissions: { increment: amount }
      }
    });

    // Create earnings record
    await prisma.resellerEarnings.create({
      data: {
        resellerId: referral.referrerId,
        commissionId: commission.id,
        type: 'SALE',
        amount,
        status: 'PENDING'
      }
    });

    return commission;
  }

  // Approve commission
  static async approveCommission(commissionId: string, approvedBy: string) {
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: { reseller: true }
    });

    if (!commission || commission.status !== 'PENDING') {
      throw new Error('Commission not found or already processed');
    }

    await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
        approvedBy
      }
    });

    // Update earnings to available
    await prisma.resellerEarnings.updateMany({
      where: { commissionId },
      data: { status: 'AVAILABLE' }
    });

    // Update reseller balance
    await prisma.resellerProfile.update({
      where: { id: commission.resellerId },
      data: {
        availableBalance: { increment: commission.amount }
      }
    });

    return commission;
  }

  // Reject commission
  static async rejectCommission(commissionId: string, reason: string, rejectedBy: string) {
    const commission = await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'REJECTED',
        processedAt: new Date()
      }
    });

    // Update earnings
    await prisma.resellerEarnings.updateMany({
      where: { commissionId },
      data: { status: 'HELD' }
    });

    return commission;
  }

  // Check for fraud (duplicate referrals, self-referrals)
  static async validateReferral(referrerId: string, referredEmail: string) {
    // Check for self-referral
    const referrer = await prisma.user.findUnique({
      where: { id: referrerId }
    });

    if (referrer && referrer.email === referredEmail) {
      throw new Error('Self-referral not allowed');
    }

    // Check for duplicate referral
    const existing = await prisma.referral.findFirst({
      where: {
        referrerId,
        referredUser: { email: referredEmail }
      }
    });

    if (existing) {
      throw new Error('User already referred by this reseller');
    }

    return true;
  }

  // Get commission rules
  static async getCommissionRules() {
    return prisma.commissionRule.findMany({
      where: { isActive: true },
      orderBy: { type: 'asc' }
    });
  }

  // Update commission rule
  static async updateCommissionRule(ruleId: string, data: any) {
    return prisma.commissionRule.update({
      where: { id: ruleId },
      data
    });
  }
}
