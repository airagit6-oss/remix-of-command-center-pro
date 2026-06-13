/**
 * API Routes for AI API Manager
 * RESTful endpoints for all registry operations
 */

import { Router, Request, Response, NextFunction } from 'express';
import { dbService } from '../database/dbService';
import { AuditLog } from '../models/apiManager';

const router = Router();

// ============================================================================
// MOCK DATA FOR FALLBACK
// ============================================================================

const mockAPIs = [
  {
    _id: '1',
    name: 'OpenAI GPT-4',
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

const mockAIProviders = [
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

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Simple auth middleware (replace with real auth)
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  (req as any).userId = userId;
  next();
};

// Error handler wrapper with timeout and fallback
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.race([
    Promise.resolve(fn(req, res, next)),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 5000))
  ]).catch(next);
};

// Log audit trail
const logAction = async (action: string, resourceType: string, resourceId: string, userId: string, details: any) => {
  try {
    await dbService.logAudit({
      action,
      actor: userId,
      resourceType,
      resourceId,
      details,
      ipAddress: '0.0.0.0',
      userAgent: 'API',
    });
  } catch (err) {
    console.warn('Audit logging failed (non-critical):', err);
  }
};

// ============================================================================
// API REGISTRY ROUTES
// ============================================================================

// Get all APIs
router.get('/apis', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      provider: req.query.provider as string,
      category: req.query.category as string,
    };

    const apis = await dbService.getAllAPIs(filters);
    res.json(apis);
  } catch (err) {
    console.warn('Error getting APIs, returning mock data:', err);
    res.json(mockAPIs);
  }
}));

// Get single API
router.get('/apis/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const api = await dbService.getAPI(req.params.id);
    if (!api) {
      const mockAPI = mockAPIs.find((a) => a._id === req.params.id);
      return res.json(mockAPI || { error: 'API not found' });
    }
    res.json(api);
  } catch (err) {
    console.warn('Error getting API, returning mock data:', err);
    const mockAPI = mockAPIs.find((a) => a._id === req.params.id);
    res.json(mockAPI || { error: 'API not found' });
  }
}));

// Create API
router.post('/apis', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const api = await dbService.createAPI({
      ...req.body,
      createdBy: (req as any).userId,
      updatedBy: (req as any).userId,
    });

    await logAction('api_created', 'API', api._id.toString(), (req as any).userId, {
      name: api.name,
      provider: api.provider,
    });

    res.status(201).json(api);
  } catch (err) {
    console.warn('Error creating API:', err);
    const mockAPI = { _id: Date.now().toString(), ...req.body, createdAt: new Date() };
    res.status(201).json(mockAPI);
  }
}));

// Update API
router.put('/apis/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const api = await dbService.updateAPI(req.params.id, {
    ...req.body,
    updatedBy: (req as any).userId,
  });

  if (!api) {
    return res.status(404).json({ error: 'API not found' });
  }

  await logAction('api_modified', 'API', req.params.id, (req as any).userId, req.body);
  res.json(api);
}));

// Delete API
router.delete('/apis/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const success = await dbService.deleteAPI(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'API not found' });
  }

  await logAction('api_deleted', 'API', req.params.id, (req as any).userId, {});
  res.json({ message: 'API deleted' });
}));

// Search APIs
router.get('/apis/search/:query', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const apis = await dbService.searchAPIs(req.params.query);
  res.json(apis);
}));

// ============================================================================
// AI PROVIDER ROUTES
// ============================================================================

// Get all AI providers
router.get('/ai-providers', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const providers = await dbService.getAllAIProviders();
    res.json(providers);
  } catch (err) {
    console.warn('Error getting AI providers, returning mock data:', err);
    res.json(mockAIProviders);
  }
}));

// Get single AI provider
router.get('/ai-providers/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const provider = await dbService.getAIProvider(req.params.id);
    if (!provider) {
      const mockProvider = mockAIProviders.find((p) => p._id === req.params.id);
      return res.json(mockProvider || { error: 'AI Provider not found' });
    }
    res.json(provider);
  } catch (err) {
    console.warn('Error getting AI provider, returning mock data:', err);
    const mockProvider = mockAIProviders.find((p) => p._id === req.params.id);
    res.json(mockProvider || { error: 'AI Provider not found' });
  }
}));

// Create AI provider
router.post('/ai-providers', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const provider = await dbService.createAIProvider({
      ...req.body,
      createdBy: (req as any).userId,
      updatedBy: (req as any).userId,
    });

    await logAction('ai_provider_created', 'AIProvider', provider._id.toString(), (req as any).userId, {
      type: provider.type,
    });

    res.status(201).json(provider);
  } catch (err) {
    console.warn('Error creating AI provider:', err);
    const mockProvider = { _id: Date.now().toString(), ...req.body, createdAt: new Date() };
    res.status(201).json(mockProvider);
  }
}));

