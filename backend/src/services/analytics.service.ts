import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  // Aggregate author analytics daily
  static async aggregateAuthorAnalytics() {
    const authors = await prisma.authorProfile.findMany();

    for (const author of authors) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate today's revenue
      const todayRevenue = await prisma.orderItem.aggregate({
        _sum: { total: true },
        where: {
          product: { authorId: author.id },
          order: { status: 'COMPLETED', createdAt: { gte: today } }
        }
      });

      // Calculate today's sales
      const todaySales = await prisma.orderItem.aggregate({
        _sum: { quantity: true },
        where: {
          product: { authorId: author.id },
          order: { status: 'COMPLETED', createdAt: { gte: today } }
        }
      });

      // Upsert analytics records
      await prisma.authorAnalytics.upsert({
        where: {
          authorId_date_metric: {
            authorId: author.id,
            date: today,
            metric: 'revenue'
          }
        },
        update: { value: Number(todayRevenue._sum.total || 0) },
        create: {
          authorId: author.id,
          date: today,
          metric: 'revenue',
          value: Number(todayRevenue._sum.total || 0)
        }
      });

      await prisma.authorAnalytics.upsert({
        where: {
          authorId_date_metric: {
            authorId: author.id,
            date: today,
            metric: 'sales'
          }
        },
        update: { value: Number(todaySales._sum.quantity || 0) },
        create: {
          authorId: author.id,
          date: today,
          metric: 'sales',
          value: Number(todaySales._sum.quantity || 0)
        }
      });
    }
  }

  // Aggregate reseller analytics daily
  static async aggregateResellerAnalytics() {
    const resellers = await prisma.resellerProfile.findMany();

    for (const reseller of resellers) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate today's commissions
      const todayCommissions = await prisma.commission.aggregate({
        _sum: { amount: true },
        where: {
          resellerId: reseller.id,
          status: 'APPROVED',
          createdAt: { gte: today }
        }
      });

      // Calculate today's referrals
      const todayReferrals = await prisma.referral.count({
        where: {
          referrerId: reseller.userId,
          createdAt: { gte: today }
        }
      });

      // Upsert analytics records
      await prisma.resellerAnalytics.upsert({
        where: {
          resellerId_date_metric: {
            resellerId: reseller.id,
            date: today,
            metric: 'commissions'
          }
        },
        update: { value: Number(todayCommissions._sum.amount || 0) },
        create: {
          resellerId: reseller.id,
          date: today,
          metric: 'commissions',
          value: Number(todayCommissions._sum.amount || 0)
        }
      });

      await prisma.resellerAnalytics.upsert({
        where: {
          resellerId_date_metric: {
            resellerId: reseller.id,
            date: today,
            metric: 'referrals'
          }
        },
        update: { value: todayReferrals },
        create: {
          resellerId: reseller.id,
          date: today,
          metric: 'referrals',
          value: todayReferrals
        }
      });
    }
  }

  // Get author analytics summary
  static async getAuthorAnalyticsSummary(authorId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await prisma.authorAnalytics.findMany({
      where: {
        authorId,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    });

    const revenueData = analytics.filter(a => a.metric === 'revenue');
    const salesData = analytics.filter(a => a.metric === 'sales');

    const totalRevenue = revenueData.reduce((sum, a) => sum + Number(a.value), 0);
    const totalSales = salesData.reduce((sum, a) => sum + Number(a.value), 0);
    const avgDailyRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

    return {
      totalRevenue,
      totalSales,
      avgDailyRevenue,
      dailyRevenue: revenueData.map(a => ({ date: a.date, value: Number(a.value) })),
      dailySales: salesData.map(a => ({ date: a.date, value: Number(a.value) }))
    };
  }

  // Get reseller analytics summary
  static async getResellerAnalyticsSummary(resellerId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await prisma.resellerAnalytics.findMany({
      where: {
        resellerId,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    });

    const commissionData = analytics.filter(a => a.metric === 'commissions');
    const referralData = analytics.filter(a => a.metric === 'referrals');

    const totalCommissions = commissionData.reduce((sum, a) => sum + Number(a.value), 0);
    const totalReferrals = referralData.reduce((sum, a) => sum + Number(a.value), 0);
    const avgDailyCommissions = commissionData.length > 0 ? totalCommissions / commissionData.length : 0;

    return {
      totalCommissions,
      totalReferrals,
      avgDailyCommissions,
      dailyCommissions: commissionData.map(a => ({ date: a.date, value: Number(a.value) })),
      dailyReferrals: referralData.map(a => ({ date: a.date, value: Number(a.value) }))
    };
  }

  // Recalculate all analytics (for fixing data)
  static async recalculateAllAnalytics() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90); // Last 90 days

    // Clear old analytics
    await prisma.authorAnalytics.deleteMany({
      where: { date: { gte: startDate } }
    });

    await prisma.resellerAnalytics.deleteMany({
      where: { date: { gte: startDate } }
    });

    // Recalculate day by day
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      // Author analytics
      const authors = await prisma.authorProfile.findMany();
      for (const author of authors) {
        const revenue = await prisma.orderItem.aggregate({
          _sum: { total: true },
          where: {
            product: { authorId: author.id },
            order: { status: 'COMPLETED', createdAt: { gte: date, lt: nextDay } }
          }
        });

        const sales = await prisma.orderItem.aggregate({
          _sum: { quantity: true },
          where: {
            product: { authorId: author.id },
            order: { status: 'COMPLETED', createdAt: { gte: date, lt: nextDay } }
          }
        });

        if (Number(revenue._sum.total || 0) > 0) {
          await prisma.authorAnalytics.create({
            data: {
              authorId: author.id,
              date,
              metric: 'revenue',
              value: Number(revenue._sum.total)
            }
          });
        }

        if (Number(sales._sum.quantity || 0) > 0) {
          await prisma.authorAnalytics.create({
            data: {
              authorId: author.id,
              date,
              metric: 'sales',
              value: Number(sales._sum.quantity)
            }
          });
        }
      }

      // Reseller analytics
      const resellers = await prisma.resellerProfile.findMany();
      for (const reseller of resellers) {
        const commissions = await prisma.commission.aggregate({
          _sum: { amount: true },
          where: {
            resellerId: reseller.id,
            status: 'APPROVED',
            createdAt: { gte: date, lt: nextDay }
          }
        });

        const referrals = await prisma.referral.count({
          where: {
            referrerId: reseller.userId,
            createdAt: { gte: date, lt: nextDay }
          }
        });

        if (Number(commissions._sum.amount || 0) > 0) {
          await prisma.resellerAnalytics.create({
            data: {
              resellerId: reseller.id,
              date,
              metric: 'commissions',
              value: Number(commissions._sum.amount)
            }
          });
        }

        if (referrals > 0) {
          await prisma.resellerAnalytics.create({
            data: {
              resellerId: reseller.id,
              date,
              metric: 'referrals',
              value: referrals
            }
          });
        }
      }
    }
  }
}
