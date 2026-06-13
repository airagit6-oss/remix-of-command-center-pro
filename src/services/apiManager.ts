/**
 * AI API Manager Service
 * Handles all API, provider, and integration management operations
 */

import {
  APIRegistryEntry,
  AIProviderRegistry,
  ProviderRegistry,
  ServiceRegistry,
  SDKRegistry,
  WebhookRegistry,
  ConnectorRegistry,
  IntegrationRegistry,
  APIStatus,
  APICategory,
  APIPermission,
  APIKey,
  UsageMetrics,
  BillingEntry,
  WalletEntry,
  AuditEntry,
  AuditAction,
  DashboardMetrics,
  AlertItem,
  AlertType,
  DiscoveryResult,
  APIHealthMetrics,
  ProviderHealthStatus,
  SecurityThreat
} from '../types/apiManager';

class APIManagerService {
  private apiRegistry = new Map<string, APIRegistryEntry>();
  private aiRegistry = new Map<string, AIProviderRegistry>();
  private providerRegistry = new Map<string, ProviderRegistry>();
  private serviceRegistry = new Map<string, ServiceRegistry>();
  private sdkRegistry = new Map<string, SDKRegistry>();
  private webhookRegistry = new Map<string, WebhookRegistry>();
  private connectorRegistry = new Map<string, ConnectorRegistry>();
  private integrationRegistry = new Map<string, IntegrationRegistry>();
  private auditLog: AuditEntry[] = [];
  private alerts: AlertItem[] = [];
  private usageMetrics: Map<string, UsageMetrics[]> = new Map();
  private apiKeys: Map<string, APIKey[]> = new Map();
  private permissions: APIPermission[] = [];
  private wallet: WalletEntry | null = null;
  private healthMetrics: Map<string, APIHealthMetrics[]> = new Map();

  // ========================================================================
  // API REGISTRY OPERATIONS
  // ========================================================================

