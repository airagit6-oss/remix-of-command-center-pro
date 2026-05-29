import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const authorPassword = await bcrypt.hash('author123', 10);
  const resellerPassword = await bcrypt.hash('reseller123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@softwarevala.net' },
    update: {},
    create: {
      email: 'admin@softwarevala.net',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true
    }
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@softwarevala.net' },
    update: {},
    create: {
      email: 'author@softwarevala.net',
      password: authorPassword,
      name: 'Author User',
      role: 'AUTHOR',
      isVerified: true
    }
  });

  const reseller = await prisma.user.upsert({
    where: { email: 'reseller@softwarevala.net' },
    update: {},
    create: {
      email: 'reseller@softwarevala.net',
      password: resellerPassword,
      name: 'Reseller User',
      role: 'RESELLER',
      isVerified: true
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@softwarevala.net' },
    update: {},
    create: {
      email: 'customer@softwarevala.net',
      password: customerPassword,
      name: 'Customer User',
      role: 'CUSTOMER',
      isVerified: true
    }
  });

  // Create author profile
  const authorProfile = await prisma.authorProfile.upsert({
    where: { userId: author.id },
    update: {},
    create: {
      userId: author.id,
      bio: 'Software developer and entrepreneur',
      website: 'https://softwarevala.net',
      isKYCVerified: true,
      totalRevenue: 50000,
      totalSales: 100,
      followers: 500,
      rating: 4.5,
      availableBalance: 25000,
      pendingBalance: 5000
    }
  });

  // Create reseller profile
  const resellerProfile = await prisma.resellerProfile.upsert({
    where: { userId: reseller.id },
    update: {},
    create: {
      userId: reseller.id,
      referralCode: 'RES2024',
      referralLink: 'http://localhost:3000/signup?ref=RES2024',
      totalReferrals: 50,
      totalLeads: 100,
      conversionRate: 25,
      totalCommissions: 10000,
      availableBalance: 5000,
      pendingBalance: 1000
    }
  });

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      authorId: authorProfile.id,
      name: 'Enterprise CRM System',
      description: 'Full-featured CRM for enterprise businesses',
      price: 299,
      status: 'PUBLISHED',
      media: [{ type: 'IMAGE', url: 'https://example.com/crm.jpg', alt: 'CRM Screenshot' }],
      tags: ['CRM', 'Enterprise', 'Business'],
      category: 'Business Software',
      sales: 50,
      revenue: 14950,
      rating: 4.5,
      reviews: 25,
      publishedAt: new Date()
    }
  });

  const product2 = await prisma.product.create({
    data: {
      authorId: authorProfile.id,
      name: 'Project Management Tool',
      description: 'Agile project management for teams',
      price: 199,
      status: 'PUBLISHED',
      media: [{ type: 'IMAGE', url: 'https://example.com/pm.jpg', alt: 'PM Screenshot' }],
      tags: ['Project Management', 'Agile', 'Teams'],
      category: 'Productivity',
      sales: 30,
      revenue: 5970,
      rating: 4.3,
      reviews: 15,
      publishedAt: new Date()
    }
  });

  // Create commission rules
  await prisma.commissionRule.create({
    data: {
      name: 'Referral Commission',
      type: 'REFERRAL',
      rate: 0.05,
      minAmount: 10,
      maxAmount: 1000,
      conditions: { minOrderValue: 50 },
      isActive: true
    }
  });

  await prisma.commissionRule.create({
    data: {
      name: 'Lead Conversion Commission',
      type: 'LEAD_CONVERSION',
      rate: 0.10,
      minAmount: 100,
      maxAmount: 5000,
      conditions: { leadValueMin: 1000 },
      isActive: true
    }
  });

  // Create sample order
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 299,
      status: 'COMPLETED',
      orderItems: {
        create: {
          productId: product1.id,
          quantity: 1,
          price: 299,
          total: 299
        }
      }
    }
  });

  // Create sample referral
  const referral = await prisma.referral.create({
    data: {
      referrerId: reseller.id,
      referredUserId: customer.id,
      code: 'RES2024',
      status: 'CONVERTED',
      commission: 14.95,
      orderId: order.id
    }
  });

  // Create sample commission
  await prisma.commission.create({
    data: {
      resellerId: resellerProfile.id,
      userId: reseller.id,
      referralId: referral.id,
      type: 'REFERRAL',
      amount: 14.95,
      rate: 0.05,
      status: 'APPROVED',
      processedAt: new Date()
    }
  });

  // Create sample payout
  await prisma.payout.create({
    data: {
      userId: author.id,
      amount: 1000,
      method: 'BANK_TRANSFER',
      status: 'COMPLETED',
      accountDetails: { bank: 'Chase', account: '****1234' },
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      transactionId: 'TXN-12345678'
    }
  });

  // Create sample analytics
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Use deterministic values based on date
    const dayValue = (30 - i) * 50 + 500;

    await prisma.authorAnalytics.create({
      data: {
        authorId: authorProfile.id,
        date,
        metric: 'revenue',
        value: dayValue
      }
    });

    await prisma.authorAnalytics.create({
      data: {
        authorId: authorProfile.id,
        date,
        metric: 'sales',
        value: Math.floor(dayValue / 100)
      }
    });

    await prisma.resellerAnalytics.create({
      data: {
        resellerId: resellerProfile.id,
        date,
        metric: 'commissions',
        value: Math.floor(dayValue * 0.1)
      }
    });

    await prisma.resellerAnalytics.create({
      data: {
        resellerId: resellerProfile.id,
        date,
        metric: 'referrals',
        value: i % 3
      }
    });
  }

  console.log('Seed completed successfully!');
  console.log('Users created:');
  console.log('  - admin@softwarevala.net / admin123');
  console.log('  - author@softwarevala.net / author123');
  console.log('  - reseller@softwarevala.net / reseller123');
  console.log('  - customer@softwarevala.net / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
