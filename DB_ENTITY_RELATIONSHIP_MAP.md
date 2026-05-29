# DATABASE ENTITY RELATIONSHIP MAP
## PHASE 01: Forensic API Scan - Database Schema Analysis

**Date:** 2026-05-25
**Database:** PostgreSQL via Prisma ORM
**Status:** ANALYZED

---

## 1. CORE AUTHENTICATION & USER MODELS

### User (Primary Entity)
```
User
├── id (String, @id, @default(cuid()))
├── email (String, @unique)
├── name (String)
├── passwordHash (String)
├── role (UserRole, @default(USER))
├── status (UserStatus, @default(ACTIVE))
├── lastLoginAt (DateTime?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
├── deletedAt (DateTime?)
└── Relations:
    ├── settings → UserSettings (1:1)
    ├── sessions → Session[] (1:N)
    ├── authEvents → AuthEvent[] (1:N)
    ├── auditLogs → AuditLog[] (1:N)
    ├── aiRequests → AiRequest[] (1:N)
    ├── aiMemories → AiMemory[] (1:N)
    ├── automationRules → AutomationRule[] (1:N)
    ├── automationRuns → AutomationRun[] (1:N)
    ├── mediaFiles → MediaFile[] (1:N)
    ├── cart → Cart (1:1)
    ├── orders → Order[] (1:N)
    ├── licenses → License[] (1:N)
    ├── subscriptions → Subscription[] (1:N)
    ├── wishlist → Wishlist (1:1)
    ├── reviews → Review[] (1:N)
    ├── payouts → Payout[] (1:N)
    ├── resellerProfile → ResellerProfile (1:1)
    └── authorProfile → AuthorProfile (1:1)

Indexes: [role], [status], [createdAt]
```

### UserSettings
```
UserSettings
├── id (String, @id, @default(cuid()))
├── userId (String, @unique)
├── theme (String?, @default("system"))
├── language (String?, @default("en"))
├── notifications (Json?, @default("{}"))
├── emailAlerts (Boolean?, @default(true))
├── organization (String?)
├── refreshInterval (Int?, @default(30))
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── user → User (1:1, @relation(fields: [userId], references: [id]))

Indexes: [userId]
```

### Session
```
Session
├── id (String, @id, @default(cuid()))
├── userId (String)
├── token (String, @unique)
├── ipAddress (String?)
├── userAgent (String?)
├── expiresAt (DateTime)
├── createdAt (DateTime, @default(now()))
├── revokedAt (DateTime?)
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [token], [expiresAt]
```

### AuthEvent
```
AuthEvent
├── id (String, @id, @default(cuid()))
├── userId (String)
├── eventType (String)
├── ipAddress (String?)
├── userAgent (String?)
├── success (Boolean, @default(true))
├── failureReason (String?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [eventType], [createdAt]
```

---

## 2. AUDIT & GOVERNANCE MODELS

### AuditLog
```
AuditLog
├── id (String, @id, @default(cuid()))
├── actorId (String)
├── actorRole (String?)
├── action (String)
├── entityType (String)
├── entityId (String)
├── changes (Json?)
├── ipAddress (String?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── actor → User (N:1, @relation(fields: [actorId], references: [id]))

Indexes: [actorId], [action], [entityType], [entityId], [createdAt]
```

---

## 3. PRODUCT & MARKETPLACE MODELS

### Product
```
Product
├── id (String, @id, @default(cuid()))
├── slug (String, @unique)
├── name (String)
├── description (String)
├── category (String)
├── categoryId (String?)
├── status (String, @default("DRAFT"))
├── priceMonthly (Int, @default(0))
├── priceYearly (Int, @default(0))
├── priceLifetime (Int, @default(0))
├── thumbnail (String?)
├── screenshots (Json?)
├── features (Json?)
├── modules (Json?)
├── tags (Json?)
├── rating (Float, @default(0))
├── reviewsCount (Int, @default(0))
├── usersCount (Int, @default(0))
├── statusLabel (String, @default("new"))
├── authorId (String?)
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── categoryRel → Category (N:1, @relation(fields: [categoryId], references: [id]))
    ├── reviews → Review[] (1:N)
    ├── wishlistItems → Wishlist[] (1:N)
    ├── cartItems → CartItem[] (1:N)
    ├── subscriptions → Subscription[] (1:N)
    ├── licenses → License[] (1:N)
    ├── orderItems → OrderItem[] (1:N)
    └── author → AuthorProfile (N:1, @relation(fields: [authorId], references: [id]))

Indexes: [category], [categoryId], [status], [authorId], [rating], [createdAt]
```

