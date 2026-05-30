import { PrismaClient } from '@prisma/client';
import { PAYOUT_CONFIG } from '../config/constants';

const prisma = new PrismaClient();

export class PayoutService {
  // Process pending payouts
  static async processPendingPayouts() {
    const pendingPayouts = await prisma.payout.findMany({
      where: { status: 'PENDING' },
      include: { user: true }
    });

    const results = [];

    for (const payout of pendingPayouts) {
      try {
        // Update to processing
        await prisma.payout.update({
          where: { id: payout.id },
          data: { status: 'PROCESSING' }
        });

        // Process payment (integration with payment gateway would go here)
        const success = await this.processPayment(payout);

        if (success) {
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              status: 'COMPLETED',
              processedAt: new Date(),
              transactionId: `TXN-${Date.now()}-${payout.id.substring(0, 8)}`
            }
          });

          // Update held earnings to paid
          await prisma.authorEarnings.updateMany({
            where: {
              authorId: payout.userId,
              status: 'HELD',
              type: 'ADJUSTMENT',
              amount: { equals: -payout.amount }
            },
            data: { status: 'PAID' }
          });

          await prisma.resellerEarnings.updateMany({
            where: {
              resellerId: payout.userId,
              status: 'HELD',
              type: 'ADJUSTMENT',
              amount: { equals: -payout.amount }
            },
            data: { status: 'PAID' }
          });

          // Create notification
          await prisma.notification.create({
            data: {
              userId: payout.userId,
              type: 'PAYOUT',
              title: 'Payout Completed',
              message: `Your payout of $${payout.amount} has been processed successfully.`,
              data: { payoutId: payout.id, amount: payout.amount }
            }
          });

          results.push({ payoutId: payout.id, status: 'COMPLETED' });
        } else {
          await prisma.payout.update({
            where: { id: payout.id },
            data: {
              status: 'FAILED',
              processedAt: new Date(),
              notes: 'Payment processing failed'
            }
          });

          // Refund to available balance
          await this.refundPayout(payout);

          results.push({ payoutId: payout.id, status: 'FAILED' });
        }
      } catch (error) {
        await prisma.payout.update({
          where: { id: payout.id },
          data: {
            status: 'FAILED',
            processedAt: new Date(),
            notes: error instanceof Error ? error.message : 'Unknown error'
          }
        });

        await this.refundPayout(payout);

        results.push({ payoutId: payout.id, status: 'FAILED', error });
      }
    }

    return results;
  }

  // Process payment (placeholder for actual payment gateway integration)
  private static async processPayment(payout: any): Promise<boolean> {
    // Integration with Stripe, PayPal, bank transfer, etc.
    // This is a placeholder - actual implementation would call payment gateway APIs
    
    // For production, this would be:
    // - Stripe API call for card payments
    // - PayPal API for PayPal payouts
    // - Bank transfer API integration
    // - Crypto wallet integration
    
    // Return true for now - in production this would be actual payment gateway response
    return true;
  }

  // Refund failed payout
  private static async refundPayout(payout: any) {
    // Check if user is author or reseller
    const author = await prisma.authorProfile.findUnique({
      where: { userId: payout.userId }
    });

    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId: payout.userId }
    });

    if (author) {
      await prisma.authorProfile.update({
        where: { id: author.id },
        data: { availableBalance: { increment: payout.amount } }
      });
    }

    if (reseller) {
      await prisma.resellerProfile.update({
        where: { id: reseller.id },
        data: { availableBalance: { increment: payout.amount } }
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: payout.userId,
        type: 'ALERT',
        title: 'Payout Failed',
        message: `Your payout of $${payout.amount} failed. Amount has been refunded to your balance.`,
        data: { payoutId: payout.id, amount: payout.amount }
      }
    });
  }

  // Get payout statistics
  static async getPayoutStatistics(userId?: string) {
    const where = userId ? { userId } : {};

    const [total, pending, processing, completed, failed] = await Promise.all([
      prisma.payout.count({ where }),
      prisma.payout.count({ where: { ...where, status: 'PENDING' } }),
      prisma.payout.count({ where: { ...where, status: 'PROCESSING' } }),
      prisma.payout.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.payout.count({ where: { ...where, status: 'FAILED' } })
    ]);

    const totalAmount = await prisma.payout.aggregate({
      where: { ...where, status: 'COMPLETED' },
      _sum: { amount: true }
    });

    return {
      total,
      pending,
      processing,
      completed,
      failed,
      totalProcessed: Number(totalAmount._sum.amount || 0)
    };
  }

  // Validate payout request
  static async validatePayoutRequest(userId: string, amount: number) {
    const author = await prisma.authorProfile.findUnique({
      where: { userId }
    });

    const reseller = await prisma.resellerProfile.findUnique({
      where: { userId }
    });

    const profile = author || reseller;

    if (!profile) {
      throw new Error('Profile not found');
    }

    if (Number(profile.availableBalance) < amount) {
      throw new Error('Insufficient balance');
    }

    if (amount < PAYOUT_CONFIG.MINIMUM_AMOUNT) {
      throw new Error(`Minimum payout is $${PAYOUT_CONFIG.MINIMUM_AMOUNT}`);
    }

    // Check for pending payouts
    const pendingPayouts = await prisma.payout.findMany({
      where: { userId, status: { in: ['PENDING', 'PROCESSING'] } }
    });

    if (pendingPayouts.length > 0) {
      throw new Error('You have pending payouts. Wait for them to process.');
    }

    return true;
  }
}
