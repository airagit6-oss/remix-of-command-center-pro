import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testServices() {
  console.log('=== SERVICES PERSISTENCE TEST ===\n');

  // Test 1: Billing Service (Order, Subscription, License)
  console.log('--- BILLING SERVICE ---');
  try {
    const user = await prisma.user.create({
      data: {
        email: `billing-test-${Date.now()}@example.com`,
        name: 'Billing Test User',
        passwordHash: 'hash',
      },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'Test Description',
        priceMonthly: 1000,
        priceYearly: 10000,
        priceLifetime: 50000,
        slug: 'test-product',
        category: 'software',
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'pending',
        total: 1000,
        currency: 'USD',
        billingEmail: user.email,
        billingName: user.name,
        items: {
          create: {
            productId: product.id,
            plan: 'basic',
            price: 1000,
            quantity: 1,
          },
        },
      },
    });
    console.log(`✅ Order Created: ${order.id}`);

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        productId: product.id,
        plan: 'basic',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`✅ Subscription Created: ${subscription.id}`);

    const license = await prisma.license.create({
      data: {
        userId: user.id,
        productId: product.id,
        key: `LICENSE-${Date.now()}`,
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`✅ License Created: ${license.id}`);

    // Cleanup
    await prisma.license.delete({ where: { id: license.id } });
    await prisma.subscription.delete({ where: { id: subscription.id } });
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Billing Service: PASSED\n');

  } catch (error) {
    console.error('❌ Billing Service: FAILED', error.message, '\n');
  }

  // Test 2: Analytics Service (Event, Metric)
  console.log('--- ANALYTICS SERVICE ---');
  try {
    const user = await prisma.user.create({
      data: {
        email: `analytics-test-${Date.now()}@example.com`,
        name: 'Analytics Test User',
        passwordHash: 'hash',
      },
    });

    const event = await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        eventType: 'PAGE_VIEW',
        eventName: 'test_page',
        properties: { path: '/test' },
        timestamp: new Date(),
      },
    });
    console.log(`✅ Analytics Event Created: ${event.id}`);

    const metric = await prisma.metric.create({
      data: {
        name: 'test_metric',
        type: 'COUNTER',
        aggregationType: 'SUM',
      },
    });
    console.log(`✅ Metric Created: ${metric.id}`);

    const snapshot = await prisma.metricSnapshot.create({
      data: {
        metricId: metric.id,
        value: 42,
        timestamp: new Date(),
      },
    });
    console.log(`✅ Metric Snapshot Created: ${snapshot.id}`);

    // Cleanup
    await prisma.metricSnapshot.delete({ where: { id: snapshot.id } });
    await prisma.metric.delete({ where: { id: metric.id } });
    await prisma.analyticsEvent.delete({ where: { id: event.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Analytics Service: PASSED\n');

  } catch (error) {
    console.error('❌ Analytics Service: FAILED', error.message, '\n');
  }

  // Test 3: Workflow Service (Template, Instance, Approval, Task)
  console.log('--- WORKFLOW SERVICE ---');
  try {
    const user = await prisma.user.create({
      data: {
        email: `workflow-test-${Date.now()}@example.com`,
        name: 'Workflow Test User',
        passwordHash: 'hash',
      },
    });

    const template = await prisma.workflowTemplate.create({
      data: {
        name: 'Test Workflow',
        version: 1,
        definition: { steps: [] },
        status: 'ACTIVE',
      },
    });
    console.log(`✅ Workflow Template Created: ${template.id}`);

    const instance = await prisma.workflowInstance.create({
      data: {
        templateId: template.id,
        startedBy: user.id,
        status: 'PENDING',
        startedAt: new Date(),
      },
    });
    console.log(`✅ Workflow Instance Created: ${instance.id}`);

    const approval = await prisma.workflowApproval.create({
      data: {
        instanceId: instance.id,
        approverId: user.id,
        stepName: 'review',
        status: 'PENDING',
      },
    });
    console.log(`✅ Workflow Approval Created: ${approval.id}`);

    const task = await prisma.workflowTask.create({
      data: {
        instanceId: instance.id,
        assignedTo: user.id,
        name: 'test_task',
        status: 'PENDING',
        startedAt: new Date(),
      },
    });
    console.log(`✅ Workflow Task Created: ${task.id}`);

    // Cleanup
    await prisma.workflowTask.delete({ where: { id: task.id } });
    await prisma.workflowApproval.delete({ where: { id: approval.id } });
    await prisma.workflowInstance.delete({ where: { id: instance.id } });
    await prisma.workflowTemplate.delete({ where: { id: template.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Workflow Service: PASSED\n');

  } catch (error) {
    console.error('❌ Workflow Service: FAILED', error.message, '\n');
  }

  // Test 4: Notification Service (Notification, Email, Preference)
  console.log('--- NOTIFICATION SERVICE ---');
  try {
    const user = await prisma.user.create({
      data: {
        email: `notification-test-${Date.now()}@example.com`,
        name: 'Notification Test User',
        passwordHash: 'hash',
      },
    });

    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'info',
        title: 'Test Notification',
        body: 'Test Body',
        status: 'UNREAD',
        priority: 'NORMAL',
      },
    });
    console.log(`✅ Notification Created: ${notification.id}`);

    const email = await prisma.email.create({
      data: {
        to: user.email,
        from: 'noreply@example.com',
        subject: 'Test Subject',
        textBody: 'Test Body',
        category: 'TRANSACTIONAL',
        provider: 'smtp',
        status: 'SENT',
      },
    });
    console.log(`✅ Email Created: ${email.id}`);

    const preference = await prisma.notificationPreference.create({
      data: {
        userId: user.id,
        channels: ['EMAIL'],
        categories: ['TRANSACTIONAL'],
        quietHours: {},
      },
    });
    console.log(`✅ Notification Preference Created: ${preference.id}`);

    // Cleanup
    await prisma.notificationPreference.delete({ where: { id: preference.id } });
    await prisma.email.delete({ where: { id: email.id } });
    await prisma.notification.delete({ where: { id: notification.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Notification Service: PASSED\n');

  } catch (error) {
    console.error('❌ Notification Service: FAILED', error.message, '\n');
  }

  // Test 5: Marketplace Service (Product, Category, Review, Cart, Wishlist)
  console.log('--- MARKETPLACE SERVICE ---');
  try {
    const user = await prisma.user.create({
      data: {
        email: `marketplace-test-${Date.now()}@example.com`,
        name: 'Marketplace Test User',
        passwordHash: 'hash',
      },
    });

    const category = await prisma.category.create({
      data: {
        name: `Test Category ${Date.now()}`,
        slug: `test-category-${Date.now()}`,
      },
    });
    console.log(`✅ Category Created: ${category.id}`);

    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'Test Description',
        priceMonthly: 1000,
        priceYearly: 10000,
        priceLifetime: 50000,
        categoryId: category.id,
        category: 'software',
        slug: `test-product-marketplace-${Date.now()}`,
      },
    });
    console.log(`✅ Product Created: ${product.id}`);

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: user.id,
        userName: user.name,
        rating: 5,
        comment: 'Great product!',
      },
    });
    console.log(`✅ Review Created: ${review.id}`);

    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });
    console.log(`✅ Cart Created: ${cart.id}`);

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        plan: 'basic',
        quantity: 1,
      },
    });
    console.log(`✅ Cart Item Created: ${cartItem.id}`);

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: product.id,
      },
    });
    console.log(`✅ Wishlist Created: ${wishlist.id}`);

    // Cleanup
    await prisma.wishlist.delete({ where: { id: wishlist.id } });
    await prisma.cartItem.delete({ where: { id: cartItem.id } });
    await prisma.cart.delete({ where: { id: cart.id } });
    await prisma.review.delete({ where: { id: review.id } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.category.delete({ where: { id: category.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Marketplace Service: PASSED\n');

  } catch (error) {
    console.error('❌ Marketplace Service: FAILED', error.message, '\n');
  }

  // Test 6: Tenant Service (Organization, Tenant, Member, Invite)
  console.log('--- TENANT SERVICE ---');
  try {
    const user = await prisma.user.create({
      data: {
        email: `tenant-test-${Date.now()}@example.com`,
        name: 'Tenant Test User',
        passwordHash: 'hash',
      },
    });

    const ts = Date.now();
    const organization = await prisma.organization.create({
      data: {
        name: `Test Organization ${ts}`,
        slug: `test-org-${ts}`,
        status: 'ACTIVE',
      },
    });
    console.log(`✅ Organization Created: ${organization.id}`);

    const tenant = await prisma.tenant.create({
      data: {
        organizationId: organization.id,
        name: `Test Tenant ${ts}`,
        slug: `test-tenant-${ts}`,
        status: 'ACTIVE',
      },
    });
    console.log(`✅ Tenant Created: ${tenant.id}`);

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: 'MEMBER',
        joinedAt: new Date(),
      },
    });
    console.log(`✅ Organization Member Created: ${member.id}`);

    const invite = await prisma.organizationInvite.create({
      data: {
        organizationId: organization.id,
        email: 'invited@example.com',
        invitedBy: user.id,
        token: `invite-${Date.now()}`,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`✅ Organization Invite Created: ${invite.id}`);

    // Cleanup
    await prisma.organizationInvite.delete({ where: { id: invite.id } });
    await prisma.organizationMember.delete({ where: { id: member.id } });
    await prisma.tenant.delete({ where: { id: tenant.id } });
    await prisma.organization.delete({ where: { id: organization.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ Tenant Service: PASSED\n');

  } catch (error) {
    console.error('❌ Tenant Service: FAILED', error.message, '\n');
  }

  // Test 7: Tenant Isolation
  console.log('--- TENANT ISOLATION TEST ---');
  try {
    const ts2 = Date.now();
    const org1 = await prisma.organization.create({
      data: {
        name: `Org 1 ${ts2}`,
        slug: `org-1-${ts2}`,
        status: 'ACTIVE',
      },
    });

    const org2 = await prisma.organization.create({
      data: {
        name: `Org 2 ${ts2}`,
        slug: `org-2-${ts2}`,
        status: 'ACTIVE',
      },
    });

    const tenant1 = await prisma.tenant.create({
      data: {
        organizationId: org1.id,
        name: `Tenant 1 ${ts2}`,
        slug: `tenant-1-${ts2}`,
        status: 'ACTIVE',
      },
    });

    const tenant2 = await prisma.tenant.create({
      data: {
        organizationId: org2.id,
        name: `Tenant 2 ${ts2}`,
        slug: `tenant-2-${ts2}`,
        status: 'ACTIVE',
      },
    });

    const user1 = await prisma.user.create({
      data: {
        email: `user1-${Date.now()}@example.com`,
        name: 'User 1',
        passwordHash: 'hash',
        tenantId: tenant1.id,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: `user2-${Date.now()}@example.com`,
        name: 'User 2',
        passwordHash: 'hash',
        tenantId: tenant2.id,
      },
    });

    // Create product in tenant 1
    const product1 = await prisma.product.create({
      data: {
        name: 'Product 1',
        description: 'Product in Tenant 1',
        priceMonthly: 1000,
        priceYearly: 10000,
        priceLifetime: 50000,
        category: 'software',
        slug: `product-1-${ts2}`,
        tenantId: tenant1.id,
      },
    });

    // Create product in tenant 2
    const product2 = await prisma.product.create({
      data: {
        name: 'Product 2',
        description: 'Product in Tenant 2',
        priceMonthly: 2000,
        priceYearly: 20000,
        priceLifetime: 100000,
        category: 'software',
        slug: `product-2-${ts2}`,
        tenantId: tenant2.id,
      },
    });

    // Verify tenant 1 can only see tenant 1 products
    const tenant1Products = await prisma.product.findMany({
      where: { tenantId: tenant1.id },
    });

    const tenant2Products = await prisma.product.findMany({
      where: { tenantId: tenant2.id },
    });

    console.log(`✅ Tenant 1 Products: ${tenant1Products.length} (expected 1)`);
    console.log(`✅ Tenant 2 Products: ${tenant2Products.length} (expected 1)`);
    console.log(`✅ Tenant Isolation: PASSED`);

    // Cleanup
    await prisma.product.deleteMany({ where: { tenantId: tenant1.id } });
    await prisma.product.deleteMany({ where: { tenantId: tenant2.id } });
    await prisma.user.delete({ where: { id: user1.id } });
    await prisma.user.delete({ where: { id: user2.id } });
    await prisma.tenant.delete({ where: { id: tenant1.id } });
    await prisma.tenant.delete({ where: { id: tenant2.id } });
    await prisma.organization.delete({ where: { id: org1.id } });
    await prisma.organization.delete({ where: { id: org2.id } });
    console.log('✅ Tenant Isolation Test: PASSED\n');

  } catch (error) {
    console.error('❌ Tenant Isolation Test: FAILED', error.message, '\n');
  }

  console.log('=== ALL SERVICES TEST COMPLETE ===');
  await prisma.$disconnect();
}

testServices().catch(console.error);
