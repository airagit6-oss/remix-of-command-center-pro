# PC-3: Reseller + Growth Operating System Architecture
## Reseller Ecosystem - Reseller Dashboard, Commission Management, Growth Tools, Marketing Automation, Analytics, Lead Generation, Customer Retention, Multi-tier Support

---

## Overview
PC-3 is the Reseller + Growth Operating System that enables resellers to manage their business, track commissions, access growth tools, automate marketing, analyze performance, generate leads, retain customers, and manage multi-tier reseller networks. It provides a comprehensive platform for resellers to scale their business and maximize revenue.

---

## Core Components

### 1. Reseller Dashboard
**Purpose:** Central hub for resellers to manage their business operations

**Key Features:**
- Revenue overview with charts (daily, weekly, monthly, yearly)
- Commission tracking and breakdown
- Sales analytics by product, region, channel
- Customer analytics (new, returning, churn)
- License management dashboard
- Performance metrics (conversion rate, refund rate, support tickets)
- Payout status and history
- Tier advancement tracking
- Quick actions (view products, create campaigns, check analytics)
- Goal setting and progress tracking

**Technical Stack:**
- Frontend: React with Recharts for visualizations
- Backend: Analytics service with PostgreSQL queries
- Cache: Redis for dashboard data (TTL: 5 minutes)
- Queue: BullMQ for report generation

**API Endpoints:**
```
GET /api/v1/reseller/dashboard
GET /api/v1/reseller/dashboard/revenue
GET /api/v1/reseller/dashboard/commissions
GET /api/v1/reseller/dashboard/sales
GET /api/v1/reseller/dashboard/customers
GET /api/v1/reseller/dashboard/licenses
GET /api/v1/reseller/dashboard/payouts
GET /api/v1/reseller/dashboard/tiers
GET /api/v1/reseller/dashboard/goals
```

**Data Models:**
```typescript
interface ResellerDashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalCommissions: number;
  commissionGrowth: number;
  totalSales: number;
  salesGrowth: number;
  activeCustomers: number;
  customerGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
  refundRate: number;
  currentTier: ResellerTier;
  tierProgress: number;
  pendingPayouts: Payout[];
  topProducts: Product[];
  recentSales: Sale[];
}
```

---

### 2. Commission Management
**Purpose:** Track and manage reseller commissions

**Key Features:**
- Real-time commission tracking
- Commission rate configuration
- Multi-tier commission structure
- Commission history and details
- Commission calculation rules
- Commission adjustments and corrections
- Commission payout scheduling
- Commission reports and exports
- Commission dispute resolution
- Commission forecasting

**Technical Stack:**
- Database: PostgreSQL for commission data
- Cache: Redis for commission data (TTL: 15 minutes)
- Queue: BullMQ for commission calculations
- Analytics: Custom tracking service

**API Endpoints:**
```
GET /api/v1/reseller/commissions
GET /api/v1/reseller/commissions/:id
GET /api/v1/reseller/commissions/history
POST /api/v1/reseller/commissions/adjustments
GET /api/v1/reseller/commissions/forecast
GET /api/v1/reseller/commissions/reports
POST /api/v1/reseller/commissions/dispute
```

**Data Models:**
```typescript
interface Commission {
  id: string;
  resellerId: string;
  orderId: string;
  productId: string;
  amount: number;
  rate: number;
  tier: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED' | 'DISPUTED';
  calculatedAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
  disputeReason?: string;
  adjustmentHistory: CommissionAdjustment[];
}

interface CommissionAdjustment {
  id: string;
  commissionId: string;
  previousAmount: number;
  newAmount: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: Date;
}
```

---

### 3. Growth Tools
**Purpose:** Tools to help resellers grow their business

**Key Features:**
- Product recommendation engine
- Market trend analysis
- Competitor analysis
- Pricing optimization suggestions
- Inventory management tools
- Sales forecasting
- Customer segmentation
- A/B testing tools
- Conversion optimization tools
- Performance benchmarking