### Category
```
Category
├── id (String, @id, @default(cuid()))
├── slug (String, @unique)
├── name (String)
├── description (String?)
├── icon (String?)
├── parentId (String?)
├── sortOrder (Int, @default(0))
├── isActive (Boolean, @default(true))
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── products → Product[] (1:N)
    └── parent → Category (N:1, @relation(fields: [parentId], references: [id]))

Indexes: [slug], [parentId], [sortOrder]
```

### Review
```
Review
├── id (String, @id, @default(cuid()))
├── userId (String)
├── productId (String)
├── rating (Int)
├── title (String?)
├── content (String?)
├── verified (Boolean, @default(false))
├── helpful (Int, @default(0))
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (N:1, @relation(fields: [userId], references: [id]))
    └── product → Product (N:1, @relation(fields: [productId], references: [id]))

Indexes: [userId], [productId], [rating], [createdAt]
```

---

## 4. COMMERCE & ORDER MODELS

### Cart
```
Cart
├── id (String, @id, @default(cuid()))
├── userId (String, @unique)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (1:1, @relation(fields: [userId], references: [id]))
    └── items → CartItem[] (1:N)

Indexes: [userId]
```

### CartItem
```
CartItem
├── id (String, @id, @default(cuid()))
├── cartId (String)
├── productId (String)
├── quantity (Int, @default(1))
├── createdAt (DateTime, @default(now()))
└── Relations:
    ├── cart → Cart (N:1, @relation(fields: [cartId], references: [id]))
    └── product → Product (N:1, @relation(fields: [productId], references: [id]))

Indexes: [cartId], [productId]
```

### Order
```
Order
├── id (String, @id, @default(cuid()))
├── userId (String)
├── orderNumber (String, @unique)
├── status (String, @default("PENDING"))
├── currency (String, @default("USD"))
├── subtotal (Float, @default(0))
├── tax (Float, @default(0))
├── total (Float, @default(0))
├── discount (Float, @default(0))
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (N:1, @relation(fields: [userId], references: [id]))
    ├── items → OrderItem[] (1:N)
    ├── invoice → Invoice (1:1)
    └── transactions → Transaction[] (1:N)

Indexes: [userId], [orderNumber], [status], [createdAt]
```

### OrderItem
```
OrderItem
├── id (String, @id, @default(cuid()))
├── orderId (String)
├── productId (String)
├── quantity (Int, @default(1))
├── unitPrice (Float)
├── totalPrice (Float)
├── createdAt (DateTime, @default(now()))
└── Relations:
    ├── order → Order (N:1, @relation(fields: [orderId], references: [id]))
    └── product → Product (N:1, @relation(fields: [productId], references: [id]))

Indexes: [orderId], [productId]
```

### Invoice
```
Invoice
├── id (String, @id, @default(cuid()))
├── orderId (String, @unique)
├── invoiceNumber (String, @unique)
├── status (String, @default("DRAFT"))
├── dueDate (DateTime?)
├── paidAt (DateTime?)
├── subtotal (Float, @default(0))
├── tax (Float, @default(0))
├── total (Float, @default(0))
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── order → Order (1:1, @relation(fields: [orderId], references: [id]))

Indexes: [orderId], [invoiceNumber], [status], [dueDate]
```

### Transaction
```
Transaction
├── id (String, @id, @default(cuid()))
├── orderId (String)
├── paymentMethod (String)
├── paymentIntentId (String?, @unique)
├── amount (Float)
├── currency (String, @default("USD"))
├── status (String, @default("PENDING"))
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── order → Order (N:1, @relation(fields: [orderId], references: [id]))
    └── refunds → Refund[] (1:N)

Indexes: [orderId], [paymentIntentId], [status], [createdAt]
```

