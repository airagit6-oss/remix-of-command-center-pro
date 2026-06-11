// ============================================================
// ALERTS ROUTES
// API endpoints for system alerts and monitoring
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Mock alerts data
const mockAlerts = [
  {
    id: 1,
    name: 'High CPU Usage',
    severity: 'Critical',
    status: 'Active',
    time: '5 minutes ago',
    rule: 'cpu > 80%'
  },
  {
    id: 2,
    name: 'Database Connection Timeout',
    severity: 'Critical',
    status: 'Active',
    time: '2 minutes ago',
    rule: 'db.timeout > 5s'
  },
  {
    id: 3,
    name: 'Memory Usage High',
    severity: 'Medium',
    status: 'Active',
    time: '10 minutes ago',
    rule: 'ram > 75%'
  },
  {
    id: 4,
    name: 'Disk Space Low',
    severity: 'Medium',
    status: 'Active',
    time: '15 minutes ago',
    rule: 'disk.free < 10GB'
  },
  {
    id: 5,
    name: 'API Response Slow',
    severity: 'Low',
    status: 'Active',
    time: '1 hour ago',
    rule: 'api.latency > 2s'
  },
  {
    id: 6,
    name: 'SSL Certificate Expiring',
    severity: 'Medium',
    status: 'Resolved',
    time: '2 hours ago',
    rule: 'cert.expiry < 30days'
  },
  {
    id: 7,
    name: 'Failed Login Attempts',
    severity: 'High',
    status: 'Active',
    time: '20 minutes ago',
    rule: 'failed_logins > 10'
  },
  {
    id: 8,
    name: 'Cache Miss Rate High',
    severity: 'Low',
    status: 'Active',
    time: '30 minutes ago',
    rule: 'cache.miss_rate > 20%'
  },
];

export async function alertsRoutes(fastify: FastifyInstance) {
  // GET /alerts - Get all alerts
  fastify.get('/alerts', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      return reply.send(mockAlerts);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch alerts' });
    }
  });

  // GET /alerts/:id - Get specific alert
  fastify.get(
    '/alerts/:id',
    async (req: any, reply: FastifyReply) => {
      try {
        const { id } = req.params;
        const alert = mockAlerts.find(a => a.id === parseInt(id));
        if (!alert) {
          return reply.status(404).send({ error: 'Alert not found' });
        }
        return reply.send(alert);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch alert' });
      }
    }
  );

  // GET /alerts/critical - Get critical alerts only
  fastify.get('/alerts/critical', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const critical = mockAlerts.filter(a => a.severity === 'Critical' && a.status === 'Active');
      return reply.send(critical);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch critical alerts' });
    }
  });

  // GET /alerts/active - Get active alerts
  fastify.get('/alerts/active', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const active = mockAlerts.filter(a => a.status === 'Active');
      return reply.send(active);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch active alerts' });
    }
  });

  // POST /alerts - Create new alert (for backend use)
  fastify.post(
    '/alerts',
    async (req: any, reply: FastifyReply) => {
      try {
        const newAlert = {
          id: mockAlerts.length + 1,
          ...(req.body || {})
        };
        mockAlerts.push(newAlert);
        return reply.status(201).send(newAlert);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to create alert' });
      }
    }
  );

  // PUT /alerts/:id - Update alert status
  fastify.put(
    '/alerts/:id',
    async (req: any, reply: FastifyReply) => {
      try {
        const { id } = req.params;
        const alert = mockAlerts.find(a => a.id === parseInt(id));
        if (!alert) {
          return reply.status(404).send({ error: 'Alert not found' });
        }
        Object.assign(alert, req.body || {});
        return reply.send(alert);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to update alert' });
      }
    }
  );

  // DELETE /alerts/:id - Resolve/dismiss alert
  fastify.delete(
    '/alerts/:id',
    async (req: any, reply: FastifyReply) => {
      try {
        const { id } = req.params;
        const index = mockAlerts.findIndex(a => a.id === parseInt(id));
        if (index === -1) {
          return reply.status(404).send({ error: 'Alert not found' });
        }
        const removed = mockAlerts.splice(index, 1);
        return reply.send(removed[0]);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to delete alert' });
      }
    }
  );
}
