/**
 * AI API Manager - Core Types & Models
 * Central nervous system for managing all APIs, AI providers, and integrations
 */

// ============================================================================
// API REGISTRY TYPES
// ============================================================================

export enum APIStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  DEGRADED = 'degraded',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  FAILED = 'failed',
  PENDING_DISCOVERY = 'pending_discovery'
}

export enum APICategory {
  AI_MODEL = 'ai_model',
  PAYMENT = 'payment',
  MESSAGING = 'messaging',
  EMAIL = 'email',
  ANALYTICS = 'analytics',
  STORAGE = 'storage',
  COMPUTE = 'compute',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  WEBHOOK = 'webhook',
  CUSTOM = 'custom'
}

export interface APIRegistryEntry {
  id: string;
  name: string;
  provider: string;
  category: APICategory;
  owner: string; // User/Department
  department?: string;
  purpose: string;
  description?: string;
  status: APIStatus;
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
  latency: number; // ms
  responseTime: number; // ms
  errorRate: number; // percentage
  uptime: number; // percentage
  lastHealthCheck: Date;
  healthScore: number; // 0-100
  
  // Dependencies
  connectedModules: string[];
  connectedProducts: string[];
  connectedAgents: string[];
  connectedCustomers?: string[];
  connectedWorkflows?: string[];
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  lastUsedAt?: Date;
  
  // Risk & Security
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  securityScore: number; // 0-100
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted';
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// AI PROVIDER REGISTRY
// ============================================================================

export enum AIProviderType {
  OPENAI = 'openai',
  CLAUDE = 'claude',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  GROK = 'grok',
  MISTRAL = 'mistral',
  LLAMA = 'llama',
  OPENROUTER = 'openrouter',
  PERPLEXITY = 'perplexity',
  CUSTOM = 'custom',
  LOCAL = 'local',
  ENTERPRISE = 'enterprise'
}

export interface AIModel {
  id: string;
  name: string;
  provider: AIProviderType;
  modelId: string;
  version: string;
  capabilityType: 'text' | 'vision' | 'embedding' | 'audio' | 'multimodal';
  costPer1kTokens: number;
  rateLimitPerMinute?: number;
  maxTokens?: number;
  contextWindow?: number;
  status: APIStatus;
  lastUpdated: Date;
}

export interface AIProviderRegistry {
  id: string;
  type: AIProviderType;
  name: string;
  displayName: string;
  apiKey?: string; // Encrypted
  apiSecret?: string; // Encrypted
  customHeaders?: Record<string, string>;
  
  // Models Available
  models: AIModel[];
  defaultModel?: string;
  
  // Usage & Cost
  monthlyUsage: number;
  monthlySpend: number;
  tokensUsed?: number;
  remainingQuota?: number;
  
  // Health
  status: APIStatus;
  healthScore: number;
  lastHealthCheck: Date;
  
  // Configuration
  requestTimeout?: number;
  retryAttempts?: number;
  rateLimitPerMinute?: number;
  
  // Team Access
  allowedDepartments?: string[];
  allowedRoles?: string[];
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  lastUsedAt?: Date;
}

// ============================================================================
// PROVIDER & INTEGRATION REGISTRY
// ============================================================================

export interface ProviderRegistry {
  id: string;
  name: string;
  category: string;
  apiEndpoint: string;
  status: APIStatus;
  connectedApis: string[];
  health: number;
  uptime: number;
  lastHealthCheck: Date;
  cost: number;
  usage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  owner: string;
  createdAt: Date;
}

export interface ServiceRegistry {
  id: string;
  name: string;
  description: string;
  type: string;
  status: APIStatus;
  connectedApis: string[];
  endpoints: string[];
  documentation?: string;
  owner: string;
  createdAt: Date;
}

export interface SDKRegistry {
  id: string;
  name: string;
  provider: string;
  language: string;
  version: string;
  status: APIStatus;
  documentation?: string;
  usedBy?: string[];
  createdAt: Date;
}

export interface WebhookRegistry {
  id: string;
  name: string;
  event: string;
  targetUrl: string;
  provider: string;
  status: APIStatus;
  lastDelivery?: Date;
  failureCount: number;
  successCount: number;
  owner: string;
  createdAt: Date;
}

export interface ConnectorRegistry {
  id: string;
  name: string;
  sourceApi: string;
  targetApi: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  status: APIStatus;
  lastSync?: Date;
  failureCount: number;
  owner: string;
  createdAt: Date;
}

export interface IntegrationRegistry {
  id: string;
  name: string;
  description: string;
  apis: string[];
  services: string[];
  status: APIStatus;
  integrationType: 'flow' | 'sync' | 'event' | 'webhook' | 'scheduled';
  owner: string;
  createdAt: Date;
  lastModified: Date;
}

// ============================================================================
// DISCOVERY RESULTS
// ============================================================================

export interface DiscoveryResult {
  id: string;
  timestamp: Date;
  scanType: 'full' | 'partial' | 'focused';
  