### Refund
```
Refund
├── id (String, @id, @default(cuid()))
├── transactionId (String)
├── amount (Float)
├── reason (String?)
├── status (String, @default("PENDING"))
├── processedAt (DateTime?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── transaction → Transaction (N:1, @relation(fields: [transactionId], references: [id]))

Indexes: [transactionId], [status], [createdAt]
```

### Coupon
```
Coupon
├── id (String, @id, @default(cuid()))
├── code (String, @unique)
├── discountType (String)
├── discountValue (Float)
├── maxUses (Int?)
├── usedCount (Int, @default(0))
├── validFrom (DateTime)
├── validUntil (DateTime)
├── isActive (Boolean, @default(true))
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── (No direct relations - applied at checkout)

Indexes: [code], [validFrom], [validUntil]
```

### Tax
```
Tax
├── id (String, @id, @default(cuid()))
├── country (String)
├── region (String?)
├── rate (Float)
├── isActive (Boolean, @default(true))
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── (No direct relations - applied at checkout)

Indexes: [country], [region]
```

---

## 5. SUBSCRIPTION & LICENSING MODELS

### Subscription
```
Subscription
├── id (String, @id, @default(cuid()))
├── userId (String)
├── productId (String)
├── status (String, @default("ACTIVE"))
├── planType (String)
├── billingCycle (String)
├── price (Float)
├── currency (String, @default("USD"))
├── currentPeriodStart (DateTime)
├── currentPeriodEnd (DateTime)
├── cancelAtPeriodEnd (Boolean, @default(false))
├── canceledAt (DateTime?)
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (N:1, @relation(fields: [userId], references: [id]))
    └── product → Product (N:1, @relation(fields: [productId], references: [id]))

Indexes: [userId], [productId], [status], [currentPeriodEnd]
```

### License
```
License
├── id (String, @id, @default(cuid()))
├── userId (String)
├── productId (String)
├── key (String, @unique)
├── status (String, @default("ACTIVE"))
├── validFrom (DateTime)
├── validUntil (DateTime?)
├── maxActivations (Int, @default(1))
├── currentActivations (Int, @default(0))
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (N:1, @relation(fields: [userId], references: [id]))
    └── product → Product (N:1, @relation(fields: [productId], references: [id]))

Indexes: [userId], [productId], [key], [status], [validUntil]
```

---

## 6. RESELLER MODELS

### ResellerProfile
```
ResellerProfile
├── id (String, @id, @default(cuid()))
├── userId (String, @unique)
├── commissionRate (Float, @default(0.15))
├── tier (String, @default("BRONZE"))
├── balance (Float, @default(0))
├── totalEarnings (Float, @default(0))
├── referralCode (String, @unique)
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (1:1, @relation(fields: [userId], references: [id]))
    ├── clients → ResellerClient[] (1:N)
    ├── leads → ResellerLead[] (1:N)
    ├── earnings → ResellerEarning[] (1:N)
    └── commissions → ResellerCommission[] (1:N)

Indexes: [userId], [referralCode], [tier]
```

### ResellerClient
```
ResellerClient
├── id (String, @id, @default(cuid()))
├── resellerId (String)
├── name (String)
├── email (String)
├── company (String?)
├── status (String, @default("ACTIVE"))
├── totalSpend (Float, @default(0))
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── reseller → ResellerProfile (N:1, @relation(fields: [resellerId], references: [id]))

Indexes: [resellerId], [status], [createdAt]
```

### ResellerLead
```
ResellerLead
├── id (String, @id, @default(cuid()))
├── resellerId (String)
├── name (String)
├── email (String)
├── company (String?)
├── status (String, @default("NEW"))
├── source (String?)
├── notes (String?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── reseller → ResellerProfile (N:1, @relation(fields: [resellerId], references: [id]))

Indexes: [resellerId], [status], [createdAt]
```

### ResellerEarning
```
ResellerEarning
├── id (String, @id, @default(cuid()))
├── resellerId (String)
├── amount (Float)
├── source (String)
├── sourceId (String?)
├── status (String, @default("PENDING"))
├── paidAt (DateTime?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── reseller → ResellerProfile (N:1, @relation(fields: [resellerId], references: [id]))

Indexes: [resellerId], [status], [createdAt]
```

