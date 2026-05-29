# UI → API TRACE MAP
## PHASE 01: Forensic API Scan - Complete Data Flow Analysis

**Date:** 2026-05-25
**Status:** COMPLETED

---

## 1. AUTHENTICATION FLOW

### Login Flow
```
LoginPage.tsx
  ↓ (useAuth hook)
AuthContext.tsx
  ↓ POST /auth/login
authRoutes.ts → authService.login()
  ↓ prisma.user.findUnique()
database (User model)
  ↓ JWT token generation
  ↓ Set secure cookie
  ↓ Return user + redirect
  ↓
AuthContext updates state
  ↓
Redirect to role-specific dashboard
```

### Registration Flow
```
LoginPage.tsx (register mode)
  ↓ POST /auth/register
authRoutes.ts → authService.register()
  ↓ prisma.user.create()
database (User model)
  ↓ prisma.userSettings.create()
database (UserSettings model)
  ↓ JWT token generation
  ↓
AuthContext updates state
  ↓
Redirect to dashboard
```

### Logout Flow
```
Any page → Logout button
  ↓ POST /auth/logout
authRoutes.ts → authService.logout()
  ↓ Clear session
  ↓ Clear secure cookie
  ↓
AuthContext clears state
  ↓
Redirect to login
```

---

## 2. ADMIN DASHBOARD FLOW

### Overview Page
```
OverviewPage.tsx
  ↓ GET /admin/overview
adminRoutes.ts
  ↓ prisma.user.count()
  ↓ prisma.product.count()
  ↓ prisma.order.count()
  ↓ prisma.order.aggregate()
database (User, Product, Order models)
  ↓
Return KPI data + recent orders
  ↓
OverviewPage displays metrics
  ↓
Websocket subscription (subscribeToAnalytics)
  ↓
Real-time metric updates
```

### Users Page
```
UsersPage.tsx
  ↓ GET /admin/users
adminRoutes.ts
  ↓ prisma.user.findMany()
database (User model)
  ↓
Return users list with pagination
  ↓
UsersPage displays table
  ↓
Filter/Sort operations
  ↓
PATCH /admin/users/:id (update user)
adminRoutes.ts
  ↓ prisma.user.update()
database (User model)
```

### Products Page (Admin)
```
AdminProductsPage.tsx
  ↓ GET /marketplace/products
marketplaceRoutes.ts
  ↓ prisma.product.findMany()
database (Product model)
  ↓
Return products list
  ↓
AdminProductsPage displays catalog
  ↓
POST /marketplace/products (create product)
marketplaceRoutes.ts
  ↓ prisma.product.create()
database (Product model)
  ↓
PATCH /marketplace/products/:id (update product)
marketplaceRoutes.ts
  ↓ prisma.product.update()
database (Product model)
  ↓
DELETE /marketplace/products/:id (delete product)
marketplaceRoutes.ts
  ↓ prisma.product.delete()
database (Product model)
```

### Metrics Page
```
MetricsPage.tsx
  ↓ GET /admin/metrics
adminRoutes.ts
  ↓ Generate time-series data (currently simulated)
  ↓
Return cpu, memory, network, io data
  ↓
MetricsPage displays charts
  ↓
Periodic refresh (30s interval)
```

### Orders Page (Admin)
```
AdminOrdersPage.tsx
  ↓ GET /admin/orders
adminRoutes.ts
  ↓ prisma.order.findMany()
database (Order model)
  ↓ prisma.orderItem.findMany()
database (OrderItem model)
  ↓
Return orders with items
  ↓
AdminOrdersPage displays orders
```

---

## 3. MARKETPLACE FLOW