  /**
   * Register a new API
   */
  registerAPI(apiData: Partial<APIRegistryEntry>): APIRegistryEntry {
    const id = this.generateId('api');
    const entry: APIRegistryEntry = {
      id,
      name: apiData.name || 'Unnamed API',
      provider: apiData.provider || 'Unknown',
      category: apiData.category || APICategory.CUSTOM,
      owner: apiData.owner || 'Unknown',
      purpose: apiData.purpose || 'Pending Discovery',
      status: apiData.status || APIStatus.PENDING_DISCOVERY,
      version: apiData.version || '1.0.0',
      environment: apiData.environment || 'production',
      dailyUsage: 0,
      monthlyUsage: 0,
      cost: 0,
      costCurrency: 'USD',
      latency: 0,
      responseTime: 0,
      errorRate: 0,
      uptime: 100,
      lastHealthCheck: new Date(),
      healthScore: 0,
      connectedModules: apiData.connectedModules || [],
      connectedProducts: apiData.connectedProducts || [],
      connectedAgents: apiData.connectedAgents || [],
      createdAt: new Date(),
      createdBy: apiData.createdBy || 'system',
      updatedAt: new Date(),
      updatedBy: apiData.updatedBy || 'system',
      riskLevel: 'low',
      securityScore: 0,
      ...apiData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.apiRegistry.set(id, entry);
    this.logAudit(AuditAction.API_CREATED, 'API', id, apiData.createdBy || 'system', {
      name: entry.name,
      provider: entry.provider
    });

    return entry;
  }

  /**
   * Get API by ID
   */
  getAPI(apiId: string): APIRegistryEntry | undefined {
    return this.apiRegistry.get(apiId);
  }

  /**
   * Get all APIs
   */
  getAllAPIs(filters?: {
    status?: APIStatus;
    provider?: string;
    category?: APICategory;
  }): APIRegistryEntry[] {
    let apis = Array.from(this.apiRegistry.values());

    if (filters?.status) {
      apis = apis.filter(api => api.status === filters.status);
    }
    if (filters?.provider) {
      apis = apis.filter(api => api.provider === filters.provider);
    }
    if (filters?.category) {
      apis = apis.filter(api => api.category === filters.category);
    }

    return apis;
  }

  /**
   * Update API
   */
  updateAPI(apiId: string, updates: Partial<APIRegistryEntry>, updatedBy: string): APIRegistryEntry | undefined {
    const api = this.apiRegistry.get(apiId);
    if (!api) return undefined;

    const updated = { ...api, ...updates, updatedAt: new Date(), updatedBy };
    this.apiRegistry.set(apiId, updated);

    this.logAudit(AuditAction.API_MODIFIED, 'API', apiId, updatedBy, updates);
    return updated;
  }

  /**
   * Delete API
   */
  deleteAPI(apiId: string, deletedBy: string): boolean {
    const api = this.apiRegistry.get(apiId);
    if (!api) return false;

    this.logAudit(AuditAction.API_DELETED, 'API', apiId, deletedBy, { name: api.name });
    this.apiRegistry.delete(apiId);
    return true;
  }

  // ========================================================================
  // AI PROVIDER REGISTRY
  // ========================================================================

  /**
   * Register AI provider
   */
  registerAIProvider(providerData: Partial<AIProviderRegistry>): AIProviderRegistry {
    const id = this.generateId('ai-provider');
    const provider: AIProviderRegistry = {
      id,
      type: providerData.type || 'custom',
      name: providerData.name || 'Unnamed AI Provider',
      displayName: providerData.displayName || providerData.name || 'Unnamed',
      models: providerData.models || [],
      monthlyUsage: 0,
      monthlySpend: 0,
      status: APIStatus.PENDING_DISCOVERY,
      healthScore: 0,
      lastHealthCheck: new Date(),
      createdAt: new Date(),
      createdBy: 'system',
      updatedAt: new Date(),
      updatedBy: 'system',
      ...providerData,
      id,
    };

    this.aiRegistry.set(id, provider);
    return provider;
  }

  /**
   * Get all AI providers
   */
  getAIProviders(): AIProviderRegistry[] {
    return Array.from(this.aiRegistry.values());
  }

  /**
   * Update AI provider
   */
  updateAIProvider(providerId: string, updates: Partial<AIProviderRegistry>): AIProviderRegistry | undefined {
    const provider = this.aiRegistry.get(providerId);
    if (!provider) return undefined;

    const updated = { ...provider, ...updates, updatedAt: new Date() };
    this.aiRegistry.set(providerId, updated);
    return updated;
  }

  // ========================================================================
  // PROVIDER REGISTRY
  // ========================================================================

  registerProvider(providerData: Partial<ProviderRegistry>): ProviderRegistry {
    const id = this.generateId('provider');
    const provider: ProviderRegistry = {
      id,
      name: providerData.name || 'Unnamed Provider',
      category: providerData.category || 'Custom',
      apiEndpoint: providerData.apiEndpoint || '',
      status: APIStatus.PENDING_DISCOVERY,
      connectedApis: providerData.connectedApis || [],
      health: 0,
      uptime: 100,
      lastHealthCheck: new Date(),
      cost: 0,
      usage: 0,
      riskLevel: 'low',
      dependencies: [],
      owner: 'system',
      createdAt: new Date(),
      ...providerData,
      id,
    };

    this.providerRegistry.set(id, provider);
    return provider;
  }

  getProviders(): ProviderRegistry[] {
    return Array.from(this.providerRegistry.values());
  }

  // ========================================================================
  // SERVICE REGISTRY
  // ========================================================================

  registerService(serviceData: Partial<ServiceRegistry>): ServiceRegistry {
    const id = this.generateId('service');
    const service: ServiceRegistry = {
      id,
      name: serviceData.name || 'Unnamed Service',
      description: serviceData.description || 'Pending Discovery',
      type: serviceData.type || 'Custom',
      status: APIStatus.PENDING_DISCOVERY,
      connectedApis: serviceData.connectedApis || [],
      endpoints: serviceData.endpoints || [],
      owner: 'system',
      createdAt: new Date(),
      ...serviceData,
      id,
    };

    this.serviceRegistry.set(id, service);
    return service;
  }

  getServices(): ServiceRegistry[] {
    return Array.from(this.serviceRegistry.values());
  }

  // ========================================================================
  // WEBHOOK REGISTRY
  // ========================================================================

  registerWebhook(webhookData: Partial<WebhookRegistry>): WebhookRegistry {
    const id = this.generateId('webhook');
    const webhook: WebhookRegistry = {
      id,
      name: webhookData.name || 'Unnamed Webhook',
      event: webhookData.event || 'Unknown',
      targetUrl: webhookData.targetUrl || '',
      provider: webhookData.provider || 'Unknown',
      status: APIStatus.PENDING_DISCOVERY,
      failureCount: 0,
      successCount: 0,
      owner: 'system',
      createdAt: new Date(),
      ...webhookData,
      id,
    };

    this.webhookRegistry.set(id, webhook);
    return webhook;
  }

  getWebhooks(): WebhookRegistry[] {
    return Array.from(this.webhookRegistry.values());
  }

  // ========================================================================
  // CONNECTOR REGISTRY
  // ========================================================================

  registerConnector(connectorData: Partial<ConnectorRegistry>): ConnectorRegistry {
    const id = this.generateId('connector');
    const connector: ConnectorRegistry = {
      id,
      name: connectorData.name || 'Unnamed Connector',
      sourceApi: connectorData.sourceApi || '',
      targetApi: connectorData.targetApi || '',
      syncFrequency: connectorData.syncFrequency || 'daily',
      status: APIStatus.PENDING_DISCOVERY,
      failureCount: 0,
      owner: 'system',
      createdAt: new Date(),
      ...connectorData,
      id,
    };

    this.connectorRegistry.set(id, connector);
    return connector;
  }

  getConnectors(): ConnectorRegistry[] {
    return Array.from(this.connectorRegistry.values());
  }

  // ========================================================================
  // INTEGRATION REGISTRY
  // ========================================================================

  registerIntegration(integrationData: Partial<IntegrationRegistry>): IntegrationRegistry {
    const id = this.generateId('integration');
    const integration: IntegrationRegistry = {
      id,
      name: integrationData.name || 'Unnamed Integration',
      description: integrationData.description || 'Pending Discovery',
      apis: integrationData.apis || [],
      services: integrationData.services || [],
      status: APIStatus.PENDING_DISCOVERY,
      integrationType: integrationData.integrationType || 'flow',
      owner: 'system',
      createdAt: new Date(),
      lastModified: new Date(),
      ...integrationData,
      id,
    };

    this.integrationRegistry.set(id, integration);
    return integration;
  }

  getIntegrations(): IntegrationRegistry[] {
    return Array.from(this.integrationRegistry.values());
  }

  // ========================================================================
  // DISCOVERY ENGINE
  // ========================================================================

  /**
   * Scan for existing APIs, providers, and services
   */
  async discoverAPIs(): Promise<DiscoveryResult> {
    const result: DiscoveryResult = {
      id: this.generateId('discovery'),
      timestamp: new Date(),
      scanType: 'full',
      foundApis: [],
      foundProviders: [],
      foundServices: [],
      foundSdks: [],
      foundWebhooks: [],
      foundConnectors: [],
      foundEnvironmentVariables: this.scanEnvironmentVariables(),
      registeredCount: 0,
      pendingCount: 0,
      duplicateCount: 0,
      status: 'running'
    };

    // Scan environment variables for API keys
    const envVars = result.foundEnvironmentVariables;
    for (const [key, value] of Object.entries(envVars)) {
      if (this.isAPIKeyPattern(key)) {
        const apiData = this.parseEnvironmentVariable(key, value);
        if (apiData) {
          result.foundApis.push(apiData);
        }
      }
    }

    result.registeredCount = result.foundApis.length;
    result.status = 'completed';
    result.completedAt = new Date();

    this.logAudit(AuditAction.API_CREATED, 'Discovery', result.id, 'system', {
      foundCount: result.foundApis.length,
      registeredCount: result.registeredCount
    });

    return result;
  }

  /**
   * Scan environment variables
   */
  private scanEnvironmentVariables(): Record<string, string> {
    const envVars: Record<string, string> = {};
    const apiKeyPatterns = [
      'OPENAI_API_KEY',
      'CLAUDE_API_KEY',
      'GEMINI_API_KEY',
      'STRIPE_KEY',
      'PAYPAL_',
      'TWILIO_',
      'SENDGRID_',
      'WHATSAPP_',
      'DATABASE_',
      'REDIS_',
      'AWS_',
      'AZURE_',
      'GCP_'
    ];

    for (const [key, value] of Object.entries(process.env)) {
      if (apiKeyPatterns.some(pattern => key.includes(pattern)) && value) {
        envVars[key] = '[REDACTED]';
      }
    }

    return envVars;
  }

  /**
   * Check if key follows API key pattern
   */
  private isAPIKeyPattern(key: string): boolean {
    return key.includes('API_KEY') || key.includes('_KEY') || key.includes('_TOKEN') || key.includes('_SECRET');
  }

  /**
   * Parse environment variable into API data
   */
  private parseEnvironmentVariable(key: string, value: string): APIRegistryEntry | null {
    const apiData = this.getAPIDataFromKey(key);
    if (apiData) {
      return this.registerAPI({
        name: apiData.name,
        provider: apiData.provider,
        category: apiData.category,
        owner: 'system',
        purpose: `Auto-discovered from ${key}`,
        status: APIStatus.PENDING_DISCOVERY,
        createdBy: 'discovery-engine'
      });
    }
    return null;
  }

  /**
   * Map environment variable to API data
   */
  private getAPIDataFromKey(key: string): { name: string; provider: string; category: APICategory } | null {
    const mappings: Record<string, any> = {
      'OPENAI_API_KEY': { name: 'OpenAI', provider: 'OpenAI', category: APICategory.AI_MODEL },
      'CLAUDE_API_KEY': { name: 'Claude', provider: 'Anthropic', category: APICategory.AI_MODEL },
      'GEMINI_API_KEY': { name: 'Gemini', provider: 'Google', category: APICategory.AI_MODEL },
      'STRIPE_': { name: 'Stripe', provider: 'Stripe', category: APICategory.PAYMENT },
      'PAYPAL_': { name: 'PayPal', provider: 'PayPal', category: APICategory.PAYMENT },
      'TWILIO_': { name: 'Twilio', provider: 'Twilio', category: APICategory.MESSAGING },
      'SENDGRID_': { name: 'SendGrid', provider: 'SendGrid', category: APICategory.EMAIL },
      'WHATSAPP_': { name: 'WhatsApp', provider: 'Meta', category: APICategory.MESSAGING },
    };

    for (const [pattern, data] of Object.entries(mappings)) {
      if (key.includes(pattern)) {
        return data;
      }
    }
    return null;
  }

  // ========================================================================
  // USAGE TRACKING
  // ========================================================================

  recordUsage(apiId: string, count: number, cost: number, unit: string = 'request'): void {
    const api = this.getAPI(apiId);
    if (!api) return;

    const metrics: UsageMetrics = {
      apiId,
      period: 'hourly',
      timestamp: new Date(),
      requestCount: count,
      dataTransferred: 0,
      cost,
      unit
    };

    if (!this.usageMetrics.has(apiId)) {
      this.usageMetrics.set(apiId, []);
    }
    this.usageMetrics.get(apiId)!.push(metrics);

    // Update API metrics
    api.dailyUsage += count;
    api.monthlyUsage += count;
    api.cost += cost;
    this.updateAPI(apiId, api, 'system');
  }

  getUsageMetrics(apiId: string, period: 'hourly' | 'daily' | 'monthly'): UsageMetrics[] {
    const metrics = this.usageMetrics.get(apiId) || [];
    const now = new Date();
    const periodMs = period === 'hourly' ? 3600000 : period === 'daily' ? 86400000 : 2592000000;

    return metrics.filter(m => now.getTime() - m.timestamp.getTime() < periodMs);
  }

  // ========================================================================
  // HEALTH MONITORING
  // ========================================================================

  recordHealthMetrics(apiId: string, metrics: Partial<APIHealthMetrics>): void {
    const healthMetrics: APIHealthMetrics = {
      apiId,
      timestamp: new Date(),
      latency: metrics.latency || 0,
      responseTime: metrics.responseTime || 0,
      statusCode: metrics.statusCode || 200,
      requestCount: metrics.requestCount || 0,
      errorCount: metrics.errorCount || 0,
      successRate: metrics.successRate || 100,
    };

    if (!this.healthMetrics.has(apiId)) {
      this.healthMetrics.set(apiId, []);
    }
    this.healthMetrics.get(apiId)!.push(healthMetrics);

    // Update API health
    const api = this.getAPI(apiId);
    if (api) {
      api.latency = healthMetrics.latency;
      api.responseTime = healthMetrics.responseTime;
      api.lastHealthCheck = healthMetrics.timestamp;
      api.healthScore = Math.max(0, 100 - healthMetrics.errorCount);
      this.updateAPI(apiId, api, 'system');
    }
  }

  getProviderHealth(providerId: string): ProviderHealthStatus {
    const provider = this.providerRegistry.get(providerId);
    if (!provider) {
      return {
        providerId,
        status: APIStatus.OFFLINE,
        healthScore: 0,
        uptime: 0,
        incidents: [],
        alerts: this.getAlertsByProvider(providerId)
      };
    }

    return {
      providerId,
      status: provider.status,
      healthScore: provider.health,
      uptime: provider.uptime,
      incidents: [],
      alerts: this.getAlertsByProvider(providerId)
    };
  }

  // ========================================================================
  // ALERT MANAGEMENT
  // ========================================================================

  createAlert(alert: Omit<AlertItem, 'id' | 'timestamp'>): AlertItem {
    const item: AlertItem = {
      ...alert,
      id: this.generateId('alert'),
      timestamp: new Date()
    };

    this.alerts.push(item);

    if (item.severity === 'critical' || item.severity === 'high') {
      this.logAudit(AuditAction.API_MODIFIED, 'Alert', item.id, 'system', { alert: item.message });
    }

    return item;
  }

  getAlerts(filters?: { type?: AlertType; severity?: string; apiId?: string }): AlertItem[] {
    let alerts = [...this.alerts];

    if (filters?.type) {
      alerts = alerts.filter(a => a.type === filters.type);
    }
    if (filters?.severity) {
      alerts = alerts.filter(a => a.severity === filters.severity);
    }
    if (filters?.apiId) {
      alerts = alerts.filter(a => a.apiId === filters.apiId);
    }

    return alerts;
  }

  private getAlertsByProvider(providerId: string): AlertItem[] {
    return this.alerts.filter(a => a.providerId === providerId);
  }

  // ========================================================================
  // AUDIT LOGGING
  // ========================================================================

  private logAudit(action: AuditAction, resourceType: string, resourceId: string, actor: string, details: Record<string, any>): void {
    const entry: AuditEntry = {
      id: this.generateId('audit'),
      action,
      actor,
      resourceType,
      resourceId,
      timestamp: new Date(),
      details,
      ipAddress: '0.0.0.0',
      userAgent: 'api-manager'
    };

    this.auditLog.push(entry);
  }

  getAuditLog(filters?: { action?: AuditAction; resourceId?: string; actor?: string }): AuditEntry[] {
    let log = [...this.auditLog];

    if (filters?.action) {
      log = log.filter(e => e.action === filters.action);
    }
    if (filters?.resourceId) {
      log = log.filter(e => e.resourceId === filters.resourceId);
    }
    if (filters?.actor) {
      log = log.filter(e => e.actor === filters.actor);
    }

    return log;
  }

  // ========================================================================
  // DASHBOARD METRICS
  // ========================================================================

  getDashboardMetrics(): DashboardMetrics {
    const apis = this.getAllAPIs();
    const aiApis = apis.filter(a => a.category === APICategory.AI_MODEL);
    const activeApis = apis.filter(a => a.status === APIStatus.ONLINE);
    const inactiveApis = apis.filter(a => a.status === APIStatus.OFFLINE);

    return {
      totalApiCount: apis.length,
      activeApiCount: activeApis.length,
      inactiveApiCount: inactiveApis.length,
      aiApiCount: aiApis.length,
      nonAiApiCount: apis.length - aiApis.length,
      
      todayUsage: apis.reduce((sum, api) => sum + api.dailyUsage, 0),
      weeklyUsage: apis.reduce((sum, api) => sum + (api.monthlyUsage / 4), 0),
      monthlyUsage: apis.reduce((sum, api) => sum + api.monthlyUsage, 0),
      
      monthlySpend: apis.reduce((sum, api) => sum + api.cost, 0),
      walletBalance: this.wallet?.balance || 0,
      
      totalHealthScore: apis.length > 0 ? apis.reduce((sum, api) => sum + api.healthScore, 0) / apis.length : 0,
      totalCostScore: this.calculateCostScore(),
      totalReliabilityScore: this.calculateReliabilityScore(),
      totalUsageScore: this.calculateUsageScore(),
      
      riskAlerts: this.alerts.filter(a => a.type === AlertType.FRAUD_ALERT).length,
      securityAlerts: this.alerts.filter(a => a.type === AlertType.SECURITY_ALERT).length,
      providerAlerts: this.alerts.filter(a => a.type === AlertType.PROVIDER_ALERT).length,
      
      onlineProviders: Array.from(this.providerRegistry.values()).filter(p => p.status === APIStatus.ONLINE).length,
      offlineProviders: Array.from(this.providerRegistry.values()).filter(p => p.status === APIStatus.OFFLINE).length,
      degradedProviders: Array.from(this.providerRegistry.values()).filter(p => p.status === APIStatus.DEGRADED).length,
    };
  }

  private calculateCostScore(): number {
    const budget = 10000; // Default monthly budget
    const spend = this.getDashboardMetrics().monthlySpend;
    return Math.max(0, 100 - (spend / budget) * 100);
  }

  private calculateReliabilityScore(): number {
    const apis = this.getAllAPIs();
    if (apis.length === 0) return 100;
    return apis.reduce((sum, api) => sum + (100 - api.errorRate), 0) / apis.length;
  }

  private calculateUsageScore(): number {
    const metrics = this.getDashboardMetrics();
    const activeRate = (metrics.activeApiCount / metrics.totalApiCount) * 100;
    return activeRate;
  }

  // ========================================================================
  // UTILITY
  // ========================================================================

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const apiManagerService = new APIManagerService();
export default APIManagerService;