**Technical Stack:**
- Analytics: Custom analytics service
- Machine Learning: Python ML models for recommendations
- Database: PostgreSQL for growth data
- Cache: Redis for growth insights (TTL: 1 hour)
- Queue: BullMQ for background analysis

**API Endpoints:**
```
GET /api/v1/reseller/growth/recommendations
GET /api/v1/reseller/growth/trends
GET /api/v1/reseller/growth/competitors
GET /api/v1/reseller/growth/pricing
GET /api/v1/reseller/growth/forecast
GET /api/v1/reseller/growth/segments
POST /api/v1/reseller/growth/ab-test
GET /api/v1/reseller/growth/benchmark
```

**Data Models:**
```typescript
interface GrowthRecommendation {
  id: string;
  resellerId: string;
  type: 'PRODUCT' | 'PRICING' | 'MARKETING' | 'OPERATIONAL';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  expectedImpact: number;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';
  createdAt: Date;
}

interface MarketTrend {
  id: string;
  category: string;
  trend: 'RISING' | 'FALLING' | 'STABLE';
  changePercentage: number;
  period: string;
  insights: string[];
}
```

---

### 4. Marketing Automation
**Purpose:** Automated marketing campaigns and workflows

**Key Features:**
- Email campaign builder
- SMS campaign management
- Social media scheduling
- Campaign templates
- A/B testing for campaigns
- Lead nurturing workflows
- Drip campaigns
- Trigger-based automation
- Campaign analytics and reporting
- Multi-channel campaign management

**Technical Stack:**
- Email Service: SendGrid/Mailgun
- SMS Service: Twilio
- Social API: Facebook/LinkedIn/Twitter APIs
- Database: PostgreSQL for campaign data
- Queue: BullMQ for campaign execution
- Cache: Redis for campaign data (TTL: 30 minutes)

**API Endpoints:**
```
GET /api/v1/reseller/marketing/campaigns
POST /api/v1/reseller/marketing/campaigns
GET /api/v1/reseller/marketing/campaigns/:id
PUT /api/v1/reseller/marketing/campaigns/:id
DELETE /api/v1/reseller/marketing/campaigns/:id
POST /api/v1/reseller/marketing/campaigns/:id/launch
POST /api/v1/reseller/marketing/campaigns/:id/pause
GET /api/v1/reseller/marketing/templates
POST /api/v1/reseller/marketing/templates
POST /api/v1/reseller/marketing/workflows
GET /api/v1/reseller/marketing/analytics
```

**Data Models:**
```typescript
interface MarketingCampaign {
  id: string;
  resellerId: string;
  name: string;
  type: 'EMAIL' | 'SMS' | 'SOCIAL' | 'MULTI_CHANNEL';
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  channels: string[];
  templateId?: string;
  content: CampaignContent;
  targeting: CampaignTargeting;
  schedule: CampaignSchedule;
  analytics: CampaignAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

interface CampaignContent {
  subject?: string;
  body: string;
  media?: string[];
  callToAction?: string;
}

interface CampaignTargeting {
  segments: string[];
  excludeSegments?: string[];
  filters: Record<string, any>;
}
```

---

### 5. Analytics Platform
**Purpose:** Comprehensive analytics for reseller performance

**Key Features:**
- Real-time sales analytics
- Customer behavior analytics
- Product performance analytics
- Channel performance analytics
- Geographic analytics
- Time-based analytics
- Custom dashboards
- Exportable reports
- Data visualization
- Predictive analytics

**Technical Stack:**
- Analytics: Custom analytics service
- Database: PostgreSQL for analytics data
- Data Warehouse: ClickHouse for historical data
- Cache: Redis for analytics data (TTL: 10 minutes)
- Queue: BullMQ for report generation
- Visualization: Recharts/D3.js