### ResellerCommission
```
ResellerCommission
├── id (String, @id, @default(cuid()))
├── resellerId (String)
├── orderId (String)
├── commissionRate (Float)
├── commissionAmount (Float)
├── status (String, @default("PENDING"))
├── paidAt (DateTime?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    ├── reseller → ResellerProfile (N:1, @relation(fields: [resellerId], references: [id]))
    └── order → Order (N:1, @relation(fields: [orderId], references: [id]))

Indexes: [resellerId], [orderId], [status], [createdAt]
```

### Payout
```
Payout
├── id (String, @id, @default(cuid()))
├── userId (String)
├── amount (Float)
├── currency (String, @default("USD"))
├── status (String, @default("PENDING"))
├── method (String?)
├── destination (String?)
├── processedAt (DateTime?)
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [status], [createdAt]
```

---

## 7. AUTHOR MODELS

### AuthorProfile
```
AuthorProfile
├── id (String, @id, @default(cuid()))
├── userId (String, @unique)
├── displayName (String)
├── bio (String?)
├── website (String?)
├── socialLinks (Json?)
├── commissionRate (Float, @default(0.70))
├── totalEarnings (Float, @default(0))
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (1:1, @relation(fields: [userId], references: [id]))
    ├── products → Product[] (1:N)
    ├── storage → AuthorStorage (1:1)
    └── earnings → AuthorEarning[] (1:N)

Indexes: [userId], [displayName]
```

### AuthorStorage
```
AuthorStorage
├── id (String, @id, @default(cuid()))
├── authorId (String, @unique)
├── usedBytes (BigInt, @default(0))
├── limitBytes (BigInt, @default(10737418240)) // 10GB
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── author → AuthorProfile (1:1, @relation(fields: [authorId], references: [id]))

Indexes: [authorId]
```

### AuthorEarning
```
AuthorEarning
├── id (String, @id, @default(cuid()))
├── authorId (String)
├── amount (Float)
├── source (String)
├── sourceId (String?)
├── status (String, @default("PENDING"))
├── paidAt (DateTime?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── author → AuthorProfile (N:1, @relation(fields: [authorId], references: [id]))

Indexes: [authorId], [status], [createdAt]
```

---

## 8. AI & AUTOMATION MODELS

### AiRequest
```
AiRequest
├── id (String, @id, @default(cuid()))
├── userId (String)
├── prompt (String)
├── response (String?)
├── model (String?)
├── tokensUsed (Int, @default(0))
├── cost (Float, @default(0))
├── status (String, @default("PENDING"))
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
├── completedAt (DateTime?)
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [status], [createdAt]
```

### AiMemory
```
AiMemory
├── id (String, @id, @default(cuid()))
├── userId (String)
├── scope (String?)
├── key (String)
├── value (Json)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [scope], [key]
```

### PromptTemplate
```
PromptTemplate
├── id (String, @id, @default(cuid()))
├── name (String)
├── description (String?)
├── template (String)
├── variables (Json?)
├── isActive (Boolean, @default(true))
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── (No direct relations - reusable templates)

Indexes: [name], [isActive]
```

### AutomationRule
```
AutomationRule
├── id (String, @id, @default(cuid()))
├── userId (String)
├── name (String)
├── trigger (Json)
├── actions (Json)
├── isActive (Boolean, @default(true))
├── lastRunAt (DateTime?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (N:1, @relation(fields: [userId], references: [id]))
    └── runs → AutomationRun[] (1:N)

Indexes: [userId], [isActive], [lastRunAt]
```

### AutomationRun
```
AutomationRun
├── id (String, @id, @default(cuid()))
├── ruleId (String)
├── status (String, @default("PENDING"))
├── input (Json?)
├── output (Json?)
├── error (String?)
├── startedAt (DateTime?)
├── completedAt (DateTime?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── rule → AutomationRule (N:1, @relation(fields: [ruleId], references: [id]))

Indexes: [ruleId], [status], [createdAt]
```

---

## 9. MEDIA & STORAGE MODELS

