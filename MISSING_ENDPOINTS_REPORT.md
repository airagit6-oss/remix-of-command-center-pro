# MISSING ENDPOINTS REPORT
## PHASE 01: Forensic API Scan - Missing Backend Routes

**Date:** 2026-05-25
**Status:** CRITICAL ISSUES FOUND

---

## 1. CRITICAL: MISSING BACKEND ROUTES

### 1.1 `/admin/infrastructure` - MISSING
**Frontend Call:** `InfrastructurePage.tsx`
```typescript
const response = await fetch(`${API_BASE}/admin/infrastructure`, {
```
**Backend Status:** Route does not exist
**Impact:** Infrastructure page will fail
**Priority:** HIGH
**Required Action:** Create endpoint in `adminRoutes.ts`

**Suggested Implementation:**
```typescript
router.get('/infrastructure', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    // Return infrastructure metrics
    const infrastructure = {
      servers: await prisma.server.findMany(),
      databases: await prisma.database.findMany(),
      loadBalancers: await prisma.loadBalancer.findMany(),
      cdn: await prisma.cdnEdge.findMany(),
    };
    res.json(infrastructure);
  } catch (error) {
    console.error('Error fetching infrastructure:', error);
    res.status(500).json({ error: 'Failed to fetch infrastructure' });
  }
});
```

---

## 2. ROUTE MISMATCHES

### 2.1 `/admin/alerts` vs `/observability/alerts`
**Frontend Call:** `AlertsPage.tsx`
```typescript
const response = await fetch(`${API_BASE}/admin/alerts`, {
```
**Backend Route:** `/observability/alerts` (in `observabilityRoutes.ts`)
**Impact:** Alerts page will fail (404)
**Priority:** HIGH
**Required Action:** Either:
- Option A: Update frontend to call `/observability/alerts`
- Option B: Create alias route in `adminRoutes.ts` that proxies to observability

**Suggested Fix (Option B - Proxy):**
```typescript
router.get('/alerts', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const activeAlerts = alertManager.getActiveAlerts();
    const alertHistory = alertManager.getAlertHistory(100);
    res.json({ activeAlerts, alertHistory });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});
```

### 2.2 `/billing/checkout` vs `/billing/checkout/session`
**Frontend Call:** `CheckoutPage.tsx`
```typescript
const response = await fetch(`${API_BASE}/billing/checkout`, {
```
**Backend Route:** `/billing/checkout/session` (in `billingRoutes.ts`)
**Impact:** Checkout will fail (404)
**Priority:** HIGH
**Required Action:** Either:
- Option A: Update frontend to call `/billing/checkout/session`
- Option B: Create alias route

**Suggested Fix (Option A - Update Frontend):**
```typescript
const response = await fetch(`${API_BASE}/billing/checkout/session`, {
```

---

## 3. POTENTIAL MISSING ENDPOINTS

### 3.1 `/admin/logs` - Needs Verification
**Frontend Call:** `LogsPage.tsx`
```typescript
const response = await fetch(`${API_BASE}/admin/logs`, {
```
**Backend Status:** EXISTS in `adminRoutes.ts`
**Status:** ✅ VERIFIED - Route exists

### 3.2 `/reports/revenue` - Needs Verification
**Frontend Call:** `RevenuePage.tsx`
```typescript
fetch(`${API_BASE}/reports/revenue`, { credentials: 'include' }),
```
**Backend Status:** EXISTS in `reportRoutes.ts`
**Status:** ✅ VERIFIED - Route exists

### 3.3 `/reports/subscriptions` - Needs Verification
**Frontend Call:** `RevenuePage.tsx`
```typescript
fetch(`${API_BASE}/reports/subscriptions`, { credentials: 'include' }),
```
**Backend Status:** EXISTS in `reportRoutes.ts`
**Status:** ✅ VERIFIED - Route exists

### 3.4 `/reports/payouts` - Needs Verification
**Frontend Call:** `ResellerEarningsPage.tsx`
```typescript
fetch(`${API_BASE}/reports/payouts`, { credentials: 'include' }),
```
**Backend Status:** EXISTS in `reportRoutes.ts`
**Status:** ✅ VERIFIED - Route exists

### 3.5 `/reports/sales` - Needs Verification
**Frontend Call:** `ResellerEarningsPage.tsx`
```typescript
fetch(`${API_BASE}/reports/sales`, { credentials: 'include' }),
```
**Backend Status:** EXISTS in `reportRoutes.ts`
**Status:** ✅ VERIFIED - Route exists

---

## 4. LOCALSTORAGE-BASED ENDPOINTS (NEED BACKEND MIGRATION)

### 4.1 User Settings
**Current:** localStorage fallback in `SettingsPage.tsx`
**Backend Status:** ✅ EXISTS - `/user/settings`
**Required Action:** Remove localStorage fallback, use backend only