**API Endpoints:**
```
GET /api/v1/reseller/analytics/overview
GET /api/v1/reseller/analytics/sales
GET /api/v1/reseller/analytics/customers
GET /api/v1/reseller/analytics/products
GET /api/v1/reseller/analytics/channels
GET /api/v1/reseller/analytics/geographic
GET /api/v1/reseller/analytics/custom
POST /api/v1/reseller/analytics/reports
GET /api/v1/reseller/analytics/predictions
```

**Data Models:**
```typescript
interface ResellerAnalytics {
  period: string;
  sales: SalesAnalytics;
  customers: CustomerAnalytics;
  products: ProductAnalytics[];
  channels: ChannelAnalytics[];
  geographic: GeographicAnalytics;
  trends: TrendData[];
}

interface SalesAnalytics {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  conversionRate: number;
  growthRate: number;
  breakdown: SalesBreakdown[];
}

interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  churnRate: number;
  lifetimeValue: number;
  segments: CustomerSegment[];
}
```

---

### 6. Lead Generation
**Purpose:** Tools and strategies for generating leads

**Key Features:**
- Lead capture forms
- Landing page builder
- Lead scoring system
- Lead qualification
- Lead nurturing
- Lead source tracking
- Lead import/export
- Lead segmentation
- Lead assignment rules
- Lead conversion tracking

**Technical Stack:**
- Database: PostgreSQL for lead data
- Cache: Redis for lead data (TTL: 30 minutes)
- Queue: BullMQ for lead processing
- Forms: Custom form builder
- Landing Pages: Next.js with dynamic routing

**API Endpoints:**
```
GET /api/v1/reseller/leads
POST /api/v1/reseller/leads
GET /api/v1/reseller/leads/:id
PUT /api/v1/reseller/leads/:id
DELETE /api/v1/reseller/leads/:id
POST /api/v1/reseller/leads/import
POST /api/v1/reseller/leads/export
GET /api/v1/reseller/leads/forms
POST /api/v1/reseller/leads/forms
GET /api/v1/reseller/leads/landing-pages
POST /api/v1/reseller/leads/landing-pages
POST /api/v1/reseller/leads/score
```

**Data Models:**
```typescript
interface Lead {
  id: string;
  resellerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  score: number;
  metadata: Record<string, any>;
  assignedTo?: string;
  convertedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LeadForm {
  id: string;
  resellerId: string;
  name: string;
  fields: FormField[];
  settings: FormSettings;
  embedCode: string;
  submissions: number;
  createdAt: Date;
}
```

---

### 7. Customer Retention
**Purpose:** Strategies and tools for customer retention

**Key Features:**
- Customer loyalty programs
- Reward points system
- Referral programs
- Customer feedback collection
- Satisfaction surveys
- Churn prediction
- Win-back campaigns
- Customer lifecycle management
- Personalized offers
- Subscription management

**Technical Stack:**
- Database: PostgreSQL for retention data
- Cache: Redis for retention data (TTL: 15 minutes)
- Queue: BullMQ for retention campaigns
- ML: Python ML models for churn prediction
- Analytics: Custom retention analytics

**API Endpoints:**
```
GET /api/v1/reseller/retention/customers
GET /api/v1/reseller/retention/loyalty
POST /api/v1/reseller/retention/loyalty/rewards
GET /api/v1/reseller/retention/referrals
POST /api/v1/reseller/retention/referrals
GET /api/v1/reseller/retention/feedback
POST /api/v1/reseller/retention/surveys
GET /api/v1/reseller/retention/churn-prediction
POST /api/v1/reseller/retention/win-back
GET /api/v1/reseller/retention/lifecycle
POST /api/v1/reseller/retention/offers
```

**Data Models:**
```typescript
interface LoyaltyProgram {
  id: string;
  resellerId: string;
  name: string;
  pointsPerPurchase: number;
  pointsPerReferral: number;
  redemptionRate: number;
  tiers: LoyaltyTier[];
  isActive: boolean;
  createdAt: Date;
}

interface CustomerLoyalty {
  id: string;
  customerId: string;
  programId: string;
  points: number;
  tier: string;
  rewardsRedeemed: number;
  lastActivity: Date;
}

interface ReferralProgram {
  id: string;
  resellerId: string;
  name: string;
  referrerReward: number;
  refereeReward: number;
  isActive: boolean;
  totalReferrals: number;
  totalRewards: number;
}
```

