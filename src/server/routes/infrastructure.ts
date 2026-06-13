/**
 * Infrastructure Routes - System infrastructure and services
 */

import { Router, Request, Response } from 'express';

const router = Router();

const SERVICES = [
  'api-gateway', 'auth-service', 'payments', 'checkout', 'billing',
  'search-index', 'media-cdn', 'ml-router', 'graphql', 'notifier',
];

const REGIONS = ['us-east-1', 'eu-west-1', 'ap-south-1', 'sa-east-1', 'us-west-2'];

// ============================================================================
// GET /infrastructure/services - Get all services
// ============================================================================
router.get('/services', (req: Request, res: Response) => {
  try {
    const services = SERVICES.map((name, i) => ({
      id: `svc-${i + 1}`,
      name,
      status: i % 3 === 0 ? 'Down' : 'Running',
      tier: ['Edge', 'Core', 'Data', 'AI', 'Payments'][i % 5],
      region: REGIONS[i % REGIONS.length],
      version: `v${4 + (i % 3)}.${i + 1}.0`,
      uptime: 99.5 - (i % 3) * 0.5,
      responseMs: 50 + i * 5,
      cpu: 35 + Math.random() * 30,
      ram: 45 + Math.random() * 30,
      riskScore: Math.random() * 60,
      costPerHour: 10 + i * 2,
      revenueImpact: 1000 + i * 500,
      lastDeploy: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }));

    res.json({
      success: true,
      data: services,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch infrastructure services',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// GET /infrastructure/regions - Get region status
// ============================================================================
router.get('/regions', (req: Request, res: Response) => {
  try {
    const regions = REGIONS.map(region => ({
      id: region,
      name: region,
      status: 'Operational',
      latency: 50 + Math.random() * 100,
      activeConnections: 1000 + Math.floor(Math.random() * 5000),
      throughput: 100 + Math.random() * 900,
    }));

    res.json({
      success: true,
      data: regions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch infrastructure regions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
