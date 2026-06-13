/**
 * Traces Routes - Request tracing and observability
 */

import { Router, Request, Response } from 'express';

const router = Router();

const SERVICES = [
  'api-gateway', 'auth-svc', 'payments', 'checkout', 'billing',
  'search-idx', 'media-cdn', 'ml-router', 'graphql', 'notifier',
];

const OPS = [
  'GET /v2/catalog', 'POST /auth/login', 'POST /pay/intent',
  'GET /user/me', 'POST /order/create', 'GET /search?q=*',
  'POST /upload', 'GET /feed', 'POST /ml/embed', 'DELETE /session',
];

const REGIONS = ['us-east-1', 'eu-west-1', 'ap-south-1', 'sa-east-1', 'us-west-2'];
const COUNTRIES = ['🇺🇸 US', '🇩🇪 DE', '🇮🇳 IN', '🇯🇵 JP', '🇧🇷 BR', '🇬🇧 GB', '🇫🇷 FR'];
const DEVICES = ['macOS·Chrome', 'iOS·Safari', 'Android·Chrome', 'Win·Edge', 'Linux·Firefox'];
const STATUSES = [200, 200, 200, 200, 200, 201, 204, 304, 400, 401, 403, 404, 429, 500, 502, 503];

function generateTraces(limit = 50) {
  return Array.from({ length: limit }, (_, i) => {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    return {
      id: `trace-${i + 1}`,
      reqId: `req-${Math.random().toString(36).substr(2, 9)}`,
      service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
      op: OPS[Math.floor(Math.random() * OPS.length)],
      user: `user-${Math.floor(Math.random() * 10000)}`,
      device: DEVICES[Math.floor(Math.random() * DEVICES.length)],
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
      status,
      duration: Math.floor(Math.random() * 5000),
      mem: Math.floor(Math.random() * 512),
      queries: Math.floor(Math.random() * 10),
      queue: Math.floor(Math.random() * 100),
      errors: status >= 400 ? 1 : 0,
      ts: Date.now() - Math.random() * 3600000,
    };
  });
}

// ============================================================================
// GET /traces - Get request traces
// ============================================================================
router.get('/', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const service = req.query.service as string;
    const status = req.query.status as string;

    let traces = generateTraces(limit);

    if (service) {
      traces = traces.filter(t => t.service === service);
    }

    if (status) {
      const statusCode = parseInt(status);
      traces = traces.filter(t => t.status === statusCode);
    }

    res.json({
      success: true,
      data: traces,
      count: traces.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch traces',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// GET /traces/:id - Get trace details
// ============================================================================
router.get('/:id', (req: Request, res: Response) => {
  try {
    const traces = generateTraces(1);
    const trace = traces[0];

    res.json({
      success: true,
      data: {
        ...trace,
        id: req.params.id,
        spans: [
          { name: 'auth', duration: 50 },
          { name: 'query', duration: 200 },
          { name: 'process', duration: 100 },
          { name: 'serialize', duration: 50 },
        ],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch trace details',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