---

### 8. Multi-tier Support
**Purpose:** Manage multi-level reseller networks

**Key Features:**
- Tier configuration and management
- Tier advancement rules
- Tier-specific commission rates
- Sub-reseller management
- Network visualization
- Tier performance tracking
- Tier analytics
- Tier-based permissions
- Tier rewards and bonuses
- Network growth tracking

**Technical Stack:**
- Database: PostgreSQL for tier data
- Cache: Redis for tier data (TTL: 1 hour)
- Queue: BullMQ for tier calculations
- Graph: Neo4j for network visualization
- Analytics: Custom tier analytics

**API Endpoints:**
```
GET /api/v1/reseller/tiers
POST /api/v1/reseller/tiers
GET /api/v1/reseller/tiers/:id
PUT /api/v1/reseller/tiers/:id
DELETE /api/v1/reseller/tiers/:id
GET /api/v1/reseller/tiers/advancement
GET /api/v1/reseller/network
GET /api/v1/reseller/network/sub-resellers
GET /api/v1/reseller/network/performance
GET /api/v1/reseller/network/analytics
POST /api/v1/reseller/network/invite
```

**Data Models:**
```typescript
interface ResellerTier {
  id: string;
  name: string;
  level: number;
  commissionRate: number;
  minSales: number;
  minRevenue: number;
  benefits: string[];
  isActive: boolean;
  resellersCount: number;
}

interface ResellerNetwork {
  resellerId: string;
  tier: string;
  subResellers: SubReseller[];
  totalNetworkRevenue: number;
  totalNetworkSales: number;
  depth: number;
  growthRate: number;
}

interface SubReseller {
  id: string;
  name: string;
  email: string;
  tier: string;
  sales: number;
  revenue: number;
  joinedAt: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              PC-3: Reseller + Growth OS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Reseller     │  │ Commission   │  │ Growth       │        │
│  │ Dashboard    │  │ Management   │  │ Tools        │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                 │                 │
│         ▼                 ▼                 ▼                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Reseller Data Layer                     │    │
│  │  (Profile, Revenue, Commissions, Analytics)        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Marketing    │  │ Analytics    │  │ Lead         │        │
│  │ Automation   │  │ Platform     │  │ Generation   │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                 │                 │
│         ▼                 ▼                 ▼                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Marketing Data Layer                   │    │
│  │  (Campaigns, Leads, Forms, Landing Pages)         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Customer     │  │ Multi-tier   │  │ Network      │        │
│  │ Retention    │  │ Support      │  │ Management   │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                 │                 │
│         ▼                 ▼                 ▼                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Network Data Layer                     │    │
│  │  (Tiers, Sub-resellers, Loyalty, Referrals)       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Extensions

### Reseller Profiles Table
```sql
CREATE TABLE IF NOT EXISTS reseller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  tax_id VARCHAR(100),
  tier_id UUID REFERENCES reseller_tiers(id),
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  commission_rate DECIMAL(5, 2) DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  total_commissions DECIMAL(15, 2) DEFAULT 0,
  parent_reseller_id UUID REFERENCES reseller_profiles(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reseller_profiles_user_id ON reseller_profiles(user_id);
CREATE INDEX idx_reseller_profiles_tier_id ON reseller_profiles(tier_id);
CREATE INDEX idx_reseller_profiles_parent_id ON reseller_profiles(parent_reseller_id);
```

### Reseller Tiers Table
```sql
CREATE TABLE IF NOT EXISTS reseller_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  level INTEGER NOT NULL UNIQUE,
  commission_rate DECIMAL(5, 2) NOT NULL,
  min_sales INTEGER DEFAULT 0,
  min_revenue DECIMAL(15, 2) DEFAULT 0,
  benefits JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reseller_tiers_level ON reseller_tiers(level);
```

### Commissions Table
```sql
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  rate DECIMAL(5, 2) NOT NULL,
  tier INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  calculated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  dispute_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_reseller_id ON commissions(reseller_id);
CREATE INDEX idx_commissions_order_id ON commissions(order_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_calculated_at ON commissions(calculated_at);
```

### Commission Adjustments Table
```sql
CREATE TABLE IF NOT EXISTS commission_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  previous_amount DECIMAL(15, 2) NOT NULL,
  new_amount DECIMAL(15, 2) NOT NULL,
  reason TEXT NOT NULL,
  adjusted_by UUID NOT NULL REFERENCES users(id),
  adjusted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commission_adjustments_commission_id ON commission_adjustments(commission_id);
```

### Marketing Campaigns Table
```sql
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  channels JSONB,
  template_id UUID,
  content JSONB NOT NULL,
  targeting JSONB,
  schedule JSONB,
  analytics JSONB,
  launched_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marketing_campaigns_reseller_id ON marketing_campaigns(reseller_id);
CREATE INDEX idx_marketing_campaigns_status ON marketing_campaigns(status);
```

### Campaign Templates Table
```sql
CREATE TABLE IF NOT EXISTS campaign_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  media JSONB,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_campaign_templates_reseller_id ON campaign_templates(reseller_id);
```

### Leads Table
```sql
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'NEW',
  score INTEGER DEFAULT 0,
  metadata JSONB,
  assigned_to UUID REFERENCES users(id),
  converted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_reseller_id ON leads(reseller_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_score ON leads(score);
```

### Lead Forms Table
```sql
CREATE TABLE IF NOT EXISTS lead_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  fields JSONB NOT NULL,
  settings JSONB,
  embed_code TEXT,
  submissions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lead_forms_reseller_id ON lead_forms(reseller_id);
```

### Landing Pages Table
```sql
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  settings JSONB,
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(reseller_id, slug)
);

CREATE INDEX idx_landing_pages_reseller_id ON landing_pages(reseller_id);
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
```

### Loyalty Programs Table
```sql
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  points_per_purchase INTEGER DEFAULT 1,
  points_per_referral INTEGER DEFAULT 100,
  redemption_rate DECIMAL(10, 2) DEFAULT 0.01,
  tiers JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loyalty_programs_reseller_id ON loyalty_programs(reseller_id);
```

### Customer Loyalty Table
```sql
CREATE TABLE IF NOT EXISTS customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  tier VARCHAR(50),
  rewards_redeemed INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, program_id)
);

