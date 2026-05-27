# PHASE 01: COMPLETE FORENSIC BACKEND SCAN
## Endpoint Dependency Map & Architecture Analysis
**Date:** 2026-05-25
**Scope:** Full ecosystem scan - frontend pages, contexts, hooks, stores, backend routes, services

---

## EXECUTIVE SUMMARY

**FRONTEND FILES SCANNED:**
- Pages: 43+ .tsx files
- Contexts: 3 files (AuthContext, CartContext, ResellerContext)
- Hooks: 3 files (use-toast, useProduct, useSocket)
- Lib files: 27 files (API clients, utilities, data managers)

**BACKEND ROUTES SCANNED:**
- Route files: 22 files
- Service files: 8 files
- API modules: 15 files

**TOTAL API ENDPOINTS MAPPED:** 100+

---

## API ENDPOINT DEPENDENCY MAP

### AUTHENTICATION ROUTES (/api/v1/auth)
```
GET    /csrf                          - CSRF token issuance
POST   /register                      - User registration
POST   /login                         - User login
POST   /refresh                       - Token refresh
POST   /logout                        - User logout
GET    /me                            - Current user info
GET    /sessions                      - List user sessions
POST   /sessions/revoke              - Revoke session
```
**Frontend Dependencies:** AuthContext.tsx, LoginPage.tsx, SignupPage.tsx

---

### USER ROUTES (/api/v1/user)
```
GET    /settings                      - Get user settings
PATCH  /settings                      - Update user settings
```
**Frontend Dependencies:** SettingsPage.tsx

---

### MARKETPLACE ROUTES (/api/v1/marketplace)
```
GET    /products                      - List products
GET    /products/:id                  - Get product by ID
GET    /products/slug/:slug           - Get product by slug
GET    /products/:id/related         - Get related products
GET    /products/:id/reviews          - Get product reviews
POST   /products/:id/reviews         - Create review
GET    /categories                    - List categories
GET    /categories/:slug             - Get category by slug
GET    /wishlist                      - Get wishlist
POST   /wishlist                      - Add to wishlist
DELETE /wishlist/:id                 - Remove from wishlist
GET    /cart                          - Get cart
POST   /cart                          - Add to cart
DELETE /cart/:id                      - Remove from cart
DELETE /cart                          - Clear cart
```
**Frontend Dependencies:** HomePage.tsx, ProductPage.tsx, CartPage.tsx, FavoritesPage.tsx, SearchPage.tsx

---

### RESELLER ROUTES (/api/v1/reseller)
```
GET    /dashboard                     - Reseller dashboard data
GET    /leads                         - List leads
POST   /leads                         - Create lead
PATCH  /leads/:id                     - Update lead
GET    /clients                       - List clients
POST   /clients                       - Create client
PATCH  /clients/:id                   - Update client
GET    /earnings                      - Get earnings
GET    /commissions                   - Get commissions
GET    /payouts                       - Get payouts
GET    /settings                      - Get reseller settings
PATCH  /settings                      - Update reseller settings
```
**Frontend Dependencies:** ResellerDashboardPage.tsx, ResellerLeadsPage.tsx, ResellerContactsPage.tsx, ResellerEarningsPage.tsx, ResellerSettingsPage.tsx

---

### AUTHOR ROUTES (/api/v1/author)
```
GET    /dashboard                     - Author dashboard data
GET    /products                      - List author products
POST   /products                      - Create product
PATCH  /products/:id                  - Update product
GET    /profile                       - Get author profile
PATCH  /profile                       - Update author profile
GET    /earnings                      - Get author earnings
GET    /storage                       - Get author storage
GET    /analytics                     - Get author analytics
```
**Frontend Dependencies:** AuthorLayout.tsx, AuthorProductsPage.tsx

---

### ADMIN ROUTES (/api/v1/admin)
```
GET    /overview                      - Admin overview
GET    /metrics                       - Admin metrics
GET    /products                      - List all products
POST   /products                      - Create product
PATCH  /products/:id                  - Update product
DELETE /products/:id                  - Delete product
GET    /categories                    - List categories
POST   /categories                    - Create category
GET    /orders                        - List orders
GET    /users                         - List users
PATCH  /users/:id                     - Update user
GET    /revenue                       - Get revenue data
GET    /logs                          - Get audit logs
```
**Frontend Dependencies:** AdminLayout.tsx, AdminProductsPage.tsx, AdminOrdersPage.tsx, UsersPage.tsx

---

