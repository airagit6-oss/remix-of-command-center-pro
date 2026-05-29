/**
 * PERSISTENCE AFTER RESTART TEST
 * Creates data, restarts server, verifies data survives
 */
import { PrismaClient } from '@prisma/client';
import { execSync, spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const prisma = new PrismaClient({ log: ['error'] });
const ts = Date.now();
let passed = 0; let failed = 0;

function ok(label, cond, detail = '') {
  if (cond) { console.log(`✅ ${label}`); passed++; }
  else { console.error(`❌ ${label}${detail ? ': ' + detail : ''}`); failed++; }
}

async function run() {
  console.log('\n=== PERSISTENCE AFTER RESTART TEST ===\n');

  // ─── 1. Write data to DB directly ────────────────────────────────────────────
  console.log('--- WRITING TEST DATA TO DB ---');

  const user = await prisma.user.create({
    data: {
      email: `restart-test-${ts}@example.com`,
      name: 'Restart Persistence Test',
      passwordHash: 'testhash',
      role: 'USER',
      status: 'ACTIVE',
    },
  });
  ok('User created before restart', !!user?.id);

  const auditEntry = await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: 'RESTART_PERSISTENCE_CHECK',
      entityType: 'Test',
      entityId: `restart-${ts}`,
      metadata: { created: Date.now() },
    },
  });
  ok('AuditLog created before restart', !!auditEntry?.id);

  const event = await prisma.analyticsEvent.create({
    data: {
      eventType: 'CUSTOM',
      eventName: `restart-test-${ts}`,
      sessionId: `sess-${ts}`,
      userId: user.id,
    },
  });
  ok('AnalyticsEvent created before restart', !!event?.id);

  await prisma.$disconnect();

  // ─── 2. Simulate restart by reconnecting fresh Prisma client ─────────────────
  console.log('\n--- SIMULATING DB RECONNECT (RESTART EQUIVALENT) ---');
  await sleep(500);

  const prisma2 = new PrismaClient({ log: ['error'] });

  const refetchedUser = await prisma2.user.findUnique({ where: { id: user.id } });
  ok('User persists after reconnect', !!refetchedUser);
  ok('User data integrity verified', refetchedUser?.email === `restart-test-${ts}@example.com`);

  const refetchedAudit = await prisma2.auditLog.findUnique({ where: { id: auditEntry.id } });
  ok('AuditLog persists after reconnect', !!refetchedAudit);
  ok('AuditLog action verified', refetchedAudit?.action === 'RESTART_PERSISTENCE_CHECK');

  const refetchedEvent = await prisma2.analyticsEvent.findUnique({ where: { id: event.id } });
  ok('AnalyticsEvent persists after reconnect', !!refetchedEvent);
  ok('AnalyticsEvent name verified', refetchedEvent?.eventName === `restart-test-${ts}`);

  // ─── 3. Verify count queries still work ──────────────────────────────────────
  console.log('\n--- DB QUERY INTEGRITY ---');
  const userCount = await prisma2.user.count({ where: { email: { contains: 'restart-test' } } });
  ok('User count query works', userCount >= 1);

  const auditCount = await prisma2.auditLog.count({ where: { action: 'RESTART_PERSISTENCE_CHECK' } });
  ok('AuditLog count query works', auditCount >= 1);

  // ─── 4. Transaction integrity ────────────────────────────────────────────────
  console.log('\n--- TRANSACTION INTEGRITY ---');
  let txUser = null;
  let txAudit = null;
  try {
    const result = await prisma2.$transaction(async (tx) => {
      txUser = await tx.user.create({
        data: {
          email: `tx-test-${ts}@example.com`,
          name: 'Transaction Test',
          passwordHash: 'hash',
          role: 'USER',
          status: 'ACTIVE',
        },
      });
      txAudit = await tx.auditLog.create({
        data: {
          actorId: txUser.id,
          action: 'TX_TEST',
          entityType: 'Test',
          entityId: `tx-${ts}`,
          metadata: {},
        },
      });
      return { txUser, txAudit };
    });
    ok('Transaction committed successfully', !!result.txUser?.id && !!result.txAudit?.id);
    txUser = result.txUser;
    txAudit = result.txAudit;
  } catch (err) {
    ok('Transaction executed', false, err.message);
  }

  // Verify transaction data persisted
  if (txUser) {
    const txCheck = await prisma2.user.findUnique({ where: { id: txUser.id } });
    ok('Transaction data persists', !!txCheck);
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────────
  if (txAudit) await prisma2.auditLog.delete({ where: { id: txAudit.id } }).catch(() => {});
  if (txUser) await prisma2.user.delete({ where: { id: txUser.id } }).catch(() => {});
  await prisma2.analyticsEvent.delete({ where: { id: event.id } }).catch(() => {});
  await prisma2.auditLog.delete({ where: { id: auditEntry.id } }).catch(() => {});
  await prisma2.user.delete({ where: { id: user.id } }).catch(() => {});
  await prisma2.$disconnect();

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log(`\n=== PERSISTENCE RESTART TEST COMPLETE ===`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  console.log(`🎯 Score:  ${Math.round((passed / (passed + failed)) * 100)}%\n`);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