  foundApis: APIRegistryEntry[];
  foundProviders: ProviderRegistry[];
  foundServices: ServiceRegistry[];
  foundSdks: SDKRegistry[];
  foundWebhooks: WebhookRegistry[];
  foundConnectors: ConnectorRegistry[];
  foundEnvironmentVariables: Record<string, string>;
  
  registeredCount: number;
  pendingCount: number;
  duplicateCount: number;
  
  status: 'running' | 'completed' | 'failed';
  completedAt?: Date;
}

// ============================================================================
// MONITORING & HEALTH
// ============================================================================

export interface APIHealthMetrics {
  apiId: string;
  timestamp: Date;
  latency: number;
  responseTime: number;
  statusCode: number;
  errorMessage?: string;
  requestCount: number;
  errorCount: number;
  successRate: number;
}

export interface ProviderHealthStatus {
  providerId: string;
  status: APIStatus;
  healthScore: number; // 0-100
  uptime: number; // percentage
  lastDown?: Date;
  downtime: number; // minutes
  incidents: string[];
  alerts: AlertItem[];
}

// ============================================================================
// USAGE & BILLING
// ============================================================================

export interface UsageMetrics {
  apiId: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  timestamp: Date;
  requestCount: number;
  dataTransferred: number; // GB
  cost: number;
  unit: string; // requests, tokens, GB, etc.
}

export interface BillingEntry {
  id: string;
  apiId: string;
  period: Date;
  cost: number;
  currency: string;
  usageCount: number;
  unit: string;
  invoice?: string;
  status: 'pending' | 'paid' | 'failed';
}

export interface WalletEntry {
  id: string;
  balance: number;
  currency: string;
  lastRecharge: Date;
  autoRecharge: boolean;
  rechargeThreshold: number;
  transactionHistory: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  reason: string;
  timestamp: Date;
  relatedApiId?: string;
}

// ============================================================================
// SECURITY & ACCESS CONTROL
// ============================================================================

export enum APIPermissionLevel {
  EXECUTE = 'execute',
  ADMIN = 'admin',
  AUDIT = 'audit'
}

export interface APIPermission {
  roleId: string;
  apiId: string;
  permissionLevel: APIPermissionLevel;
  grantedAt: Date;
  grantedBy: string;
  expiresAt?: Date;
}

export interface APIKey {
  id: string;
  apiId: string;
  name: string;
  keyHash: string; // Hashed
  createdAt: Date;
  createdBy: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  status: 'active' | 'revoked' | 'expired';
  ipWhitelist?: string[];
  rateLimitPerMinute?: number;
}

export interface SecurityThreat {
  id: string;
  type: 'rate_limit_exceeded' | 'unauthorized_access' | 'suspicious_activity' | 'data_breach' | 'malicious_request';
  apiId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  details: string;
  status: 'detected' | 'investigating' | 'resolved' | 'false_alarm';
}

// ============================================================================
// ALERTS & NOTIFICATIONS
// ============================================================================

export enum AlertType {
  USAGE_ALERT = 'usage',
  COST_ALERT = 'cost',
  SECURITY_ALERT = 'security',
  PROVIDER_ALERT = 'provider',
  QUOTA_ALERT = 'quota',
  FRAUD_ALERT = 'fraud',
  ABUSE_ALERT = 'abuse',
  DOWNTIME_ALERT = 'downtime',
  BILLING_ALERT = 'billing'
}

export interface AlertItem {
  id: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  apiId?: string;
  providerId?: string;
  timestamp: Date;
  status: 'new' | 'acknowledged' | 'resolved';
  actionRequired?: boolean;
  suggestedAction?: string;
}

// ============================================================================
// AUDIT TRAIL
// ============================================================================

export enum AuditAction {
  API_CREATED = 'api_created',
  API_MODIFIED = 'api_modified',
  API_DELETED = 'api_deleted',
  API_USED = 'api_used',
  API_APPROVED = 'api_approved',
  API_DISABLED = 'api_disabled',
  API_ENABLED = 'api_enabled',
  BILLING_CHANGED = 'billing_changed',
  LIMITS_CHANGED = 'limits_changed',
  ACCESS_GRANTED = 'access_granted',
  ACCESS_REVOKED = 'access_revoked',
  CREDENTIALS_ROTATED = 'credentials_rotated'
}

export interface AuditEntry {
  id: string;
  action: AuditAction;
  actor: string; // User who performed action
  resourceType: string; // API, Provider, etc.
  resourceId: string;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface DashboardMetrics {
  totalApiCount: number;
  activeApiCount: number;
  inactiveApiCount: number;
  aiApiCount: number;
  nonAiApiCount: number;
  
  todayUsage: number;
  weeklyUsage: number;
  monthlyUsage: number;
  
  monthlySpend: number;
  walletBalance: number;
  
  totalHealthScore: number;
  totalCostScore: number;
  totalReliabilityScore: number;
  totalUsageScore: number;
  
  riskAlerts: number;
  securityAlerts: number;
  providerAlerts: number;
  
  onlineProviders: number;
  offlineProviders: number;
  degradedProviders: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
}

export interface ApiDistribution {
  name: string;
  value: number;
  percentage: number;
}