### 4.2 Audit Logs
**Current:** localStorage in `auditLog.ts`
**Backend Status:** ✅ EXISTS - `/governance/audit`
**Required Action:** Migrate to backend API

### 4.3 Feature Flags
**Current:** localStorage in `featureFlags.ts`
**Backend Status:** ❌ MISSING - Need `/admin/feature-flags` endpoint
**Priority:** MEDIUM
**Required Action:** Create feature flags backend endpoint

### 4.4 Notifications
**Current:** localStorage in `notifications.ts`
**Backend Status:** ✅ EXISTS - `/communication/notifications`
**Required Action:** Migrate to backend API

### 4.5 Storage/Media
**Current:** localStorage in `storage.ts`
**Backend Status:** ✅ EXISTS - `/media`
**Required Action:** Migrate to backend API

### 4.6 Search
**Current:** localStorage fallback in `search.ts`
**Backend Status:** ✅ EXISTS - `/search`
**Required Action:** Remove localStorage fallback

---

## 5. MISSING WRITE ENDPOINTS

### 5.1 Product Write Operations (Admin)
**Current:** AdminProductsPage uses localStorage productStore
**Backend Status:** ✅ EXISTS - `/admin/products` (POST, PATCH, DELETE)
**Required Action:** Wire AdminProductsPage to backend APIs

### 5.2 Category Write Operations
**Backend Status:** ✅ EXISTS - `/admin/categories` (POST)
**Frontend Status:** Needs verification

---

## 6. SUMMARY TABLE

| Endpoint | Frontend | Backend | Status | Priority |
|----------|----------|---------|--------|----------|
| `/admin/infrastructure` | ✅ | ❌ | MISSING | HIGH |
| `/admin/alerts` | ✅ | ❌ (wrong path) | MISMATCH | HIGH |
| `/billing/checkout` | ✅ | ❌ (wrong path) | MISMATCH | HIGH |
| `/admin/feature-flags` | ❌ | ❌ | MISSING | MEDIUM |
| `/admin/logs` | ✅ | ✅ | OK | - |
| `/reports/revenue` | ✅ | ✅ | OK | - |
| `/reports/subscriptions` | ✅ | ✅ | OK | - |
| `/reports/payouts` | ✅ | ✅ | OK | - |
| `/reports/sales` | ✅ | ✅ | OK | - |
| `/user/settings` | ✅ | ✅ | OK | - |
| `/governance/audit` | ❌ | ✅ | NEED FRONTEND | MEDIUM |
| `/communication/notifications` | ❌ | ✅ | NEED FRONTEND | MEDIUM |
| `/media` | ❌ | ✅ | NEED FRONTEND | MEDIUM |
| `/search` | ❌ | ✅ | NEED FRONTEND | MEDIUM |

---

## 7. IMMEDIATE ACTION ITEMS

### Priority 1 (Critical - Blockers):
1. **Create `/admin/infrastructure` endpoint** in `adminRoutes.ts`
2. **Fix `/admin/alerts` route mismatch** - create proxy or update frontend
3. **Fix `/billing/checkout` route mismatch** - update frontend to `/billing/checkout/session`

### Priority 2 (High - Data Integrity):
4. **Create `/admin/feature-flags` endpoint** for feature flag management
5. **Migrate audit logs from localStorage** to `/governance/audit`
6. **Migrate notifications from localStorage** to `/communication/notifications`
7. **Migrate storage from localStorage** to `/media`

### Priority 3 (Medium - Cleanup):
8. **Remove localStorage fallback** from search.ts
9. **Remove localStorage fallback** from SettingsPage.tsx
10. **Wire AdminProductsPage** to backend write APIs

---

## 8. ROUTE FILE INVENTORY

### Existing Route Files:
- ✅ adminRoutes.ts
- ✅ aiRoutes.ts
- ✅ analyticsRoutes.ts
- ✅ authRoutes.ts
- ✅ authorRoutes.ts
- ✅ billingRoutes.ts
- ✅ communicationRoutes.ts
- ✅ gdprRoutes.ts
- ✅ governanceRoutes.ts
- ✅ healthRoutes.ts
- ✅ marketplaceRoutes.ts
- ✅ mediaRoutes.ts
- ✅ observabilityRoutes.ts
- ✅ paymentRoutes.ts
- ✅ rbacRoutes.ts
- ✅ reportRoutes.ts
- ✅ resellerRoutes.ts
- ✅ searchRoutes.ts
- ✅ securityRoutes.ts
- ✅ userRoutes.ts
- ✅ webhookRoutes.ts

### Total Routes: 22 route files
### Total Endpoints: ~100+ endpoints

---

**Report Generated:** 2026-05-25
**Next Step:** Fix critical missing endpoints before PHASE 02