### PAYMENT ROUTES (/api/v1/payment)
```
POST   /checkout                      - Create checkout session
POST   /portal                        - Create portal session
GET    /subscriptions                 - List subscriptions
GET    /orders                        - List orders
GET    /licenses                      - List licenses
```
**Frontend Dependencies:** CheckoutPage.tsx, OrdersPage.tsx, DashboardSubscriptionPage.tsx

---

### BILLING ROUTES (/api/v1/billing)
```
POST   /checkout/session              - Create checkout session
GET    /subscriptions                 - List subscriptions
PATCH  /subscriptions/change         - Change subscription
GET    /invoices                      - List invoices
POST   /refunds                       - Create refund
POST   /payouts                       - Create payout
```
**Frontend Dependencies:** DashboardSubscriptionPage.tsx

---

### ANALYTICS ROUTES (/api/v1/analytics)
```
POST   /events                        - Track analytics event
GET    /events                        - Query analytics events
POST   /metrics                       - Create metric
GET    /metrics                       - List metrics
POST   /metrics/:id/snapshots         - Record metric snapshot
GET    /metrics/:id/history           - Get metric history
GET    /metrics/:id/aggregate         - Aggregate metric
```
**Frontend Dependencies:** TracesPage.tsx, MetricsPage.tsx

---

### COMMUNICATION ROUTES (/api/v1/communication)
```
POST   /emails                        - Send email
GET    /emails                        - List emails
POST   /notifications                 - Create notification
GET    /notifications                 - List notifications
PATCH  /notifications/:id/read       - Mark notification read
PATCH  /notifications/read-all        - Mark all notifications read
PATCH  /notifications/:id/archive    - Archive notification
```
**Frontend Dependencies:** NotificationsPage.tsx

---

### GOVERNANCE ROUTES (/api/v1/governance)
```
GET    /audit                         - Query audit logs
GET    /audit/stats                   - Get audit stats
GET    /audit/timeline/:entityType/:entityId - Get entity timeline
GET    /audit/user/:userId            - Get user activity
GET    /retention/policies            - List retention policies
POST   /retention/policies            - Create retention policy
GET    /permission/history            - Get permission history
POST   /archival/start                - Start archival
GET    /deletion/policies             - List deletion policies
```
**Frontend Dependencies:** LogsPage.tsx, auditLog.ts

---

### MEDIA ROUTES (/api/v1/media)
```
POST   /upload/initiate               - Initiate upload
POST   /upload/confirm/:id            - Confirm upload
GET    /                              - List media
GET    /:id                           - Get media by ID
DELETE /:id                           - Delete media
```
**Frontend Dependencies:** storage.ts, AdminGalleryPage.tsx

---

### SEARCH ROUTES (/api/v1/search)
```
GET    /                              - Global search
```
**Frontend Dependencies:** SearchPage.tsx, search.ts

---

### SECURITY ROUTES (/api/v1/security)
```
GET    /incidents                     - Get security incidents
GET    /metrics                       - Get security metrics
```
**Frontend Dependencies:** AlertsPage.tsx

---

### WEBHOOK ROUTES (/api/v1/webhooks)
```
POST   /stripe                        - Stripe webhook handler
```
**Frontend Dependencies:** webhooks.ts

---

### RBAC ROUTES (/api/v1/rbac)
```
GET    /permissions                   - Get user permissions
GET    /matrix                        - Get RBAC matrix
```
**Frontend Dependencies:** AuthContext.tsx

---

### GDPR ROUTES (/api/v1/gdpr)
```
GET    /export                        - Export user data
POST   /delete                        - Delete user data
POST   /anonymize                     - Anonymize user data
```
**Frontend Dependencies:** SettingsPage.tsx

---

### AI ROUTES (/api/v1/ai)
```
POST   /run                           - Run AI model
GET    /usage                         - Get AI usage
GET    /memory                        - Get AI memory
PUT    /memory                        - Update AI memory
POST   /automation/rules              - Create automation rule
GET    /automation/rules              - List automation rules
POST   /automation/rules/:id/run      - Execute automation rule
```
**Frontend Dependencies:** AppsPage.tsx

---

### HEALTH ROUTES (/health)
```
GET    /health                        - Health check
GET    /metrics                       - Runtime metrics
```
**Frontend Dependencies:** InfrastructurePage.tsx

---

### OBSERVABILITY ROUTES (/api/v1/observability)
```
GET    /metrics                       - Get metrics
GET    /metrics/prometheus            - Export Prometheus format
GET    /alerts                        - Get alerts
POST   /alerts/:alertId/resolve       - Resolve alert
GET    /incidents                     - Get incidents
GET    /incidents/stats               - Get incident stats
GET    /incidents/:id                 - Get incident by ID
```
**Frontend Dependencies:** InfrastructurePage.tsx

