/**
 * Alerts Routes - System alerts and notifications
 */

import { Router, Request, Response } from 'express';

const router = Router();

const MOCK_ALERTS = [
  {
    id: 'alert-1',
    type: 'Critical',
    title: 'Database Connection Failed',
    description: 'MongoDB connection dropped. Retrying...',
    severity: 'critical',
    status: 'active',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    resolvable: true,
  },
  {
    id: 'alert-2',
    type: 'Warning',
    title: 'High Memory Usage',
    description: 'Memory usage at 85% capacity',
    severity: 'warning',
    status: 'active',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    resolvable: true,
  },
  {
    id: 'alert-3',
    type: 'Info',
    title: 'Scheduled Maintenance',
    description: 'System maintenance scheduled for 2:00 AM UTC',
    severity: 'info',
    status: 'active',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    resolvable: true,
  },
];

// ============================================================================
// GET /alerts - Get all alerts
// ============================================================================
router.get('/', (req: Request, res: Response) => {
  try {
    const severity = req.query.severity as string;
    const status = req.query.status as string;

    let alerts = [...MOCK_ALERTS];

    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }

    if (status) {
      alerts = alerts.filter(a => a.status === status);
    }

    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      stats: {
        critical: MOCK_ALERTS.filter(a => a.severity === 'critical').length,
        warning: MOCK_ALERTS.filter(a => a.severity === 'warning').length,
        info: MOCK_ALERTS.filter(a => a.severity === 'info').length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch alerts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// POST /alerts/:id/dismiss - Dismiss an alert
// ============================================================================
router.post('/:id/dismiss', (req: Request, res: Response) => {
  try {
    const alert = MOCK_ALERTS.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = 'dismissed';

    res.json({
      success: true,
      data: alert,
      message: 'Alert dismissed successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to dismiss alert',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// POST /alerts/:id/resolve - Resolve an alert
// ============================================================================
router.post('/:id/resolve', (req: Request, res: Response) => {
  try {
    const alert = MOCK_ALERTS.find(a => a.id === req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = 'resolved';

    res.json({
      success: true,
      data: alert,
      message: 'Alert resolved successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to resolve alert',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// POST /alerts/:id/mute - Mute an alert
// ============================================================================
router.post('/:id/mute', (req: Request, res: Response) => {
  try {
    const { duration } = req.body; // '1h', '1d', '1w'
    const alert = MOCK_ALERTS.find(a => a.id === req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = 'muted';

    res.json({
      success: true,
      data: alert,
      message: `Alert muted for ${duration}`,
      mutedUntil: new Date(Date.now() + (duration === '1w' ? 604800000 : duration === '1d' ? 86400000 : 3600000)).toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to mute alert',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