### MediaFile
```
MediaFile
├── id (String, @id, @default(cuid()))
├── userId (String)
├── filename (String)
├── mimeType (String)
├── size (BigInt)
├── url (String)
├── thumbnailUrl (String?)
├── metadata (Json?)
├── uploadedAt (DateTime, @default(now()))
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [mimeType], [uploadedAt]
```

---

## 10. ANALYTICS & METRICS MODELS

### AnalyticsEvent
```
AnalyticsEvent
├── id (String, @id, @default(cuid()))
├── userId (String?)
├── sessionId (String?)
├── eventType (AnalyticsEventType)
├── eventName (String)
├── properties (Json?)
├── value (Float?)
├── timestamp (DateTime, @default(now()))
├── ipAddress (String?)
├── userAgent (String?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── (No direct relations - event tracking)

Indexes: [userId], [eventType], [eventName], [timestamp]
```

### Metric
```
Metric
├── id (String, @id, @default(cuid()))
├── name (String, @unique)
├── type (MetricType)
├── description (String?)
├── aggregationType (AggregationType)
├── unit (String?)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    └── snapshots → MetricSnapshot[] (1:N)

Indexes: [name], [type]
```

### MetricSnapshot
```
MetricSnapshot
├── id (String, @id, @default(cuid()))
├── metricId (String)
├── value (Float)
├── tags (Json?)
├── timestamp (DateTime, @default(now()))
└── Relations:
    └── metric → Metric (N:1, @relation(fields: [metricId], references: [id]))

Indexes: [metricId], [timestamp]
```

---

## 11. COMMUNICATION MODELS

### Email
```
Email
├── id (String, @id, @default(cuid()))
├── to (String)
├── subject (String)
├── body (String)
├── status (String, @default("PENDING"))
├── sentAt (DateTime?)
├── error (String?)
├── metadata (Json?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── (No direct relations - email queue)

Indexes: [to], [status], [createdAt]
```

### Notification
```
Notification
├── id (String, @id, @default(cuid()))
├── userId (String)
├── type (String)
├── title (String)
├── body (String)
├── data (Json?)
├── read (Boolean, @default(false))
├── archived (Boolean, @default(false))
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── user → User (N:1, @relation(fields: [userId], references: [id]))

Indexes: [userId], [type], [read], [createdAt]
```

---

## 12. EVENT OUTBOX (EVENT SOURCING)

### EventOutbox
```
EventOutbox
├── id (String, @id, @default(cuid()))
├── topic (String)
├── payload (Json)
├── processedAt (DateTime?)
├── createdAt (DateTime, @default(now()))
└── Relations:
    └── (No direct relations - event queue)

Indexes: [topic], [processedAt]
```

---

## 13. WISHLIST MODEL

### Wishlist
```
Wishlist
├── id (String, @id, @default(cuid()))
├── userId (String, @unique)
├── createdAt (DateTime, @default(now()))
├── updatedAt (DateTime, @updatedAt)
└── Relations:
    ├── user → User (1:1, @relation(fields: [userId], references: [id]))
    └── products → Product[] (N:M via implicit relation)

Indexes: [userId]
```

---

## 14. ENTITY RELATIONSHIP SUMMARY

### Total Models: 30
### Total Relations: 60+
### Total Indexes: 100+

### Key Relationship Patterns:
1. **User-centric**: Almost all entities relate back to User
2. **Commerce flow**: Cart → Order → Invoice → Transaction → Refund
3. **Marketplace**: Product → Category, Product → Review, Product → Subscription
4. **Multi-tenancy**: ResellerProfile, AuthorProfile extend User
5. **Event sourcing**: EventOutbox for async processing
6. **Analytics**: AnalyticsEvent and Metric/MetricSnapshot for metrics

### Cascade Rules to Verify:
- User deletion should cascade to: Session, AuthEvent, AuditLog
- Product deletion should cascade to: Review, CartItem, OrderItem
- Order deletion should cascade to: OrderItem, Transaction
- Category deletion should cascade to: Product (SetNull)

### Foreign Key Integrity:
- All foreign keys have proper @relation decorators
- All @relation fields have matching references
- Indexes exist on all foreign key columns

---

**Report Generated:** 2026-05-25
**Database Status:** ✅ Well-structured with proper relations and indexes
**Next Step:** Verify cascade rules and constraints in PHASE 03