---

### REPORT ROUTES (/api/v1/reports)
```
GET    /admin                         - Admin report
GET    /reseller                      - Reseller report
GET    /revenue                       - Revenue report
GET    /subscriptions                - Subscription report
GET    /sales                         - Sales report
GET    /payouts                       - Payout report
POST   /export/:reportId              - Export report
```
**Frontend Dependencies:** RevenuePage.tsx, ResellerEarningsPage.tsx, ResellerReportsPage.tsx

---

## DATABASE RELATION MAP

### AUTH TABLES
- User (id, email, name, passwordHash, role, status, lastLoginAt, createdAt, updatedAt, deletedAt)
- Session (id, userId, token, expiresAt, status, lastSeenAt, createdAt, updatedAt)
- RefreshToken (id, userId, token, expiresAt, createdAt, updatedAt)
- Permission (id, name, description, createdAt, updatedAt)
- Role (id, name, description, createdAt, updatedAt)
- RolePermission (roleId, permissionId)
- Device (id, userId, userAgent, ipAddress, lastSeenAt, createdAt, updatedAt)
- LoginAttempt (id, userId, email, ipAddress, success, failureReason, createdAt)
- SecurityEvent (id, userId, eventType, severity, metadata, createdAt)

### MARKETPLACE TABLES
- Product (id, slug, name, description, category, categoryId, status, priceMonthly, priceYearly, priceLifetime, thumbnail, screenshots, features, modules, tags, rating, reviewsCount, usersCount, statusLabel, authorId)
- Category (id, slug, name, description, icon, parentId, createdAt, updatedAt)
- ProductVersion (id, productId, version, changelog, releasedAt, createdAt, updatedAt)
- Review (id, productId, userId, rating, title, content, createdAt, updatedAt)
- Rating (id, productId, userId, rating, createdAt, updatedAt)
- Wishlist (id, userId, productId, createdAt, updatedAt)
- Cart (id, userId, createdAt, updatedAt)
- CartItem (id, cartId, productId, quantity, price, createdAt, updatedAt)
- Subscription (id, userId, productId, plan, status, startDate, endDate, createdAt, updatedAt)
- License (id, userId, productId, key, status, maxSeats, expiresAt, createdAt, updatedAt)

### COMMERCE TABLES
- Order (id, userId, status, total, currency, paymentMethod, paymentId, billingEmail, billingName, billingAddress, createdAt, updatedAt)
- OrderItem (id, orderId, productId, plan, price, quantity, createdAt, updatedAt)
- Invoice (id, orderId, invoiceNumber, status, dueDate, amount, currency, createdAt, updatedAt)
- Transaction (id, orderId, paymentMethod, amount, currency, status, metadata, createdAt, updatedAt)
- Refund (id, transactionId, amount, currency, reason, status, createdAt, updatedAt)
- Coupon (id, code, discountType, discountValue, maxUses, usedCount, expiresAt, createdAt, updatedAt)
- Tax (id, orderId, amount, currency, rate, description, createdAt, updatedAt)
- Payout (id, userId, amount, currency, status, method, metadata, createdAt, updatedAt)

### RESELLER TABLES
- ResellerProfile (id, userId, commissionRate, tier, status, approvedAt, createdAt, updatedAt)
- ResellerClient (id, resellerId, name, email, phone, status, createdAt, updatedAt)
- ResellerLead (id, resellerId, name, email, phone, status, source, createdAt, updatedAt)
- ResellerPipeline (id, resellerId, leadId, stage, probability, expectedCloseDate, createdAt, updatedAt)
- ResellerEarning (id, resellerId, amount, currency, source, status, createdAt, updatedAt)
- ResellerCommission (id, resellerId, productId, rate, amount, status, createdAt, updatedAt)
- ResellerPayout (id, resellerId, amount, currency, status, method, createdAt, updatedAt)
- ResellerActivity (id, resellerId, activity, metadata, createdAt, updatedAt)
- ResellerNotification (id, resellerId, type, title, message, status, createdAt, updatedAt)
- ResellerGrowthMetric (id, resellerId, metric, value, period, createdAt, updatedAt)

### AUTHOR TABLES
- AuthorProfile (id, userId, bio, website, github, twitter, linkedin, status, verifiedAt, createdAt, updatedAt)
- AuthorProduct (id, authorId, productId, status, publishedAt, createdAt, updatedAt)
- AuthorRelease (id, authorId, productId, version, changelog, releasedAt, createdAt, updatedAt)
- AuthorAnalytics (id, authorId, productId, metric, value, period, createdAt, updatedAt)
- AuthorStorage (id, authorId, usedBytes, limitBytes, createdAt, updatedAt)
- AuthorSecurity (id, authorId, lastVerified, verificationStatus, createdAt, updatedAt)
- AuthorEarning (id, authorId, productId, amount, currency, status, createdAt, updatedAt)

