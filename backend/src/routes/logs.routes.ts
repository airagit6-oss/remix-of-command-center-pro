// ============================================================
// LOGS ROUTES
// API endpoints for system logs and event tracking
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Mock logs data
const mockLogs = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    eventType: 'login',
    userId: 'user_123',
    appName: 'Dashboard',
    status: 'success',
    message: 'User successfully logged in'
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 250000).toISOString(),
    eventType: 'api_call',
    userId: 'user_456',
    appName: 'Mobile App',
    status: 'success',
    message: 'API call to /products completed'
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 200000).toISOString(),
    eventType: 'payment',
    userId: 'user_789',
    appName: 'Checkout',
    status: 'success',
    message: 'Payment processed successfully'
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 150000).toISOString(),
    eventType: 'error',
    userId: 'user_321',
    appName: 'API Gateway',
    status: 'fail',
    message: 'Database connection timeout'
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 100000).toISOString(),
    eventType: 'app_launch',
    userId: 'user_654',
    appName: 'Web App',
    status: 'success',
    message: 'Application launched successfully'
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 50000).toISOString(),
    eventType: 'login',
    userId: 'user_987',
    appName: 'Admin Panel',
    status: 'success',
    message: 'Admin user logged in'
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 25000).toISOString(),
    eventType: 'api_call',
    userId: 'user_111',
    appName: 'Analytics',
    status: 'success',
    message: 'Analytics data synced'
  },
  {
    id: 8,
    timestamp: new Date(Date.now() - 10000).toISOString(),
    eventType: 'payment',
    userId: 'user_222',
    appName: 'Subscription',
    status: 'success',
    message: 'Monthly subscription renewed'
  },
];

export async function logsRoutes(fastify: FastifyInstance) {
  // GET /logs/filter - Filter logs by event type (must come before /:id)
  fastify.get<{ Querystring: { eventType: string } }>(
    '/logs/filter',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { eventType } = req.query;
        if (!eventType) {
          return reply.send(mockLogs);
        }
        const filtered = mockLogs.filter(l => l.eventType === eventType);
        return reply.send(filtered);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to filter logs' });
      }
    }
  );

  // GET /logs - Get all logs
  fastify.get('/logs', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      return reply.send(mockLogs);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch logs' });
    }
  });

  // GET /logs/:id - Get specific log
  fastify.get<{ Params: { id: string } }>(
    '/logs/:id',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = req.params;
        const log = mockLogs.find(l => l.id === parseInt(id));
        if (!log) {
          return reply.status(404).send({ error: 'Log not found' });
        }
        return reply.send(log);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch log' });
      }
    }
  );

  // POST /logs - Create new log entry (for backend use)
  fastify.post<{ Body: any }>(
    '/logs',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const newLog = {
          id: mockLogs.length + 1,
          timestamp: new Date().toISOString(),
          ...req.body
        };
        mockLogs.push(newLog);
        return reply.status(201).send(newLog);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to create log' });
      }
    }
  );
}
