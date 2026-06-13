# 🤖 AI API Manager - Central Nervous System of Software Vala

## Project Overview

The **AI API Manager** is the central nervous system of Software Vala - a unified platform for managing all APIs, AI providers, integrations, and services across the entire ecosystem.

### Core Principles
✅ Use existing systems first (no duplication)  
✅ Mark missing data as "Pending Discovery" instead of faking  
✅ Build around existing foundation  
✅ Every module must register through AI API Manager  
✅ Single source of truth for entire API ecosystem  

---

## 📦 What's Been Built

### Phase 1: Core Data Models (`src/types/apiManager.ts`)

#### API Registry Entry
- **Name, Provider, Category, Owner, Department**
- **Purpose, Description, Status, Version, Environment**
- **Base URL, API Key (encrypted), Custom Headers**
- **Daily/Monthly Usage, Quota, Cost Tracking**
- **Health Metrics**: Latency, Response Time, Error Rate, Uptime
- **Dependencies**: Connected modules, products, agents, customers
- **Security**: Risk level, security score, data classification
- **Audit Trail**: Created by/at, updated by/at, last used

#### AI Provider Registry
- **Type**: OpenAI, Claude, Gemini, DeepSeek, Grok, Mistral, Llama, OpenRouter, Perplexity, Custom, Local, Enterprise
- **Models**: Name, model ID, version, capability type (text, vision, embedding, audio, multimodal)
- **Pricing**: Cost per 1k tokens, rate limits, max tokens
- **Health**: Status, health score, last health check
- **Access Control**: Allowed departments, allowed roles
- **Usage**: Monthly usage, monthly spend, tokens used, remaining quota

#### Additional Registries
- **ProviderRegistry**: Payment processors, messaging, storage providers
- **ServiceRegistry**: Internal services and microservices
- **SDKRegistry**: Language-specific SDKs with versions
- **WebhookRegistry**: Event webhooks with delivery tracking
- **ConnectorRegistry**: Data sync connectors with sync frequency
- **IntegrationRegistry**: Complex integration flows

#### Monitoring & Metrics
- **APIHealthMetrics**: Per-request latency, response time, status, error tracking
- **ProviderHealthStatus**: Uptime, downtime, incidents, alerts
- **UsageMetrics**: Hourly/daily/weekly/monthly/yearly tracking
- **BillingEntry**: Cost per API per period
- **WalletEntry**: Balance, auto-recharge, transaction history

#### Security
- **APIPermission**: Role-based access control
- **APIKey**: Hashed storage with whitelist/rate limit per key
- **SecurityThreat**: Detection of rate limits, unauthorized access, suspicious activity

#### Audit & Alerts
- **AuditEntry**: Every action logged (created, modified, deleted, used, approved, etc.)
- **AlertItem**: 9 alert types (usage, cost, security, provider, quota, fraud, abuse, downtime, billing)

---

### Phase 2: Service Layer (`src/services/apiManager.ts`)

The `APIManagerService` is a singleton that provides 100+ methods for ecosystem management:

#### API Registry Operations
```typescript
// Register new API
registerAPI(apiData: Partial<APIRegistryEntry>): APIRegistryEntry

// Retrieve APIs
getAPI(apiId: string): APIRegistryEntry | undefined
getAllAPIs(filters?: { status?, provider?, category? }): APIRegistryEntry[]

// Update/Delete
updateAPI(apiId: string, updates: Partial, updatedBy: string): APIRegistryEntry
deleteAPI(apiId: string, deletedBy: string): boolean
```

#### Discovery Engine
```typescript
// Auto-scan for APIs, providers, services
discoverAPIs(): Promise<DiscoveryResult>

// Environment variable scanning
scanEnvironmentVariables(): Record<string, string>

// Supported patterns
OPENAI_API_KEY, CLAUDE_API_KEY, GEMINI_API_KEY, STRIPE_, PAYPAL_, TWILIO_, SENDGRID_, WHATSAPP_, DATABASE_, AWS_, AZURE_, GCP_
```

#### Usage Tracking
```typescript
recordUsage(apiId: string, count: number, cost: number, unit: string)
getUsageMetrics(apiId: string, period: 'hourly'|'daily'|'monthly'): UsageMetrics[]
```

#### Health Monitoring
```typescript
recordHealthMetrics(apiId: string, metrics: Partial<APIHealthMetrics>)
getProviderHealth(providerId: string): ProviderHealthStatus
```

#### Alert Management
```typescript
createAlert(alert: Omit<AlertItem, 'id'|'timestamp'>): AlertItem
getAlerts(filters?: { type?, severity?, apiId? }): AlertItem[]
```

#### Dashboard Metrics
```typescript
getDashboardMetrics(): DashboardMetrics
  - totalApiCount, activeApiCount, inactiveApiCount
  - aiApiCount, nonAiApiCount
  - todayUsage, weeklyUsage, monthlyUsage
  - monthlySpend, walletBalance
  - healthScore, costScore, reliabilityScore, usageScore
  - riskAlerts, securityAlerts, providerAlerts
  - onlineProviders, offlineProviders, degradedProviders
```

