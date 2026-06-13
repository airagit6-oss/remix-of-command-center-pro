/**
 * Metrics Routes - System metrics and performance data
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Generate mock metrics data
function generateMetricsData(timePeriod: string = '1h') {
  const points = timePeriod === '5m' ? 5 : timePeriod === '15m' ? 15 : timePeriod === '1h' ? 60 : timePeriod === '6h' ? 72 : timePeriod === '24h' ? 96 : 168;
  
  return {
    cpu: Array.from({ length: points }, (_, i) => ({
      time: new Date(Date.now() - (points - i) * 60000).toISOString(),
      value: 25 + Math.sin(i * 0.3) * 20 + Math.random() * 10
    })),
    memory: Array.from({ length: points }, (_, i) => ({
      time: new Date(Date.now() - (points - i) * 60000).toISOString(),
      value: 45 + Math.sin(i * 0.4) * 15 + Math.random() * 8
    })),
    network: Array.from({ length: points }, (_, i) => ({
      time: new Date(Date.now() - (points - i) * 60000).toISOString(),
      value: 50 + Math.sin(i * 0.25) * 30 + Math.random() * 15
    })),
    io: Array.from({ length: points }, (_, i) => ({
      time: new Date(Date.now() - (points - i) * 60000).toISOString(),
      value: 30 + Math.sin(i * 0.35) * 20 + Math.random() * 12
    })),
  };
}

// ============================================================================
// GET /metrics - Get system metrics
// ============================================================================
router.get('/', (req: Request, res: Response) => {
  try {
    const timePeriod = (req.query.timePeriod as string) || '1h';
    const metrics = generateMetricsData(timePeriod);

    res.json({
      success: true,
      data: metrics,
      timePeriod,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// GET /metrics/summary - Get metrics summary
// ============================================================================
router.get('/summary', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        cpu: { current: 35, average: 32, min: 20, max: 55 },
        memory: { current: 45, average: 42, min: 30, max: 60 },
        network: { current: 50, average: 48, min: 20, max: 80 },
        io: { current: 30, average: 28, min: 10, max: 50 },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch metrics summary',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
