/**
 * MongoDB Models for AI API Manager
 * Real database schema for all registries
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================================================
// API REGISTRY MODEL
// ============================================================================

export interface IAPIRegistry extends Document {
  name: string;
  provider: string;
  category: string;
  owner: string;
  department?: string;
  purpose: string;
  description?: string;
  status: string;
  version?: string;
  environment: 'development' | 'staging' | 'production';
  baseUrl?: string;
  apiKey?: string; // Encrypted
  apiSecret?: string; // Encrypted
  customHeaders?: Record<string, string>;

  // Usage & Cost
  dailyUsage: number;
  monthlyUsage: number;
  monthlyQuota?: number;
  cost: number;
  costCurrency: string;

  // Health Metrics
  latency: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
  lastHealthCheck: Date;
  healthScore: number;

  // Dependencies
  connectedModules: string[];
  connectedProducts: string[];
  connectedAgents: string[];
  connectedCustomers?: string[];

  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  lastUsedAt?: Date;

  // Risk & Security
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  securityScore: number;
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

const APIRegistrySchema = new Schema<IAPIRegistry>(
  {
    name: { type: String, required: true, index: true },
    provider: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    owner: { type: String, required: true },
    department: String,
    purpose: { type: String, required: true },
    description: String,
    status: { type: String, required: true, default: 'pending_discovery', index: true },
    version: String,
    environment: { type: String, enum: ['development', 'staging', 'production'], default: 'production' },
    baseUrl: String,
    apiKey: String,
    apiSecret: String,
    customHeaders: Schema.Types.Mixed,

    dailyUsage: { type: Number, default: 0 },
    monthlyUsage: { type: Number, default: 0 },
    monthlyQuota: Number,
    cost: { type: Number, default: 0 },
    costCurrency: { type: String, default: 'USD' },

    latency: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 },
    uptime: { type: Number, default: 100 },
    lastHealthCheck: { type: Date, default: Date.now },
    healthScore: { type: Number, default: 0 },

    connectedModules: [String],
    connectedProducts: [String],
    connectedAgents: [String],
    connectedCustomers: [String],

    lastUsedAt: Date,

    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    securityScore: { type: Number, default: 0 },
    dataClassification: String,
    requiresApproval: Boolean,
    approvalStatus: String,
  },
  {
    timestamps: true,
  }
);

APIRegistrySchema.index({ provider: 1, environment: 1 });
APIRegistrySchema.index({ status: 1, updatedAt: -1 });

export const APIRegistry = mongoose.model<IAPIRegistry>('APIRegistry', APIRegistrySchema);

// ============================================================================
// AI PROVIDER MODEL
// ============================================================================

export interface IAIProvider extends Document {
  type: string;
  name: string;
  displayName: string;
  apiKey?: string;
  apiSecret?: string;
  customHeaders?: Record<string, string>;

  models: {
    id: string;
    name: string;
    modelId: string;
    version: string;
    capabilityType: string;
    costPer1kTokens: number;
    rateLimitPerMinute?: number;
    maxTokens?: number;
    contextWindow?: number;
    status: string;
    lastUpdated: Date;
  }[];

  defaultModel?: string;
  monthlyUsage: number;
  monthlySpend: number;
  tokensUsed?: number;
  remainingQuota?: number;

  status: string;
  healthScore: number;
  lastHealthCheck: Date;

  requestTimeout?: number;
  retryAttempts?: number;
  rateLimitPerMinute?: number;

  allowedDepartments?: string[];
  allowedRoles?: string[];

  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  lastUsedAt?: Date;
}

const AIProviderSchema = new Schema<IAIProvider>(
  {
    type: { type: String, required: true, index: true },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    apiKey: String,
    apiSecret: String,
    customHeaders: Schema.Types.Mixed,

    models: [
      {
        id: String,
        name: String,
        modelId: String,
        version: String,
        capabilityType: String,
        costPer1kTokens: Number,
        rateLimitPerMinute: Number,
        maxTokens: Number,
        contextWindow: Number,
        status: String,
        lastUpdated: Date,
      },
    ],

    defaultModel: String,
    monthlyUsage: { type: Number, default: 0 },
    monthlySpend: { type: Number, default: 0 },
    tokensUsed: Number,
    remainingQuota: Number,

    status: { type: String, default: 'pending_discovery', index: true },
    healthScore: { type: Number, default: 0 },
    lastHealthCheck: { type: Date, default: Date.now },

    requestTimeout: Number,
    retryAttempts: Number,
    rateLimitPerMinute: Number,

    allowedDepartments: [String],
    allowedRoles: [String],

    createdBy: { type: String, default: 'system' },
    updatedBy: { type: String, default: 'system' },
    lastUsedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const AIProvider = mongoose.model<IAIProvider>('AIProvider', AIProviderSchema);

// ============================================================================
// PROVIDER REGISTRY MODEL
// ============================================================================

export interface IProvider extends Document {
  name: string;
  category: string;
  apiEndpoint: string;
  status: string;
  connectedApis: string[];
  health: number;
  uptime: number;
  lastHealthCheck: Date;
  cost: number;
  usage: number;
  riskLevel: string;
  dependencies: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true },
    apiEndpoint: { type: String, required: true },
    status: { type: String, default: 'pending_discovery', index: true },
    connectedApis: [String],
    health: { type: Number, default: 0 },
    uptime: { type: Number, default: 100 },
    lastHealthCheck: { type: Date, default: Date.now },
    cost: { type: Number, default: 0 },
    usage: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    dependencies: [String],
    owner: { type: String, default: 'system' },
  },
  {
    timestamps: true,
  }
);

export const Provider = mongoose.model<IProvider>('Provider', ProviderSchema);

// ============================================================================
// SERVICE REGISTRY MODEL
// ============================================================================

export interface IService extends Document {
  name: string;
  description: string;
  type: string;
  status: string;
  connectedApis: string[];
  endpoints: string[];
  documentation?: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 'pending_discovery', index: true },
    connectedApis: [String],
    endpoints: [String],
    documentation: String,
    owner: { type: String, default: 'system' },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>('Service', ServiceSchema);

// ============================================================================
// WEBHOOK REGISTRY MODEL
// ============================================================================

export interface IWebhook extends Document {
  name: string;
  event: string;
  targetUrl: string;
  provider: string;
  status: string;
  lastDelivery?: Date;
  failureCount: number;
  successCount: number;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookSchema = new Schema<IWebhook>(
  {
    name: { type: String, required: true },
    event: { type: String, required: true, index: true },
    targetUrl: { type: String, required: true },
    provider: { type: String, required: true },
    status: { type: String, default: 'pending_discovery', index: true },
    lastDelivery: Date,
    failureCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    owner: { type: String, default: 'system' },
  },
  {
    timestamps: true,
  }
);

export const Webhook = mongoose.model<IWebhook>('Webhook', WebhookSchema);

// ============================================================================
// CONNECTOR REGISTRY MODEL
// ============================================================================

export interface IConnector extends Document {
  name: string;
  sourceApi: string;
  targetApi: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  status: string;
  lastSync?: Date;
  failureCount: number;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectorSchema = new Schema<IConnector>(
  {
    name: { type: String, required: true },
    sourceApi: { type: String, required: true },
    targetApi: { type: String, required: true },
    syncFrequency: { type: String, enum: ['realtime', 'hourly', 'daily', 'weekly'], default: 'daily' },
    status: { type: String, default: 'pending_discovery', index: true },
    lastSync: Date,
    failureCount: { type: Number, default: 0 },
    owner: { type: String, default: 'system' },
  },
  {
    timestamps: true,
  }
);

export const Connector = mongoose.model<IConnector>('Connector', ConnectorSchema);

// ============================================================================
// INTEGRATION REGISTRY MODEL
// ============================================================================

export interface IIntegration extends Document {
  name: string;
  description: string;
  apis: string[];
  services: string[];
  status: string;
  integrationType: 'flow' | 'sync' | 'event' | 'webhook' | 'scheduled';
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    apis: [String],
    services: [String],
    status: { type: String, default: 'pending_discovery', index: true },
    integrationType: { type: String, enum: ['flow', 'sync', 'event', 'webhook', 'scheduled'], default: 'flow' },
    owner: { type: String, default: 'system' },
  },
  {
    timestamps: true,
  }
);

export const Integration = mongoose.model<IIntegration>('Integration', IntegrationSchema);

// ============================================================================
// USAGE METRICS MODEL
// ============================================================================

export interface IUsageMetrics extends Document {
  apiId: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  requestCount: number;
  dataTransferred: number;
  cost: number;
  unit: string;
  createdAt: Date;
}

const UsageMetricsSchema = new Schema<IUsageMetrics>(
  {
    apiId: { type: String, required: true, index: true },
    period: { type: String, required: true },
    requestCount: { type: Number, required: true },
    dataTransferred: { type: Number, default: 0 },
    cost: { type: Number, required: true },
    unit: { type: String, default: 'request' },
  },
  {
    timestamps: true,
  }
);

UsageMetricsSchema.index({ apiId: 1, period: 1, createdAt: -1 });

export const UsageMetrics = mongoose.model<IUsageMetrics>('UsageMetrics', UsageMetricsSchema);

// ============================================================================
// ALERT MODEL
// ============================================================================

export interface IAlert extends Document {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  apiId?: string;
  providerId?: string;
  status: 'new' | 'acknowledged' | 'resolved';
  actionRequired?: boolean;
  suggestedAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    type: { type: String, required: true, index: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    message: { type: String, required: true },
    apiId: String,
    providerId: String,
    status: { type: String, enum: ['new', 'acknowledged', 'resolved'], default: 'new' },
    actionRequired: Boolean,
    suggestedAction: String,
  },
  {
    timestamps: true,
  }
);

AlertSchema.index({ type: 1, severity: 1, status: 1 });

export const Alert = mongoose.model<IAlert>('Alert', AlertSchema);

// ============================================================================
// AUDIT LOG MODEL
// ============================================================================

export interface IAuditLog extends Document {
  action: string;
  actor: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    actor: { type: String, required: true, index: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true },
    details: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

AuditLogSchema.index({ action: 1, actor: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

// ============================================================================
// API KEY MODEL
// ============================================================================

export interface IAPIKey extends Document {
  apiId: string;
  name: string;
  keyHash: string;
  createdBy: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  status: 'active' | 'revoked' | 'expired';
  ipWhitelist?: string[];
  rateLimitPerMinute?: number;
  createdAt: Date;
  updatedAt: Date;
}

const APIKeySchema = new Schema<IAPIKey>(
  {
    apiId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    keyHash: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true },
    lastUsedAt: Date,
    expiresAt: Date,
    status: { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
    ipWhitelist: [String],
    rateLimitPerMinute: Number,
  },
  {
    timestamps: true,
  }
);

export const APIKey = mongoose.model<IAPIKey>('APIKey', APIKeySchema);

// ============================================================================
// BILLING MODEL
// ============================================================================

export interface IBilling extends Document {
  apiId: string;
  period: Date;
  cost: number;
  currency: string;
  usageCount: number;
  unit: string;
  invoice?: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const BillingSchema = new Schema<IBilling>(
  {
    apiId: { type: String, required: true, index: true },
    period: { type: Date, required: true },
    cost: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    usageCount: { type: Number, required: true },
    unit: { type: String, required: true },
    invoice: String,
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  },
  {
    timestamps: true,
  }
);

BillingSchema.index({ apiId: 1, period: -1 });

export const Billing = mongoose.model<IBilling>('Billing', BillingSchema);

// ============================================================================
// WALLET MODEL
// ============================================================================

export interface IWallet extends Document {
  userId: string;
  balance: number;
  currency: string;
  lastRecharge: Date;
  autoRecharge: boolean;
  rechargeThreshold: number;
  transactionHistory: {
    type: 'credit' | 'debit' | 'refund';
    amount: number;
    reason: string;
    relatedApiId?: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'USD' },
    lastRecharge: Date,
    autoRecharge: { type: Boolean, default: false },
    rechargeThreshold: { type: Number, default: 100 },
    transactionHistory: [
      {
        type: String,
        amount: Number,
        reason: String,
        relatedApiId: String,
        timestamp: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