#### Audit Logging
```typescript
private logAudit(action: AuditAction, resourceType, resourceId, actor, details)
getAuditLog(filters?: { action?, resourceId?, actor? }): AuditEntry[]
```

---

### Phase 3: Dashboard Page (`src/pages/AIAPIManagerDashboard.tsx`)

#### Overview Tab (Primary)
**Key Metrics Cards:**
- 🔌 Total APIs Connected
- ✅ Active APIs
- 🤖 AI APIs
- 📈 Today's Usage
- 💰 Monthly Spend
- 💚 Overall Health
- 🎯 Reliability Score
- 💳 Cost Efficiency

**Alert Summary:**
- ⚠️ Risk Alerts
- 🔒 Security Alerts
- 🚨 Provider Alerts

**Provider Status:**
- 🟢 Online Providers
- 🟡 Degraded Providers
- 🔴 Offline Providers

**Tab Navigation:**
- 📊 Overview (current)
- 🔌 APIs (drill-down to API registry)
- 🏢 Providers (drill-down to provider registry)
- 💚 Health (drill-down to health center)
- 💰 Cost (drill-down to billing)
- 🔒 Security (drill-down to security center)

#### Design Features
- Real-time metrics (5-second refresh)
- Gradient backgrounds with NEON color scheme
- Hover effects and interactive drill-downs
- Responsive grid layout
- Score visualization bars
- Status indicators with pulse animation

---

### Phase 4: API Registry Page (`src/pages/APIRegistryPage.tsx`)

#### Features
**Discovery & Registration:**
- 🔍 "Scan for APIs" - Triggers discovery engine
- ➕ "Register API" - Manual API registration form

**Filtering:**
- Search by name or provider
- Status filter: All, Online, Offline, Degraded, Pending Discovery
- Real-time filtering

**API Table (7 columns):**
| Column | Content |
|--------|---------|
| API Name | Category icon + name |
| Provider | Provider name |
| Status | Color-coded badge |
| Usage | Monthly usage count |
| Health | Progress bar + percentage |
| Cost | Dollar amount |
| Action | View detail button |

**Features:**
- Discovery result feedback
- Hover row highlighting
- Category icons (🤖 AI, 💳 Payment, 💬 Messaging, etc.)
- Sortable/filterable display
- Count summary

---

## 🛠️ Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                     Software Vala                          │
│              (All Modules, Products, Agents)              │
└────────────────────────────────────────────────────────────┘
                           │
                           │ Must Register Through
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              🤖 AI API Manager (Central Hub)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Unified Dashboard & Monitoring                       │   │
│  │ • Real-time metrics                                  │   │
│  │ • Health scoring & alerts                            │   │
│  │ • Cost tracking & optimization                       │   │
│  │ • Security center                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Registries                                           │   │
│  │ • API Registry        • SDK Registry                 │   │
│  │ • AI Provider Reg     • Webhook Registry             │   │
│  │ • Provider Reg        • Connector Registry           │   │
│  │ • Service Reg         • Integration Registry         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Discovery Engine                                     │   │
│  │ • Scan environment variables                         │   │
│  │ • Auto-detect APIs & providers                       │   │
│  │ • Map dependencies                                   │   │
│  │ • Track all connections                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Monitoring & Management                              │   │
│  │ • Health tracking     • Usage analytics              │   │
│  │ • Latency monitoring  • Uptime tracking              │   │
│  │ • Alert system        • Audit logging                │   │
│  │ • Cost optimization   • Emergency controls           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
    │              │              │              │
    ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│OpenAI    │  │Stripe    │  │WhatsApp  │  │Custom    │
│Claude    │  │PayPal    │  │SendGrid  │  │Services  │
│Gemini    │  │Razorpay  │  │Twilio    │  │Internal  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## 📊 Key Metrics Tracked

### Usage Metrics
- Daily requests per API
- Monthly request count
- Hourly/Daily/Weekly/Monthly/Yearly aggregates
- Data transferred (GB)
- Quota utilization

### Health Metrics
- API latency (milliseconds)
- Response time
- HTTP status codes
- Error rate (percentage)
- Success rate (percentage)
- Uptime (percentage)
- Health score (0-100)

### Cost Metrics
- Per-request cost
- Monthly spend per API
- Provider billing
- Module/Product cost allocation
- Agent cost tracking
- Budget monitoring

### Security Metrics
- API key age
- IP whitelist violations
- Rate limit breaches
- Unauthorized access attempts
- Threat severity levels
- Audit trail completeness

---

## 🚀 Usage Examples

### Register an API
```typescript
const api = apiManagerService.registerAPI({
  name: 'OpenAI GPT-4',
  provider: 'OpenAI',
  category: APICategory.AI_MODEL,
  owner: 'AI-Team',
  purpose: 'Main LLM provider',
  status: APIStatus.ONLINE,
  version: '4',
  environment: 'production',
  createdBy: 'user-123'
});
```

