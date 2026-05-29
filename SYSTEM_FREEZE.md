# SYSTEM FREEZE DOCUMENTATION
## Phase 1: Enterprise Marketplace Rebuild

**Date**: 2026-05-19
**Status**: FROZEN - DO NOT MODIFY UNLESS REQUIRED FOR REAL FUNCTIONALITY

---

## DESIGN SYSTEM

### Typography
- **Primary Font**: Inter (system-ui, sans-serif)
- **Display Font**: Space Grotesk (system-ui, sans-serif)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900

### Color System (HSL)
**Base Colors**:
- Background: 220 20% 4%
- Foreground: 0 0% 95%
- Card: 220 18% 8%
- Border: 220 15% 14%
- Input: 220 15% 14%
- Ring: 210 100% 52%

**Semantic Colors**:
- Primary: 210 100% 52% (Cyan/Blue)
- Secondary: 220 15% 14%
- Destructive: 0 72% 51% (Red)
- Muted: 220 12% 12%
- Accent: 220 15% 16%

**Marketplace Tokens**:
- Success: 142 71% 45% (Green)
- Warning: 38 92% 50% (Yellow/Orange)
- Error: 0 72% 51% (Red)
- Info: 210 100% 52% (Cyan)
- Gold: 45 93% 58%
- Purple: 270 70% 60%

**Gradient**: 210 100% 52% → 270 70% 60% (Cyan to Purple)

### Border Radius
- lg: var(--radius) = 0.5rem
- md: calc(var(--radius) - 2px)
- sm: calc(var(--radius) - 4px)

### Animations
- accordion-down: 0.2s ease-out
- accordion-up: 0.2s ease-out
- pulse: Used for live indicators

---

## ROUTE STRUCTURE

### Public Routes
- `/` - HomePage
- `/login` - LoginPage
- `/signup` - SignupPage
- `/search` - SearchPage
- `/support` - SupportPage
- `/reseller-apply` - ResellerApplyPage
- `/category/:macro` - Category (macro)
- `/category/:macro/:sub` - Category (macro/sub)
- `/category/:macro/:sub/:micro` - Category (macro/sub/micro)
- `/product/:id` - ProductPage
- `/cart` - CartPage
- `/checkout` - CheckoutPage
- `/subscription` - SubscriptionPage
- `/subscribe-checkout` - SubscribeCheckoutPage
- `/success` - SuccessPage
- `/app/:productId` - AppAccessPage (subscription-gated)

### User Dashboard Routes (AuthGuard)
- `/dashboard` - DashboardPage
- `/dashboard/apps` - AppsPage
- `/dashboard/orders` - OrdersPage
- `/dashboard/subscription` - DashboardSubscriptionPage
- `/dashboard/favorites` - FavoritesPage
- `/dashboard/recent` - RecentPage
- `/dashboard/profile` - ProfilePage
- `/dashboard/billing` - BillingPage
- `/dashboard/notifications` - NotificationsPage
- `/dashboard/security` - SecurityPage

### Reseller Routes (ResellerGuard)
- `/reseller/dashboard` - ResellerDashboardPage
- `/reseller/leads` - ResellerLeadsPage
- `/reseller/pipeline` - ResellerPipelinePage
- `/reseller/contacts` - ResellerContactsPage
- `/reseller/users` - ResellerUsersPage
- `/reseller/subscriptions` - ResellerSubscriptionsPage
- `/reseller/products` - ResellerProductsPage
- `/reseller/earnings` - ResellerEarningsPage
- `/reseller/commissions` - ResellerCommissionsPage
- `/reseller/payouts-history` - ResellerPayoutsHistoryPage
- `/reseller/marketing` - ResellerMarketingPage
- `/reseller/reports` - ResellerReportsPage
- `/reseller/settings` - ResellerSettingsPage

### Admin Routes (AdminGuard)
- `/admin` - OverviewPage
- `/admin/products` - AdminProductsPage
- `/admin/categories` - CategoriesPage
- `/admin/gallery` - AdminGalleryPage
- `/admin/reviews` - ReviewsPage
- `/admin/coupons` - CouponsPage
- `/admin/users` - UsersPage
- `/admin/vendors` - VendorsPage
- `/admin/orders` - AdminOrdersPage
- `/admin/subscriptions` - AdminSubscriptionsPage
- `/admin/revenue` - RevenuePage
- `/admin/logs` - LogsPage
- `/admin/alerts` - AlertsPage
- `/admin/apps` - AppsPage
- `/admin/infrastructure` - InfrastructurePage
- `/admin/metrics` - MetricsPage
- `/admin/traces` - TracesPage
- `/admin/dashboards` - DashboardsPage
- `/admin/reports` - ReportsPage
- `/admin/email-templates` - EmailTemplatesPage
- `/admin/settings` - SettingsPage

### Author Routes (AuthGuard)
- `/author/dashboard` - AuthorDashboardPage
- `/author/products` - AuthorProductsPage
- `/author/releases` - AuthorReleasesPage
- `/author/analytics` - AuthorAnalyticsPage
- `/author/revenue` - AuthorRevenuePage
- `/author/licenses` - AuthorLicensesPage
- `/author/storage` - AuthorStoragePage
- `/author/downloads` - AuthorDownloadsPage
- `/author/seo` - AuthorSeoPage
- `/author/reviews` - AuthorReviewsPage
- `/author/support` - AuthorSupportPage
- `/author/deployments` - AuthorDeploymentsPage
- `/author/ai-scans` - AuthorAiScansPage
- `/author/payouts` - AuthorPayoutsPage
- `/author/settings` - AuthorSettingsPage