### AI TABLES
- AiPrediction (id, userId, model, input, output, confidence, createdAt, updatedAt)
- AiInsight (id, userId, type, data, confidence, createdAt, updatedAt)
- AiAlert (id, userId, type, severity, message, metadata, createdAt, updatedAt)
- AiRecommendation (id, userId, type, data, confidence, createdAt, updatedAt)
- AiActivityLog (id, userId, action, model, input, output, createdAt, updatedAt)

### MONITORING TABLES
- AuditLog (id, actorId, action, entityType, entityId, metadata, createdAt, updatedAt)
- InfraLog (id, level, service, message, metadata, createdAt, updatedAt)
- ActivityStream (id, userId, activity, metadata, createdAt, updatedAt)
- RealtimeMetric (id, metric, value, timestamp, tags, createdAt, updatedAt)
- ErrorTracking (id, level, service, message, stackTrace, metadata, createdAt, updatedAt)
- NotificationLog (id, userId, type, channel, status, metadata, createdAt, updatedAt)

---

## AUTH RELATION GRAPH

```
User
├── Session (1:N)
├── RefreshToken (1:N)
├── UserSettings (1:1)
├── Device (1:N)
├── LoginAttempt (1:N)
├── SecurityEvent (1:N)
├── Cart (1:1)
├── Order (1:N)
├── License (1:N)
├── Subscription (1:N)
├── Wishlist (1:N)
├── Review (1:N)
├── AuditLog (1:N)
├── AiPrediction (1:N)
├── AiInsight (1:N)
├── AiAlert (1:N)
├── AiRecommendation (1:N)
├── AiActivityLog (1:N)
├── ActivityStream (1:N)
├── NotificationLog (1:N)
├── ResellerProfile (1:1)
├── AuthorProfile (1:1)
└── Role (N:1 via UserRole)
```

---

## REALTIME ARCHITECTURE GRAPH

```
Socket.IO Server
├── Authentication (cookie-based)
├── Rooms
│   ├── notifications:{userId}
│   ├── analytics:{userId}
│   ├── reseller:{resellerId}
│   └── author:{authorId}
├── Events
│   ├── subscribe:notifications
│   ├── subscribe:analytics
│   ├── subscribe:reseller
│   ├── subscribe:author
│   ├── notifications (broadcast)
│   ├── analytics (broadcast)
│   ├── reseller:update (broadcast)
│   └── author:update (broadcast)
└── Redis Pub/Sub (for multi-server scaling)
```

---

## SERVICE COMMUNICATION GRAPH

```
Frontend
├── AuthContext
│   └── authService (login, register, logout, refresh)
├── CartContext
│   └── cartApi (fetchCart, addToCart, removeFromCart, clearCart)
├── ResellerContext
│   └── reseller API (users, leads, clients, earnings)
└── useSocket
    └── Socket.IO client

Backend Services
├── authService (auth, sessions, tokens)
├── billingService (Stripe, subscriptions, invoices)
├── communicationService (emails, notifications)
├── analyticsService (events, metrics, queries)
├── mediaService (S3 uploads, signed URLs)
├── aiService (predictions, insights, automation)
├── gdprService (export, delete, anonymize)
└── reportService (reports, exports)

Governance Services
├── auditService (audit logs, queries)
├── retentionService (retention policies)
├── permissionHistoryService (permission changes)
├── archivalService (data archival)
└── deletionService (data deletion)

Security Services
├── tokens (JWT generation/validation)
├── incidentTracking (security incidents)
└── rate limiting, CSRF protection

Monitoring Services
├── health (health checks)
├── metrics (runtime metrics)
├── alerts (alert management)
└── incidents (incident tracking)
```

---

## STATE MANAGEMENT GRAPH

```
Frontend State
├── AuthContext (user, session, loading)
├── CartContext (cart items, total, loading)
├── ResellerContext (managed users, loading)
└── ThemeProvider (theme mode)

Backend State
├── PostgreSQL (persistent data)
├── Redis (cache, sessions, queues)
└── Socket.IO (realtime connections)
```

---

## FRONTEND-BACKEND MAPPING

### Pages → API Endpoints