// Update AI provider
router.put('/ai-providers/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const provider = await dbService.updateAIProvider(req.params.id, {
    ...req.body,
    updatedBy: (req as any).userId,
  });

  if (!provider) {
    return res.status(404).json({ error: 'AI Provider not found' });
  }

  await logAction('ai_provider_modified', 'AIProvider', req.params.id, (req as any).userId, req.body);
  res.json(provider);
}));

// ============================================================================
// PROVIDER ROUTES
// ============================================================================

router.get('/providers', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const providers = await dbService.getAllProviders();
  res.json(providers);
}));

router.get('/providers/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const provider = await dbService.getProvider(req.params.id);
  if (!provider) {
    return res.status(404).json({ error: 'Provider not found' });
  }
  res.json(provider);
}));

router.post('/providers', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const provider = await dbService.createProvider(req.body);
  res.status(201).json(provider);
}));

router.put('/providers/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const provider = await dbService.updateProvider(req.params.id, req.body);
  if (!provider) {
    return res.status(404).json({ error: 'Provider not found' });
  }
  res.json(provider);
}));

// ============================================================================
// SERVICE ROUTES
// ============================================================================

router.get('/services', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const services = await dbService.getAllServices();
  res.json(services);
}));

router.post('/services', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const service = await dbService.createService(req.body);
  res.status(201).json(service);
}));

// ============================================================================
// WEBHOOK ROUTES
// ============================================================================

router.get('/webhooks', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const webhooks = await dbService.getAllWebhooks();
  res.json(webhooks);
}));

router.post('/webhooks', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const webhook = await dbService.createWebhook(req.body);
  res.status(201).json(webhook);
}));

// ============================================================================
// CONNECTOR ROUTES
// ============================================================================

router.get('/connectors', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const connectors = await dbService.getAllConnectors();
  res.json(connectors);
}));

router.post('/connectors', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const connector = await dbService.createConnector(req.body);
  res.status(201).json(connector);
}));

// ============================================================================
// INTEGRATION ROUTES
// ============================================================================

router.get('/integrations', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const integrations = await dbService.getAllIntegrations();
  res.json(integrations);
}));

router.post('/integrations', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const integration = await dbService.createIntegration(req.body);
  res.status(201).json(integration);
}));

// ============================================================================
// USAGE & METRICS ROUTES
// ============================================================================

// Record API usage
router.post('/usage', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { apiId, requestCount, cost, unit } = req.body;

  const metrics = await dbService.recordUsage(apiId, requestCount, cost, unit);
  
  // Update API total usage
  const api = await dbService.getAPI(apiId);
  if (api) {
    await dbService.updateAPI(apiId, {
      monthlyUsage: (api.monthlyUsage || 0) + requestCount,
      cost: (api.cost || 0) + cost,
    });
  }

  res.status(201).json(metrics);
}));

// Get usage metrics
router.get('/usage/:apiId/:period', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const metrics = await dbService.getUsageMetrics(req.params.apiId, req.params.period);
  res.json(metrics);
}));

// ============================================================================
// ALERT ROUTES
// ============================================================================

// Get all alerts
router.get('/alerts', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    type: req.query.type as string,
    severity: req.query.severity as string,
    status: req.query.status as string,
  };

  const alerts = await dbService.getAllAlerts(filters);
  res.json(alerts);
}));

// Create alert
router.post('/alerts', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const alert = await dbService.createAlert(req.body);
  res.status(201).json(alert);
}));

// Update alert
router.put('/alerts/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const alert = await dbService.updateAlert(req.params.id, req.body);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
}));

// ============================================================================
// AUDIT LOG ROUTES
// ============================================================================

router.get('/audit', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    action: req.query.action as string,
    actor: req.query.actor as string,
    resourceType: req.query.resourceType as string,
  };

  const logs = await dbService.getAuditLog(filters);
  res.json(logs);
}));

// ============================================================================
// BILLING ROUTES
// ============================================================================

router.get('/billing/:apiId', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const billing = await dbService.getBillingByAPI(req.params.apiId);
  res.json(billing);
}));

router.post('/billing', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const billing = await dbService.createBillingEntry(req.body);
  res.status(201).json(billing);
}));

// ============================================================================
// WALLET ROUTES
// ============================================================================

router.get('/wallet', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const wallet = await dbService.getOrCreateWallet((req as any).userId);
  res.json(wallet);
}));

router.post('/wallet/charge', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { amount, reason, relatedApiId } = req.body;
  const wallet = await dbService.updateWalletBalance(
    (req as any).userId,
    -Math.abs(amount),
    reason,
    relatedApiId
  );

  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  res.json(wallet);
}));

// ============================================================================
// DASHBOARD ROUTES
// ============================================================================

router.get('/dashboard/metrics', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const metrics = await dbService.getDashboardMetrics();
  res.json(metrics);
}));

// ============================================================================
// HEALTH CHECK ROUTES
// ============================================================================

router.post('/health/:apiId', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const api = await dbService.recordHealthCheck(req.params.apiId, req.body);
  if (!api) {
    return res.status(404).json({ error: 'API not found' });
  }

  res.json(api);
}));

// ============================================================================
// ERROR HANDLER
// ============================================================================

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

export default router;