CREATE INDEX idx_customer_loyalty_customer_id ON customer_loyalty(customer_id);
CREATE INDEX idx_customer_loyalty_program_id ON customer_loyalty(program_id);
```

### Referral Programs Table
```sql
CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  referrer_reward DECIMAL(15, 2) NOT NULL,
  referee_reward DECIMAL(15, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  total_referrals INTEGER DEFAULT 0,
  total_rewards DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referral_programs_reseller_id ON referral_programs(reseller_id);
```

### Referrals Table
```sql
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES referral_programs(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  reward_amount DECIMAL(15, 2),
  converted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referrals_program_id ON referrals(program_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
```

### Growth Recommendations Table
```sql
CREATE TABLE IF NOT EXISTS growth_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES reseller_profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  expected_impact DECIMAL(5, 2),
  effort VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_growth_recommendations_reseller_id ON growth_recommendations(reseller_id);
CREATE INDEX idx_growth_recommendations_status ON growth_recommendations(status);
```

---

## API Routes Structure

```
/api/v1/reseller/
├── dashboard
│   ├── GET /
│   ├── GET /revenue
│   ├── GET /commissions
│   ├── GET /sales
│   ├── GET /customers
│   ├── GET /licenses
│   ├── GET /payouts
│   ├── GET /tiers
│   └── GET /goals
├── commissions
│   ├── GET /
│   ├── GET /:id
│   ├── GET /history
│   ├── POST /adjustments
│   ├── GET /forecast
│   ├── GET /reports
│   └── POST /dispute
├── growth
│   ├── GET /recommendations
│   ├── GET /trends
│   ├── GET /competitors
│   ├── GET /pricing
│   ├── GET /forecast
│   ├── GET /segments
│   ├── POST /ab-test
│   └── GET /benchmark
├── marketing
│   ├── GET /campaigns
│   ├── POST /campaigns
│   ├── GET /campaigns/:id
│   ├── PUT /campaigns/:id
│   ├── DELETE /campaigns/:id
│   ├── POST /campaigns/:id/launch
│   ├── POST /campaigns/:id/pause
│   ├── GET /templates
│   ├── POST /templates
│   ├── POST /workflows
│   └── GET /analytics
├── analytics
│   ├── GET /overview
│   ├── GET /sales
│   ├── GET /customers
│   ├── GET /products
│   ├── GET /channels
│   ├── GET /geographic
│   ├── GET /custom
│   ├── POST /reports
│   └── GET /predictions
├── leads
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   ├── POST /import
│   ├── POST /export
│   ├── GET /forms
│   ├── POST /forms
│   ├── GET /landing-pages
│   ├── POST /landing-pages
│   └── POST /score
├── retention
│   ├── GET /customers
│   ├── GET /loyalty
│   ├── POST /loyalty/rewards
│   ├── GET /referrals
│   ├── POST /referrals
│   ├── GET /feedback
│   ├── POST /surveys
│   ├── GET /churn-prediction
│   ├── POST /win-back
│   ├── GET /lifecycle
│   └── POST /offers
├── tiers
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   └── GET /advancement
└── network
    ├── GET /
    ├── GET /sub-resellers
    ├── GET /performance
    ├── GET /analytics
    └── POST /invite
```

---

## Performance Optimization

### Caching Strategy
- Dashboard metrics: Redis (5 min TTL)
- Commission data: Redis (15 min TTL)
- Growth recommendations: Redis (1 hour TTL)
- Marketing campaigns: Redis (30 min TTL)
- Analytics data: Redis (10 min TTL)
- Lead data: Redis (30 min TTL)
- Loyalty data: Redis (15 min TTL)
- Tier data: Redis (1 hour TTL)

### Database Optimization
- Materialized views for analytics
- Partitioning for large tables (commissions, leads, referrals)
- Connection pooling (PgBouncer)
- Read replicas for reporting
- Indexes on frequently queried fields

### Background Processing
- Commission calculation (real-time + batch)
- Campaign execution (scheduled)
- Lead scoring (batch)
- Growth recommendation generation (daily)
- Analytics aggregation (hourly)
- Churn prediction (daily)
- Tier advancement calculation (daily)

---

## Monitoring & Analytics

### Key Metrics
- Reseller registration rate
- Commission payout accuracy
- Campaign open/click rates
- Lead conversion rate
- Customer retention rate
- Referral program participation
- Tier advancement rate
- Network growth rate
- Average reseller revenue
- Churn prediction accuracy

### Alerts
- Dashboard load time > 3s
- Commission calculation failure
- Campaign execution failure
- Lead form submission failure
- Loyalty points calculation error
- Referral tracking failure
- Tier advancement calculation error
- Network data sync failure

---

## Security Considerations

- Reseller verification and KYC
- Commission fraud detection
- Lead data encryption (PII)
- Campaign content validation
- Landing page XSS protection
- Referral link validation
- Tier permission enforcement
- Network data access control
- Rate limiting on all endpoints
- CSRF protection
- Input sanitization

---

## Future Enhancements

- AI-powered lead scoring
- Automated campaign optimization
- Predictive customer lifetime value
- Advanced churn prevention
- Blockchain-based commission tracking
- Smart contract integration for payouts
- Voice-activated analytics
- AR/VR product showcases for resellers
- Social selling integration
- Marketplace integration for reseller products
