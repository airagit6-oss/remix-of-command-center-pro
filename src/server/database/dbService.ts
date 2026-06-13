/**
 * Database Service Layer
 * Real database operations for AI API Manager with fallback mock data
 */

import mongoose from 'mongoose';
import {
  APIRegistry,
  AIProvider,
  Provider,
  Service,
  Webhook,
  Connector,
  Integration,
  UsageMetrics,
  Alert,
  AuditLog,
  APIKey,
  Billing,
  Wallet,
  IAPIRegistry,
  IAIProvider,
  IProvider,
  IService,
  IWebhook,
  IConnector,
  IIntegration,
  IUsageMetrics,
  IAlert,
  IAuditLog,
  IAPIKey,
  IBilling,
  IWallet,
} from '../models/apiManager';

// In-memory fallback storage for when MongoDB is unavailable
const mockStore = {
  apis: [] as any[],
  aiProviders: [] as any[],
  providers: [] as any[],
  services: [] as any[],
  webhooks: [] as any[],
  connectors: [] as any[],
  integrations: [] as any[],
  usageMetrics: [] as any[],
  alerts: [] as any[],
  auditLogs: [] as any[],
  apiKeys: [] as any[],
  billing: [] as any[],
  wallet: [] as any[],
};

// Initialize mock data
function initializeMockData() {
  if (mockStore.apis.length === 0) {
    mockStore.apis = [
      {
        _id: '1',
        name: 'OpenAI API',
        provider: 'OpenAI',
        category: 'LLM',
        baseUrl: 'https://api.openai.com',
        apiKey: '***',
        dailyUsage: 450,
        monthlyUsage: 12500,
        monthlyQuota: 50000,
        status: 'online',
        healthScore: 98,
        createdAt: new Date(),
      },
      {
        _id: '2',
        name: 'Google Cloud API',
        provider: 'Google',
        category: 'Cloud',
        baseUrl: 'https://www.googleapis.com',
        apiKey: '***',
        dailyUsage: 320,
        monthlyUsage: 9800,
        monthlyQuota: 40000,
        status: 'online',
        healthScore: 97,
        createdAt: new Date(),
      },
    ];
    
    mockStore.aiProviders = [
      {
        _id: 'gpt-4',
        name: 'GPT-4',
        type: 'LLM',
        models: [
          { name: 'gpt-4', version: '1.0', cost: 0.03 },
          { name: 'gpt-4-turbo', version: '1.1', cost: 0.01 },
        ],
        status: 'online',
        pricing: { perRequest: 0.03, perToken: 0.0001 },
        healthScore: 99,
        createdAt: new Date(),
      },
    ];
  }
}