| Page | API Endpoints |
|------|--------------|
| LoginPage.tsx | POST /auth/login, POST /auth/register |
| SettingsPage.tsx | GET /user/settings, PATCH /user/settings |
| NotificationsPage.tsx | GET /communication/notifications, PATCH /communication/notifications/:id/read |
| TracesPage.tsx | GET /analytics/traces |
| ResellerDashboardPage.tsx | GET /reseller/dashboard |
| CartPage.tsx | GET /marketplace/cart, DELETE /marketplace/cart/:id |
| CheckoutPage.tsx | POST /payment/checkout |
| DashboardSubscriptionPage.tsx | GET /billing/subscriptions, POST /billing/checkout/session |
| SearchPage.tsx | GET /search |
| ProductPage.tsx | GET /marketplace/products/:id |
| FavoritesPage.tsx | GET /marketplace/wishlist |
| OrdersPage.tsx | GET /payment/orders |
| AdminProductsPage.tsx | GET /admin/products, POST /admin/products, PATCH /admin/products/:id, DELETE /admin/products/:id |
| RevenuePage.tsx | GET /reports/revenue, GET /reports/subscriptions |
| ResellerEarningsPage.tsx | GET /reports/payouts, GET /reports/sales |
| UsersPage.tsx | GET /admin/users, PATCH /admin/users/:id |

---

## DETECTED ISSUES

### CRITICAL ISSUES

1. **Service Layer Architecture Violation** (CONFIRMED)
   - marketplaceRoutes.ts, resellerRoutes.ts, adminRoutes.ts, authorRoutes.ts use direct Prisma calls
   - Service layers exist but are not used
   - Business logic duplicated between routes and services

2. **Socket Authentication Token** (FIXED)
   - useSocket.ts previously used localStorage for token
   - Now uses cookie-based auth (withCredentials: true)

### HIGH RISK ISSUES

1. **Missing Backend Endpoints**
   - /api/v1/reseller/users (for ResellerContext)
   - /api/v1/reseller/users/:id (for ResellerContext)
   - /api/v1/billing/subscription/cancel (for DashboardSubscriptionPage)
   - /api/v1/governance/backup (for backup.ts)
   - /api/v1/governance/restore (for backup.ts)
   - /api/v1/governance/backups (for backup.ts)
   - /api/v1/reseller/feature-flags (for featureFlags.ts)
   - /api/v1/reseller/activity (for activityTimeline.ts)

2. **Frontend Pages Without Backend Integration**
   - Many pages still use mock data or empty arrays
   - ResellerDashboardPage.tsx uses empty arrays
   - ResellerEarningsPage.tsx needs backend data
   - RevenuePage.tsx needs backend data

### MEDIUM RISK ISSUES

1. **Theme Provider**
   - theme-provider.tsx uses console.warn for TODO
   - Theme mode not persisted to backend

2. **Navbar Preferences**
   - Navbar.tsx uses console.warn for TODO
   - Language and currency preferences not persisted to backend

3. **Wishlist Count**
   - Navbar.tsx wishlist count is hardcoded to 0
   - Should load from backend API

### LOW RISK ISSUES

1. **TypeScript Module Resolution Errors**
   - Cannot find module 'react-router-dom', 'lucide-react', 'sonner', 'socket.io-client'
   - Need to run npm install

2. **CSS Unknown At-Rule Warnings**
   - Unknown @tailwind and @apply rules in index.css
   - Linter configuration needed

---

## VERIFICATION STATUS

### COMPLETED
- ✅ localStorage removed from 24 files
- ✅ Service layer architecture violation identified
- ✅ Database schema relations verified (properly defined)
- ✅ Socket authentication fixed (cookie-based)
- ✅ API endpoint mapping completed
- ✅ Database relation map completed
- ✅ Auth relation graph completed
- ✅ Realtime architecture graph completed
- ✅ Service communication graph completed
- ✅ State management graph completed
- ✅ Frontend-backend mapping completed

### PENDING
- ⏳ Create missing backend endpoints
- ⏳ Fix service layer architecture violation
- ⏳ Integrate theme provider with backend
- ⏳ Integrate navbar preferences with backend
- ⏳ Load wishlist count from backend
- ⏳ Integrate ResellerDashboardPage with backend
- ⏳ Integrate ResellerEarningsPage with backend
- ⏳ Integrate RevenuePage with backend
- ⏳ Run npm install to fix module resolution
- ⏳ Configure linter for CSS rules

---

## NEXT STEPS

Proceed to PHASE 02: ENTERPRISE BACKEND ARCHITECTURE
- Create missing backend endpoints
- Fix service layer architecture violation
- Ensure all frontend pages have backend integration