### Product Detail Page
```
ProductPage.tsx
  ↓ GET /marketplace/products/:id
marketplaceRoutes.ts
  ↓ prisma.product.findUnique()
database (Product model)
  ↓ prisma.product.findMany() (related products)
database (Product model)
  ↓ prisma.review.findMany()
database (Review model)
  ↓
Return product + related + reviews
  ↓
ProductPage displays product details
  ↓
POST /marketplace/products/:id/reviews (submit review)
marketplaceRoutes.ts
  ↓ prisma.review.create()
database (Review model)
```

### Cart Flow
```
ProductPage → Add to Cart
  ↓ POST /marketplace/cart
marketplaceRoutes.ts
  ↓ prisma.cartItem.upsert()
database (CartItem model)
  ↓
GET /marketplace/cart
marketplaceRoutes.ts
  ↓ prisma.cart.findUnique()
database (Cart model)
  ↓ prisma.cartItem.findMany()
database (CartItem model)
  ↓
Return cart with items
  ↓
DELETE /marketplace/cart/:id (remove item)
marketplaceRoutes.ts
  ↓ prisma.cartItem.delete()
database (CartItem model)
```

### Checkout Flow
```
CheckoutPage.tsx
  ↓ POST /billing/checkout/session
billingRoutes.ts → billingService.createCheckoutSession()
  ↓ Stripe API call
  ↓ Create Stripe checkout session
  ↓
Return checkout URL
  ↓
Redirect to Stripe checkout
  ↓
Stripe webhook (POST /webhook/stripe)
webhookRoutes.ts → billingService.handleStripeWebhook()
  ↓ prisma.order.create()
database (Order model)
  ↓ prisma.orderItem.create()
database (OrderItem model)
  ↓ prisma.subscription.create()
database (Subscription model)
  ↓ prisma.license.create()
database (License model)
  ↓
Return success
```

### Wishlist Flow
```
ProductPage → Add to Wishlist
  ↓ POST /marketplace/wishlist
marketplaceRoutes.ts
  ↓ prisma.wishlist.upsert()
database (Wishlist model)
  ↓
GET /marketplace/wishlist
marketplaceRoutes.ts
  ↓ prisma.wishlist.findUnique()
database (Wishlist model)
  ↓
Return wishlist
```

---

## 4. RESELLER FLOW

### Reseller Dashboard
```
ResellerDashboardPage.tsx
  ↓ GET /reseller/dashboard
resellerRoutes.ts
  ↓ prisma.resellerProfile.findUnique()
database (ResellerProfile model)
  ↓ prisma.resellerClient.count()
database (ResellerClient model)
  ↓ prisma.resellerLead.count()
database (ResellerLead model)
  ↓ prisma.resellerEarning.aggregate()
database (ResellerEarning model)
  ↓
Return dashboard metrics
  ↓
ResellerDashboardPage displays stats
```

### Reseller Leads
```
ResellerDashboardPage → Leads tab
  ↓ GET /reseller/leads
resellerRoutes.ts
  ↓ prisma.resellerLead.findMany()
database (ResellerLead model)
  ↓
Return leads list
  ↓
POST /reseller/leads (create lead)
resellerRoutes.ts
  ↓ prisma.resellerLead.create()
database (ResellerLead model)
  ↓
PATCH /reseller/leads/:id (update lead)
resellerRoutes.ts
  ↓ prisma.resellerLead.update()
database (ResellerLead model)
```

### Reseller Clients
```
ResellerDashboardPage → Clients tab
  ↓ GET /reseller/clients
resellerRoutes.ts
  ↓ prisma.resellerClient.findMany()
database (ResellerClient model)
  ↓
Return clients list
  ↓
POST /reseller/clients (create client)
resellerRoutes.ts
  ↓ prisma.resellerClient.create()
database (ResellerClient model)
  ↓
PATCH /reseller/clients/:id (update client)
resellerRoutes.ts
  ↓ prisma.resellerClient.update()
database (ResellerClient model)
```

