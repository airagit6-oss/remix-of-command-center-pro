import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import { authorRoutes } from './routes/author.routes';
import { resellerRoutes } from './routes/reseller.routes';
import { authRoutes } from './routes/auth.routes';
import { orderRoutes } from './routes/order.routes';
import { cartRoutes } from './routes/cart.routes';
import { paymentRoutes } from './routes/payment.routes';
import { licenseRoutes } from './routes/license.routes';
import { licenseProtectionRoutes } from './routes/license.protection.routes';
import { invoiceRoutes } from './routes/invoice.routes';
import { subscriptionRoutes } from './routes/subscription.routes';
import { kycRoutes } from './routes/kyc.routes';
import { uploadRoutes } from './routes/upload.routes';
import { productRoutes } from './routes/product.routes';
import { categoryRoutes } from './routes/category.routes';
import { reviewRoutes } from './routes/review.routes';
import { commentRoutes } from './routes/comment.routes';
import { wishlistRoutes } from './routes/wishlist.routes';
import { securityRoutes } from './routes/security.routes';
import { walletRoutes } from './routes/wallet.routes';
import { notificationRoutes } from './routes/notification.routes';
import { activityTimelineRoutes } from './routes/activity.timeline.routes';
import { commandCenterRoutes } from './routes/command.center.routes';
import { renewalEngineRoutes } from './routes/renewal.engine.routes';
import { downloadSecurityRoutes } from './routes/download.security.routes';
import { operationsCenterRoutes } from './routes/operations.center.routes';
import { featureFlagRoutes } from './routes/feature.flag.routes';
import { queueEngineRoutes } from './routes/queue.engine.routes';
import { jobSchedulerRoutes } from './routes/job.scheduler.routes';
import { eventBusRoutes } from './routes/event.bus.routes';
import { customFieldsRoutes } from './routes/custom.fields.routes';
import { formBuilderRoutes } from './routes/form.builder.routes';
import { systemHealthRoutes } from './routes/system.health.routes';
import { configCenterRoutes } from './routes/config.center.routes';
import { crmEngineRoutes } from './routes/crm.engine.routes';
import { supportEcosystemRoutes } from './routes/support.ecosystem.routes';
import { automationPlatformRoutes } from './routes/automation.platform.routes';
import { financeOSRoutes } from './routes/finance.os.routes';
import { productApprovalRoutes } from './routes/product.approval.routes';
import { digitalAssetProtectionRoutes } from './routes/digital.asset.protection.routes';
import { productHealthCenterRoutes } from './routes/product.health.center.routes';
import { customerSuccessCenterRoutes } from './routes/customer.success.center.routes';
import { partnerOSRoutes } from './routes/partner.os.routes';
import { enterpriseCommissionEngineRoutes } from './routes/enterprise.commission.engine.routes';
import { renewalCommissionCenterRoutes } from './routes/renewal.commission.center.routes';
import { b2bSalesCenterRoutes } from './routes/b2b.sales.center.routes';
import { authenticate, requireRole } from './middleware/auth.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimitOptions, strictRateLimitOptions } from './middleware/rate-limit.middleware';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*'
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

// Register rate limiting
fastify.register(import('@fastify/rate-limit'), rateLimitOptions);

// Set error handlers
fastify.setErrorHandler(errorHandler);
fastify.setNotFoundHandler(notFoundHandler);

// Decorate request with authenticate and requireRole
fastify.decorate('authenticate', authenticate);
fastify.decorate('requireRole', requireRole);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/v1' });
fastify.register(authorRoutes, { prefix: '/api/v1' });
fastify.register(resellerRoutes, { prefix: '/api/v1' });
fastify.register(orderRoutes, { prefix: '/api/v1' });
fastify.register(cartRoutes, { prefix: '/api/v1' });
fastify.register(paymentRoutes, { prefix: '/api/v1' });
fastify.register(licenseRoutes, { prefix: '/api/v1' });
fastify.register(licenseProtectionRoutes, { prefix: '/api/v1' });
fastify.register(invoiceRoutes, { prefix: '/api/v1' });
fastify.register(subscriptionRoutes, { prefix: '/api/v1' });
fastify.register(kycRoutes, { prefix: '/api/v1' });
fastify.register(uploadRoutes, { prefix: '/api/v1' });
fastify.register(productRoutes, { prefix: '/api/v1' });
fastify.register(categoryRoutes, { prefix: '/api/v1' });
fastify.register(reviewRoutes, { prefix: '/api/v1' });
fastify.register(commentRoutes, { prefix: '/api/v1' });
fastify.register(wishlistRoutes, { prefix: '/api/v1' });
fastify.register(securityRoutes, { prefix: '/api/v1' });
fastify.register(walletRoutes, { prefix: '/api/v1' });
fastify.register(notificationRoutes, { prefix: '/api/v1' });
fastify.register(activityTimelineRoutes, { prefix: '/api/v1' });
fastify.register(commandCenterRoutes, { prefix: '/api/v1' });
fastify.register(renewalEngineRoutes, { prefix: '/api/v1' });
fastify.register(downloadSecurityRoutes, { prefix: '/api/v1' });
fastify.register(operationsCenterRoutes, { prefix: '/api/v1' });
fastify.register(featureFlagRoutes, { prefix: '/api/v1' });
fastify.register(queueEngineRoutes, { prefix: '/api/v1' });
fastify.register(jobSchedulerRoutes, { prefix: '/api/v1' });
fastify.register(eventBusRoutes, { prefix: '/api/v1' });
fastify.register(customFieldsRoutes, { prefix: '/api/v1' });
fastify.register(formBuilderRoutes, { prefix: '/api/v1' });
fastify.register(systemHealthRoutes, { prefix: '/api/v1' });
fastify.register(configCenterRoutes, { prefix: '/api/v1' });
fastify.register(crmEngineRoutes, { prefix: '/api/v1' });
fastify.register(supportEcosystemRoutes, { prefix: '/api/v1' });
fastify.register(automationPlatformRoutes, { prefix: '/api/v1' });
fastify.register(financeOSRoutes, { prefix: '/api/v1' });
fastify.register(productApprovalRoutes, { prefix: '/api/v1' });
fastify.register(digitalAssetProtectionRoutes, { prefix: '/api/v1' });
fastify.register(productHealthCenterRoutes, { prefix: '/api/v1' });
fastify.register(customerSuccessCenterRoutes, { prefix: '/api/v1' });
fastify.register(partnerOSRoutes, { prefix: '/api/v1' });
fastify.register(enterpriseCommissionEngineRoutes, { prefix: '/api/v1' });
fastify.register(renewalCommissionCenterRoutes, { prefix: '/api/v1' });
fastify.register(b2bSalesCenterRoutes, { prefix: '/api/v1' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();
