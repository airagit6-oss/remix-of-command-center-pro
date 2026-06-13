/**
 * Apps Routes - Application/Service management
 */

import { Router, Request, Response } from 'express';

const router = Router();

const SERVICES = [
  {
    id: 'svc-1',
    name: 'api-gateway',
    status: 'Running',
    tier: 'Edge',
    region: 'us-east-1',
    version: 'v4.1.0',
    uptime: 99.5,
    responseMs: 50,
    cpu: 35,
    ram: 45,
    queue: 10,
    cacheHit: 85,
  },
  {
    id: 'svc-2',
    name: 'auth-service',
    status: 'Running',
    tier: 'Core',
    region: 'eu-west-1',
    version: 'v5.2.0',
    uptime: 99.8,
    responseMs: 75,
    cpu: 28,
    ram: 52,
    queue: 5,
    cacheHit: 78,
  },
  {
    id: 'svc-3',
    name: 'payments',
    status: 'Down',
    tier: 'Payments',
    region: 'us-west-2',
    version: 'v2.3.0',
    uptime: 98.2,
    responseMs: 200,
    cpu: 92,
    ram: 88,
    queue: 150,
    cacheHit: 45,
  },
];

// ============================================================================
// GET /apps - Get all apps/services
// ============================================================================
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: SERVICES,
      count: SERVICES.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch apps',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// GET /apps/:id - Get app details
// ============================================================================
router.get('/:id', (req: Request, res: Response) => {
  try {
    const service = SERVICES.find(s => s.id === req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({
      success: true,
      data: service,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch app details',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