### Record Usage
```typescript
apiManagerService.recordUsage(
  apiId,
  1500,          // number of requests
  12.50,         // cost
  'request'      // unit
);
```

### Get Dashboard Metrics
```typescript
const metrics = apiManagerService.getDashboardMetrics();
console.log(`Total APIs: ${metrics.totalApiCount}`);
console.log(`Monthly Spend: $${metrics.monthlySpend}`);
console.log(`Health Score: ${metrics.totalHealthScore}%`);
```

### Discover APIs
```typescript
const result = await apiManagerService.discoverAPIs();
console.log(`Found ${result.foundApis.length} APIs`);
console.log(`Registered ${result.registeredCount} new APIs`);
```

### Create Alert
```typescript
apiManagerService.createAlert({
  type: AlertType.COST_ALERT,
  severity: 'high',
  message: 'OpenAI spending exceeded threshold',
  apiId: 'api_123'
});
```

---

## 📁 File Structure

```
src/
├── types/
│   └── apiManager.ts          # Complete type definitions (500+ lines)
├── services/
│   └── apiManager.ts          # APIManagerService (1000+ lines)
└── pages/
    ├── AIAPIManagerDashboard.tsx    # Main dashboard (700+ lines)
    └── APIRegistryPage.tsx          # API registry UI (400+ lines)
```

---

## 🎯 Next Implementation Phases

### Phase 5: AI Providers Registry
- View all AI models (OpenAI, Claude, Gemini, etc.)
- Switch between providers
- Model selection interface
- Cost comparison
- Token usage tracking

### Phase 6: Health Monitoring
- Real-time uptime graphs
- Incident tracking
- SLA monitoring
- Automatic recovery suggestions
- Downtime notifications

### Phase 7: Billing & Cost
- Monthly spend breakdown
- Cost per API/provider/product
- Budget alerts
- Wallet management
- Invoice generation

### Phase 8: Security Center
- API key management
- Permission controls
- Threat detection dashboard
- Audit trail viewer
- Emergency kill switches

### Phase 9: Advanced Features
- AI Cost Optimizer (detect unused, expensive, dead APIs)
- Dependency mapping
- Automatic backups
- Disaster recovery
- Multi-region failover

---

## 🔌 Integration Points

### Existing Systems Integration
✅ Uses existing authentication  
✅ Uses existing role-based guards  
✅ Uses existing event bus for real-time updates  
✅ Uses existing dashboard components  
✅ Compatible with existing services layer  

### Auto-Detection Capabilities
✅ Environment variables (.env files)  
✅ API Key patterns (API_KEY, _TOKEN, _SECRET)  
✅ Database connections  
✅ External service configurations  

### Supported Providers (Auto-detected)
- OpenAI, Claude, Gemini, DeepSeek (AI)
- Stripe, PayPal, Razorpay, PayU (Payments)
- Twilio, SendGrid, WhatsApp, Meta (Messaging)
- AWS, Azure, Google Cloud, Cloudflare (Cloud)
- And more...

---

## 💡 Design Decisions

### Data Models
- **API-first design**: Everything is an API or service
- **Loose coupling**: Registries are independent
- **Audit trail**: Every action is logged
- **No data duplication**: Single source of truth
- **Discovery-first**: Mark unknown as "Pending" not fake

### Service Layer
- **Singleton pattern**: Single instance manages entire ecosystem
- **In-memory storage**: Ready for persistence layer
- **Transaction logging**: Automatic audit trail
- **Real-time metrics**: Continuous health tracking
- **Extensible design**: Easy to add new registries

### UI/UX
- **Dashboard-centric**: Single entry point
- **Drill-down capability**: Detail views for each metric
- **Real-time updates**: 5-second refresh
- **Dark theme**: NEON color scheme
- **Responsive design**: Works on all screen sizes

---

## 📋 Checklist

- [x] Core data models
- [x] Service layer with 100+ methods
- [x] Main dashboard page
- [x] API registry page
- [ ] AI providers registry page
- [ ] Health monitoring page
- [ ] Billing & cost page
- [ ] Security center page
- [ ] Detail pages for each API
- [ ] Emergency controls
- [ ] Real-time event integration
- [ ] Persistence layer (database)
- [ ] Export/reporting features
- [ ] Mobile optimization

---

## 🎓 Key Learnings

1. **Central Hub Pattern**: Single API manager service reduces complexity
2. **Discovery First**: Auto-detect before manual registration
3. **Audit Everything**: Log all actions for compliance
4. **Metrics-Driven**: Health scores guide decision-making
5. **Cost Awareness**: Track every API's financial impact
6. **Security by Default**: Encrypt sensitive data, RBAC for access

---

## 📞 Support & Documentation

For implementation questions:
1. Review `/types/apiManager.ts` for data structures
2. Check `/services/apiManager.ts` for available methods
3. Study `/pages/AIAPIManagerDashboard.tsx` for dashboard patterns
4. Reference `/pages/APIRegistryPage.tsx` for UI patterns

---

**Last Updated**: 2026-06-12  
**Version**: 1.0 - MVP  
**Status**: Ready for Phase 5 implementation  