function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export class DatabaseService {
  constructor() {
    initializeMockData();
  }

  // ========================================================================
  // API REGISTRY OPERATIONS
  // ========================================================================

  async createAPI(apiData: Partial<IAPIRegistry>): Promise<IAPIRegistry> {
    if (!isMongoConnected()) {
      const api = { _id: Date.now().toString(), ...apiData, createdAt: new Date() };
      mockStore.apis.push(api);
      return api as any;
    }
    const api = new APIRegistry(apiData);
    return await api.save();
  }

  async getAPI(id: string): Promise<IAPIRegistry | null> {
    if (!isMongoConnected()) {
      return mockStore.apis.find((a) => a._id === id) || null;
    }
    return await APIRegistry.findById(id);
  }

  async getAllAPIs(filters?: { status?: string; provider?: string; category?: string }): Promise<IAPIRegistry[]> {
    if (!isMongoConnected()) {
      let results = mockStore.apis;
      if (filters?.status) results = results.filter((a) => a.status === filters.status);
      if (filters?.provider) results = results.filter((a) => a.provider === filters.provider);
      if (filters?.category) results = results.filter((a) => a.category === filters.category);
      return results;
    }

    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.provider) query.provider = filters.provider;
    if (filters?.category) query.category = filters.category;

    return await APIRegistry.find(query).sort({ createdAt: -1 });
  }

  async updateAPI(id: string, updates: Partial<IAPIRegistry>): Promise<IAPIRegistry | null> {
    if (!isMongoConnected()) {
      const index = mockStore.apis.findIndex((a) => a._id === id);
      if (index === -1) return null;
      mockStore.apis[index] = { ...mockStore.apis[index], ...updates };
      return mockStore.apis[index];
    }
    return await APIRegistry.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteAPI(id: string): Promise<boolean> {
    if (!isMongoConnected()) {
      const index = mockStore.apis.findIndex((a) => a._id === id);
      if (index === -1) return false;
      mockStore.apis.splice(index, 1);
      return true;
    }
    const result = await APIRegistry.findByIdAndDelete(id);
    return !!result;
  }

  async searchAPIs(query: string): Promise<IAPIRegistry[]> {
    if (!isMongoConnected()) {
      const regex = new RegExp(query, 'i');
      return mockStore.apis.filter(
        (a) => regex.test(a.name) || regex.test(a.provider) || regex.test(a.description)
      );
    }
    return await APIRegistry.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { provider: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
  }

  // ========================================================================
  // AI PROVIDER OPERATIONS
  // ========================================================================

  async createAIProvider(providerData: Partial<IAIProvider>): Promise<IAIProvider> {
    if (!isMongoConnected()) {
      const provider = { _id: Date.now().toString(), ...providerData, createdAt: new Date() };
      mockStore.aiProviders.push(provider);
      return provider as any;
    }
    const provider = new AIProvider(providerData);
    return await provider.save();
  }

  async getAIProvider(id: string): Promise<IAIProvider | null> {
    if (!isMongoConnected()) {
      return mockStore.aiProviders.find((p) => p._id === id) || null;
    }
    return await AIProvider.findById(id);
  }

  async getAllAIProviders(): Promise<IAIProvider[]> {
    if (!isMongoConnected()) {
      return mockStore.aiProviders;
    }
    return await AIProvider.find().sort({ createdAt: -1 });
  }

  async updateAIProvider(id: string, updates: Partial<IAIProvider>): Promise<IAIProvider | null> {
    if (!isMongoConnected()) {
      const index = mockStore.aiProviders.findIndex((p) => p._id === id);
      if (index === -1) return null;
      mockStore.aiProviders[index] = { ...mockStore.aiProviders[index], ...updates };
      return mockStore.aiProviders[index];
    }
    return await AIProvider.findByIdAndUpdate(id, updates, { new: true });
  }

  async getAIProviderByType(type: string): Promise<IAIProvider | null> {
    if (!isMongoConnected()) {
      return mockStore.aiProviders.find((p) => p.type === type) || null;
    }
    return await AIProvider.findOne({ type });
  }

  // ========================================================================
  // PROVIDER OPERATIONS
  // ========================================================================

  async createProvider(providerData: Partial<IProvider>): Promise<IProvider> {
    const provider = new Provider(providerData);
    return await provider.save();
  }

  async getProvider(id: string): Promise<IProvider | null> {
    return await Provider.findById(id);
  }

  async getAllProviders(): Promise<IProvider[]> {
    return await Provider.find().sort({ createdAt: -1 });
  }

  async updateProvider(id: string, updates: Partial<IProvider>): Promise<IProvider | null> {
    return await Provider.findByIdAndUpdate(id, updates, { new: true });
  }

  // ========================================================================
  // SERVICE OPERATIONS
  // ========================================================================

  async createService(serviceData: Partial<IService>): Promise<IService> {
    const service = new Service(serviceData);
    return await service.save();
  }

  async getService(id: string): Promise<IService | null> {
    return await Service.findById(id);
  }

  async getAllServices(): Promise<IService[]> {
    return await Service.find().sort({ createdAt: -1 });
  }

  async updateService(id: string, updates: Partial<IService>): Promise<IService | null> {
    return await Service.findByIdAndUpdate(id, updates, { new: true });
  }

  // ========================================================================
  // WEBHOOK OPERATIONS
  // ========================================================================

  async createWebhook(webhookData: Partial<IWebhook>): Promise<IWebhook> {
    const webhook = new Webhook(webhookData);
    return await webhook.save();
  }

  async getWebhook(id: string): Promise<IWebhook | null> {
    return await Webhook.findById(id);
  }

  async getAllWebhooks(): Promise<IWebhook[]> {
    return await Webhook.find().sort({ createdAt: -1 });
  }

  async getWebhooksByEvent(event: string): Promise<IWebhook[]> {
    return await Webhook.find({ event });
  }

  async updateWebhook(id: string, updates: Partial<IWebhook>): Promise<IWebhook | null> {
    return await Webhook.findByIdAndUpdate(id, updates, { new: true });
  }

  // ========================================================================
  // CONNECTOR OPERATIONS
  // ========================================================================

  async createConnector(connectorData: Partial<IConnector>): Promise<IConnector> {
    const connector = new Connector(connectorData);
    return await connector.save();
  }

  async getConnector(id: string): Promise<IConnector | null> {
    return await Connector.findById(id);
  }

  async getAllConnectors(): Promise<IConnector[]> {
    return await Connector.find().sort({ createdAt: -1 });
  }

  async updateConnector(id: string, updates: Partial<IConnector>): Promise<IConnector | null> {
    return await Connector.findByIdAndUpdate(id, updates, { new: true });
  }

  // ========================================================================
  // INTEGRATION OPERATIONS
  // ========================================================================

  async createIntegration(integrationData: Partial<IIntegration>): Promise<IIntegration> {
    const integration = new Integration(integrationData);
    return await integration.save();
  }

  async getIntegration(id: string): Promise<IIntegration | null> {
    return await Integration.findById(id);
  }

  async getAllIntegrations(): Promise<IIntegration[]> {
    return await Integration.find().sort({ createdAt: -1 });
  }

  async updateIntegration(id: string, updates: Partial<IIntegration>): Promise<IIntegration | null> {
    return await Integration.findByIdAndUpdate(id, updates, { new: true });
  }

  // ========================================================================
  // USAGE METRICS OPERATIONS
  // ========================================================================

  async recordUsage(apiId: string, requestCount: number, cost: number, unit: string = 'request'): Promise<IUsageMetrics> {
    const metrics = new UsageMetrics({
      apiId,
      period: 'hourly',
      requestCount,
      cost,
      unit,
    });
    return await metrics.save();
  }

  async getUsageMetrics(apiId: string, period: string): Promise<IUsageMetrics[]> {
    return await UsageMetrics.find({ apiId, period: period as any }).sort({ createdAt: -1 });
  }

  async getTotalUsage(apiId: string): Promise<{ total: number; cost: number }> {
    const metrics = await UsageMetrics.aggregate([
      { $match: { apiId } },
      { $group: { _id: null, total: { $sum: '$requestCount' }, cost: { $sum: '$cost' } } },
    ]);

    return metrics[0] || { total: 0, cost: 0 };
  }

  // ========================================================================
  // ALERT OPERATIONS
  // ========================================================================

  async createAlert(alertData: Partial<IAlert>): Promise<IAlert> {
    const alert = new Alert(alertData);
    return await alert.save();
  }

  async getAlert(id: string): Promise<IAlert | null> {
    return await Alert.findById(id);
  }

  async getAllAlerts(filters?: { type?: string; severity?: string; status?: string }): Promise<IAlert[]> {
    const query: any = {};
    if (filters?.type) query.type = filters.type;
    if (filters?.severity) query.severity = filters.severity;
    if (filters?.status) query.status = filters.status;

    return await Alert.find(query).sort({ createdAt: -1 });
  }

  async updateAlert(id: string, updates: Partial<IAlert>): Promise<IAlert | null> {
    return await Alert.findByIdAndUpdate(id, updates, { new: true });
  }

  async getUnresolvedAlerts(): Promise<IAlert[]> {
    return await Alert.find({ status: { $ne: 'resolved' } }).sort({ createdAt: -1 });
  }

  // ========================================================================
  // AUDIT LOG OPERATIONS
  // ========================================================================

  async logAudit(auditData: Partial<IAuditLog>): Promise<IAuditLog> {
    const log = new AuditLog(auditData);
    return await log.save();
  }

  async getAuditLog(filters?: { action?: string; actor?: string; resourceType?: string }): Promise<IAuditLog[]> {
    const query: any = {};
    if (filters?.action) query.action = filters.action;
    if (filters?.actor) query.actor = filters.actor;
    if (filters?.resourceType) query.resourceType = filters.resourceType;

    return await AuditLog.find(query).sort({ createdAt: -1 });
  }

  // ========================================================================
  // API KEY OPERATIONS
  // ========================================================================

  async createAPIKey(keyData: Partial<IAPIKey>): Promise<IAPIKey> {
    const key = new APIKey(keyData);
    return await key.save();
  }

  async getAPIKeys(apiId: string): Promise<IAPIKey[]> {
    return await APIKey.find({ apiId });
  }

  async revokeAPIKey(id: string): Promise<IAPIKey | null> {
    return await APIKey.findByIdAndUpdate(id, { status: 'revoked' }, { new: true });
  }

  // ========================================================================
  // BILLING OPERATIONS
  // ========================================================================

  async createBillingEntry(billingData: Partial<IBilling>): Promise<IBilling> {
    const billing = new Billing(billingData);
    return await billing.save();
  }

  async getBillingByAPI(apiId: string, limit: number = 12): Promise<IBilling[]> {
    return await Billing.find({ apiId }).sort({ period: -1 }).limit(limit);
  }

  async getTotalBilling(apiId: string): Promise<number> {
    const result = await Billing.aggregate([
      { $match: { apiId } },
      { $group: { _id: null, total: { $sum: '$cost' } } },
    ]);

    return result[0]?.total || 0;
  }

  // ========================================================================
  // WALLET OPERATIONS
  // ========================================================================

  async getOrCreateWallet(userId: string): Promise<IWallet> {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
      await wallet.save();
    }
    return wallet;
  }

  async updateWalletBalance(userId: string, amount: number, reason: string, relatedApiId?: string): Promise<IWallet | null> {
    return await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: { balance: amount },
        $push: {
          transactionHistory: {
            type: amount > 0 ? 'credit' : 'debit',
            amount: Math.abs(amount),
            reason,
            relatedApiId,
            timestamp: new Date(),
          },
        },
        $set: { lastRecharge: new Date() },
      },
      { new: true }
    );
  }

  async getWalletBalance(userId: string): Promise<number> {
    const wallet = await Wallet.findOne({ userId });
    return wallet?.balance || 0;
  }

  // ========================================================================
  // DASHBOARD METRICS
  // ========================================================================

  async getDashboardMetrics() {
    const [
      totalApis,
      activeApis,
      inactiveApis,
      aiProviders,
      totalUsage,
      totalBilling,
      alerts,
      providers,
    ] = await Promise.all([
      APIRegistry.countDocuments(),
      APIRegistry.countDocuments({ status: 'online' }),
      APIRegistry.countDocuments({ status: 'offline' }),
      AIProvider.countDocuments(),
      UsageMetrics.aggregate([{ $group: { _id: null, total: { $sum: '$requestCount' } } }]),
      Billing.aggregate([{ $group: { _id: null, total: { $sum: '$cost' } } }]),
      Alert.countDocuments({ status: 'new' }),
      Provider.find({ status: 'online' }),
    ]);

    return {
      totalApiCount: totalApis,
      activeApiCount: activeApis,
      inactiveApiCount: inactiveApis,
      aiApiCount: aiProviders,
      monthlyUsage: totalUsage[0]?.total || 0,
      monthlySpend: totalBilling[0]?.total || 0,
      newAlerts: alerts,
      onlineProviders: providers.length,
    };
  }

  // ========================================================================
  // HEALTH CHECK
  // ========================================================================

  async recordHealthCheck(apiId: string, healthData: any): Promise<IAPIRegistry | null> {
    return await APIRegistry.findByIdAndUpdate(
      apiId,
      {
        lastHealthCheck: new Date(),
        latency: healthData.latency,
        responseTime: healthData.responseTime,
        errorRate: healthData.errorRate,
        uptime: healthData.uptime,
        healthScore: Math.max(0, 100 - healthData.errorRate),
      },
      { new: true }
    );
  }
}

export const dbService = new DatabaseService();
export default DatabaseService;