---

## SIDEBAR ARCHITECTURE

### User Dashboard Sidebar
- Groups: Overview, Apps & Orders, Account
- Collapsible with icon-only mode
- User profile section
- Logout functionality

### Admin Sidebar (Boss Panel)
- Groups: Overview, Catalog, Commerce, People, Operations, Reporting, System
- 7 groups, 25+ routes
- Boss Panel branding
- Yellow accent for admin identity

### Reseller Sidebar (Partner Program)
- Groups: Overview, Sales, Business, Earnings, Resources, Account
- 6 groups, 15+ routes
- Green accent (#008060)
- Partner branding

### Author Sidebar (Author Studio)
- Groups: Studio, Intelligence, Commerce, Operations, System
- 5 groups, 15+ routes
- Cyan/Fuchsia gradient branding
- Realtime channel indicator

### Dashboard AppSidebar (Command Center)
- Groups: Command, Operations, Business, System
- 11 routes
- BossPanel branding
- AI Command indicator
- Connected status with pulse animation

---

## LAYOUT ENGINE

### Layout Hierarchy
```
App.tsx (BrowserRouter)
├── AuthProvider
├── CartProvider
├── QueryClientProvider
├── TooltipProvider
└── Routes
    ├── Public Routes (no guard)
    ├── AuthGuard Routes
    │   ├── DashboardLayout (User)
    │   ├── AuthorLayout
    │   └── SubscriptionGuard
    ├── AdminGuard Routes
    │   └── AdminLayout
    └── ResellerGuard Routes
        └── ResellerLayout
```

### Layout Components
- **DashboardLayout**: User dashboard with sidebar
- **AdminLayout**: Admin panel with sidebar
- **ResellerLayout**: Reseller panel with sidebar
- **AuthorLayout**: Author studio with sidebar
- All layouts use shadcn/ui Sidebar component
- All layouts have header, sidebar, main content area
- All layouts support collapsible sidebar

---

## COMPONENT HIERARCHY

### UI Components (shadcn/ui)
- 40+ UI components in `src/components/ui/`
- All based on Radix UI primitives
- Styled with TailwindCSS
- Type-safe with TypeScript

### Custom Components
**Dashboard**:
- AppSidebar
- DashboardLayout
- KpiCard
- MetricPanel
- TopNavbar

**Marketplace**:
- HeroBanner
- LiveChatWidget
- MarketplaceSidebar
- Navbar
- ProductCard
- ProductRow

**Admin**:
- ProductEditor

**Guards**:
- AuthGuard
- AdminGuard
- ResellerGuard
- SubscriptionGuard

---

## ANIMATION SYSTEM

### CSS Animations
- `accordion-down`: Height transition 0.2s ease-out
- `accordion-up`: Height transition 0.2s ease-out
- `animate-pulse`: For live indicators
- `animate-ping`: For notification badges

### Transitions
- Sidebar collapse: 300ms duration
- Card hover: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- All interactive elements have smooth transitions

### Glow Effects
- Sidebar active state: box-shadow glow
- Logo: shadow-[0_0_18px_hsl(186_90%_55%/0.55)]
- Active nav items: shadow-[0_0_10px_hsl(186_90%_55%/0.9)]

---

## RESPONSIVE SYSTEM

### Breakpoints
- Default: Mobile-first
- `2xl`: 1400px (container center)
- Sidebar: Collapsible on mobile
- Grid: Responsive columns
- Typography: Responsive font sizes

### Mobile Considerations
- Sidebar collapses to icon-only
- Touch-friendly targets
- Responsive padding
- Scrollable containers

---

## THEME SYSTEM

### Dark Mode
- Class-based dark mode: `darkMode: ["class"]`
- Default: Dark theme
- CSS variables for all colors
- HSL color system for easy theming

### Theme Tokens
- All colors defined as CSS custom properties
- Easy to override
- Consistent across all components
- Marketplace-specific tokens for branding

---

## CURRENT STATE (TO BE REPLACED)

### Fake Systems
❌ localStorage-based authentication
❌ Mock product data (marketplaceData.ts)
❌ Fake analytics (mockData.ts)
❌ Pre-hashed passwords (seedAuth.ts)
❌ Mock API calls that throw errors
❌ Fake realtime indicators
❌ Console-only actions
❌ Dead button handlers

### Data Storage
- localStorage for auth
- localStorage for cart
- localStorage for files
- Hardcoded product arrays
- Random metric generation

### API Layer
- All API calls throw 'backend_disabled' error
- Fallback to localStorage/mock data
- No real backend integration
- No real database

---

## PRESERVED ELEMENTS

✅ All UI components
✅ All layouts and sidebars
✅ All routes and navigation
✅ Design system (colors, fonts, spacing)
✅ Animation system
✅ Responsive behavior
✅ Component hierarchy
✅ Guard components (to be wired to real auth)

---

## NEXT PHASES

Phase 2: Enterprise Backend Foundation
- NestJS backend
- PostgreSQL database
- Redis cache
- Websocket gateway
- Queue system
- Audit system
- Event bus
- File storage
- CDN pipeline
- Notification engine
- Enterprise logging
- Centralized config

Phase 3: Real Auth + RBAC
- JWT authentication
- Refresh token rotation
- RBAC enforcement
- Permission engine
- Tenant isolation
- Session persistence
- Device tracking
- Audit logging
- Secure password hashing
- Role hierarchy

[... continuing through Phase 15]
