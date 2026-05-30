import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FraudDetectionService {
  static async detectSuspiciousActivity(userId: string, amount: number, metadata?: any): Promise<{
    isSuspicious: boolean;
    riskScore: number;
    reasons: string[];
  }> {
    const reasons: string[] = [];
    let riskScore = 0;

    // Check for rapid multiple orders
    const recentOrders = await prisma.order.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      }
    });

    if (recentOrders.length > 3) {
      reasons.push('Multiple rapid orders detected');
      riskScore += 30;
    }

    // Check for unusually high amount
    const avgOrderAmount = await prisma.order.aggregate({
      where: { userId },
      _avg: { totalAmount: true }
    });

    if (avgOrderAmount._avg.totalAmount) {
      const ratio = Number(amount) / Number(avgOrderAmount._avg.totalAmount);
      if (ratio > 10) {
        reasons.push('Unusually high order amount');
        riskScore += 25;
      }
    }

    // Check for failed payment attempts
    const failedPayments = await prisma.paymentIntent.findMany({
      where: {
        order: { userId },
        status: 'FAILED',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    });

    if (failedPayments.length > 5) {
      reasons.push('Multiple failed payment attempts');
      riskScore += 35;
    }

    // Check for duplicate payment attempts
    const recentPayment = await prisma.paymentIntent.findFirst({
      where: {
        order: { userId },
        amount,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      }
    });

    if (recentPayment) {
      reasons.push('Duplicate payment attempt detected');
      riskScore += 40;
    }

    // Check IP-based patterns (if available)
    if (metadata?.ipAddress) {
      const recentOrdersFromIP = await prisma.order.count({
        where: {
          auditLogs: {
            some: {
              ipAddress: metadata.ipAddress,
              createdAt: {
                gte: new Date(Date.now() - 60 * 60 * 1000)
              }
            }
          }
        }
      });

      if (recentOrdersFromIP > 10) {
        reasons.push('High activity from single IP');
        riskScore += 20;
      }
    }

    const isSuspicious = riskScore >= 50;

    if (isSuspicious) {
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'FRAUD_DETECTION',
          entity: 'Order',
          changes: {
            riskScore,
            reasons,
            metadata
          }
        }
      });
    }

    return {
      isSuspicious,
      riskScore,
      reasons
    };
  }

  static async blockPayment(userId: string, reason: string): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PAYMENT_BLOCKED',
        entity: 'PaymentIntent',
        changes: { reason }
      }
    });
  }

  static async checkDuplicatePayment(orderId: string, amount: number): Promise<boolean> {
    const existingPayment = await prisma.paymentIntent.findFirst({
      where: {
        orderId,
        amount,
        status: { in: ['SUCCEEDED', 'PROCESSING'] }
      }
    });

    return !!existingPayment;
  }
}