### Reseller Earnings
```
ResellerEarningsPage.tsx
  ↓ GET /reports/payouts
reportRoutes.ts
  ↓ prisma.payout.findMany()
database (Payout model)
  ↓
Return payouts list
  ↓
GET /reports/sales
reportRoutes.ts
  ↓ prisma.order.findMany()
database (Order model)
  ↓ prisma.resellerCommission.findMany()
database (ResellerCommission model)
  ↓
Return sales data
```

### Reseller Reports
```
ResellerReportsPage.tsx
  ↓ GET /reports/reseller
reportRoutes.ts
  ↓ prisma.resellerEarning.aggregate()
database (ResellerEarning model)
  ↓ prisma.resellerCommission.aggregate()
database (ResellerCommission model)
  ↓
Return report data
  ↓
POST /reports/export/:reportId
reportRoutes.ts
  ↓ Generate CSV/PDF
  ↓
Return file download
```

---

## 5. AUTHOR FLOW

### Author Dashboard
```
AuthorDashboardPage.tsx
  ↓ GET /author/dashboard
authorRoutes.ts
  ↓ prisma.authorProfile.findUnique()
database (AuthorProfile model)
  ↓ prisma.product.count()
database (Product model)
  ↓ prisma.authorEarning.aggregate()
database (AuthorEarning model)
  ↓
Return dashboard metrics
  ↓
AuthorDashboardPage displays stats
```

### Author Products
```
AuthorDashboardPage → Products tab
  ↓ GET /author/products
authorRoutes.ts
  ↓ prisma.product.findMany()
database (Product model)
  ↓
Return author's products
  ↓
POST /author/products (create product)
authorRoutes.ts
  ↓ prisma.product.create()
database (Product model)
  ↓
PATCH /author/products/:id (update product)
authorRoutes.ts
  ↓ prisma.product.update()
database (Product model)
```

### Author Profile
```
AuthorDashboardPage → Profile tab
  ↓ GET /author/profile
authorRoutes.ts
  ↓ prisma.authorProfile.findUnique()
database (AuthorProfile model)
  ↓
Return profile data
  ↓
PATCH /author/profile (update profile)
authorRoutes.ts
  ↓ prisma.authorProfile.update()
database (AuthorProfile model)
```

### Author Storage
```
AuthorDashboardPage → Storage tab
  ↓ GET /author/storage
authorRoutes.ts
  ↓ prisma.authorStorage.findUnique()
database (AuthorStorage model)
  ↓ prisma.mediaFile.aggregate()
database (MediaFile model)
  ↓
Return storage usage
```

---

## 6. USER SETTINGS FLOW

### Settings Page
```
SettingsPage.tsx
  ↓ GET /user/settings
userRoutes.ts
  ↓ prisma.userSettings.findUnique()
database (UserSettings model)
  ↓
Return user settings
  ↓
SettingsPage displays settings form
  ↓
PATCH /user/settings (update settings)
userRoutes.ts
  ↓ prisma.userSettings.upsert()
database (UserSettings model)
  ↓
Fallback to localStorage if backend fails (ISSUE)
```

---

## 7. ANALYTICS FLOW

### Revenue Page
```
RevenuePage.tsx
  ↓ GET /reports/revenue
reportRoutes.ts
  ↓ prisma.order.aggregate()
database (Order model)
  ↓ prisma.subscription.aggregate()
database (Subscription model)
  ↓
Return revenue data
  ↓
GET /reports/subscriptions
reportRoutes.ts
  ↓ prisma.subscription.findMany()
database (Subscription model)
  ↓
Return subscription data
  ↓
GET /admin/revenue
adminRoutes.ts
  ↓ prisma.order.aggregate()
database (Order model)
  ↓
Return admin revenue data
```

### Logs Page
```
LogsPage.tsx
  ↓ GET /admin/logs
adminRoutes.ts
  ↓ prisma.auditLog.findMany()
database (AuditLog model)
  ↓
Return log entries
  ↓
LogsPage displays logs
```

### Alerts Page
```
AlertsPage.tsx
  ↓ GET /admin/alerts (MISMATCH - should be /observability/alerts)
observabilityRoutes.ts
  ↓ alertManager.getActiveAlerts()
  ↓ alertManager.getAlertHistory()
  ↓
Return alerts
  ↓
AlertsPage displays alerts
```

---

## 8. INFRASTRUCTURE FLOW

### Infrastructure Page
```
InfrastructurePage.tsx
  ↓ GET /admin/infrastructure (MISSING - route does not exist)
  ↓
Expected: Server, database, CDN metrics
  ↓
InfrastructurePage displays infrastructure status
```

### Apps Page (Infrastructure Monitoring)
```
AppsPage.tsx
  ↓ GET /admin/metrics
adminRoutes.ts
  ↓ Generate time-series data (simulated)
  ↓
Return cpu, memory, network, io data
  ↓
AppsPage displays service status
  ↓
Periodic refresh (30s interval)
```

---

## 9. SEARCH FLOW

### Global Search
```
Search component (various pages)
  ↓ GET /search
searchRoutes.ts
  ↓ prisma.product.findMany() (search products)
database (Product model)
  ↓ prisma.user.findMany() (search users - admin only)
database (User model)
  ↓
Return search results
  ↓
Fallback to localStorage if backend fails (ISSUE)
```

---

## 10. REALTIME FLOW

### Websocket Connection
```
useSocket hook
  ↓ Connect to websocket server
  ↓ socket.ts → authenticateSocket()
  ↓ Verify JWT token
  ↓ Join user-specific room: `user:{userId}`
  ↓ Join role-specific room: `admins`, `resellers`, `authors`
  ↓
Subscribe to events:
  - analytics updates
  - notifications
  - system alerts
  ↓
Real-time UI updates via socket events
```

### Analytics Real-time Updates
```
OverviewPage.tsx
  ↓ subscribeToAnalytics()
  ↓ Socket event: 'analytics:update'
  ↓ Update pulse state
  ↓ Re-render metrics
```

---

## 11. NOTIFICATION FLOW

### Notification Display
```
Notification component (header)
  ↓ GET /communication/notifications
communicationRoutes.ts
  ↓ prisma.notification.findMany()
database (Notification model)
  ↓
Return user notifications
  ↓
Fallback to localStorage if backend fails (ISSUE)
  ↓
Display notification badges
  ↓
PATCH /communication/notifications/:id/read (mark read)
communicationRoutes.ts
  ↓ prisma.notification.update()
database (Notification model)
```

---

## 12. AI FLOW

### AI Request
```
AI component (various pages)
  ↓ POST /ai/run
aiRoutes.ts → aiService.runAi()
  ↓ Call AI provider (OpenAI/Anthropic)
  ↓ prisma.aiRequest.create()
database (AiRequest model)
  ↓
Return AI response
  ↓
Display response
  ↓
GET /ai/usage
aiRoutes.ts
  ↓ prisma.aiRequest.aggregate()
database (AiRequest model)
  ↓
Return usage stats
```

### AI Memory
```
AI component
  ↓ GET /ai/memory
aiRoutes.ts
  ↓ prisma.aiMemory.findMany()
database (AiMemory model)
  ↓
Return memory
  ↓
PUT /ai/memory (upsert memory)
aiRoutes.ts
  ↓ prisma.aiMemory.upsert()
database (AiMemory model)
```

---

## 13. MEDIA FLOW

### File Upload
```
Upload component
  ↓ POST /media/upload/initiate
mediaRoutes.ts → mediaService.initiateUpload()
  ↓ Generate presigned URL (S3/R2)
  ↓
Return upload URL
  ↓
Client uploads directly to storage
  ↓
POST /media/upload/confirm/:id
mediaRoutes.ts → mediaService.confirmUpload()
  ↓ prisma.mediaFile.create()
database (MediaFile model)
  ↓
Return media file
  ↓
GET /media
mediaRoutes.ts
  ↓ prisma.mediaFile.findMany()
database (MediaFile model)
  ↓
Return media list
```

---

## 14. AUDIT FLOW

### Audit Log Query
```
Audit component (admin pages)
  ↓ GET /governance/audit
governanceRoutes.ts → auditService.query()
  ↓ prisma.auditLog.findMany()
database (AuditLog model)
  ↓
Return audit logs
  ↓
Fallback to localStorage if backend fails (ISSUE)
```

---

## 15. FEATURE FLAGS FLOW

### Feature Flag Access
```
Feature flag component
  ↓ localStorage.getItem() (ISSUE - should be backend)
  ↓
Expected: GET /admin/feature-flags (MISSING)
  ↓
Return feature flags
  ↓
Apply feature flags to UI
```

---

## 16. CRITICAL ISSUES IN DATA FLOW

### Issue 1: localStorage Fallbacks
**Impact:** Data loss, security risk, no cross-device sync
**Affected Flows:**
- Settings (UserSettings)
- Audit logs (AuditLog)
- Notifications (Notification)
- Feature flags (missing backend)
- Search (fallback)
- Storage (MediaFile metadata)

### Issue 2: Missing Backend Routes
**Impact:** 404 errors, broken functionality
**Affected Flows:**
- Infrastructure page (/admin/infrastructure)
- Feature flags (/admin/feature-flags)

### Issue 3: Route Mismatches
**Impact:** 404 errors, broken functionality
**Affected Flows:**
- Alerts page (/admin/alerts vs /observability/alerts)
- Checkout (/billing/checkout vs /billing/checkout/session)

### Issue 4: Fake Data Generation
**Impact:** Misleading data, not production-ready
**Affected Flows:**
- Metrics page (simulated data)
- Apps page (simulated data)
- Success page (fake order ID)
- Traces page (fake trace data)
- Reseller dashboard (fake earnings)

---

## 17. DATA FLOW SUMMARY

### Total Pages Analyzed: 25+
### Total API Endpoints Traced: 60+
### Total Database Models Involved: 25+
### Critical Issues Found: 10+

### Well-Wired Flows:
- ✅ Authentication (login, register, logout)
- ✅ User management (admin)
- ✅ Product marketplace (read)
- ✅ Cart operations
- ✅ Checkout initiation
- ✅ Reseller dashboard
- ✅ Author dashboard
- ✅ Order management
- ✅ Subscription management

### Partially Wired Flows:
- ⚠️ Product write operations (admin uses localStorage)
- ⚠️ Settings (has backend but localStorage fallback)
- ⚠️ Notifications (has backend but localStorage fallback)
- ⚠️ Audit logs (has backend but localStorage fallback)
- ⚠️ Search (has backend but localStorage fallback)

### Broken Flows:
- ❌ Infrastructure page (missing backend route)
- ❌ Alerts page (route mismatch)
- ❌ Checkout (route mismatch)
- ❌ Feature flags (no backend, localStorage only)
- ❌ Metrics/AI data (fake/simulated)

---

## 18. RECOMMENDED FIXES

### Priority 1 (Critical):
1. Create `/admin/infrastructure` endpoint
2. Fix `/admin/alerts` route mismatch
3. Fix `/billing/checkout` route mismatch
4. Create `/admin/feature-flags` endpoint

### Priority 2 (High):
5. Remove localStorage fallback from SettingsPage
6. Migrate audit logs to backend API
7. Migrate notifications to backend API
8. Migrate search to backend API only

### Priority 3 (Medium):
9. Wire AdminProductsPage to backend write APIs
10. Replace fake metrics data with real backend data
11. Replace fake AI data with real backend data
12. Remove fake order ID generation

---

**Report Generated:** 2026-05-25
**Next Step:** Fix critical issues before PHASE 02
