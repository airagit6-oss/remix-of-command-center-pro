// ============================================================
// INFRASTRUCTURE ROUTES
// API endpoints for infrastructure monitoring and servers
// ============================================================

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Mock infrastructure servers data
const mockServers = [
  {
    name: 'Web Server 1',
    status: 'Healthy',
    cpu: 45,
    ram: 62,
    disk: 78,
    sparkline: [
      { v: 40 },
      { v: 42 },
      { v: 41 },
      { v: 45 },
      { v: 47 },
      { v: 45 },
      { v: 43 },
      { v: 45 },
      { v: 46 },
      { v: 44 },
    ]
  },
  {
    name: 'Database Server',
    status: 'Healthy',
    cpu: 72,
    ram: 85,
    disk: 65,
    sparkline: [
      { v: 65 },
      { v: 68 },
      { v: 70 },
      { v: 72 },
      { v: 74 },
      { v: 73 },
      { v: 71 },
      { v: 72 },
      { v: 70 },
      { v: 72 },
    ]
  },
  {
    name: 'Cache Server',
    status: 'Healthy',
    cpu: 28,
    ram: 45,
    disk: 32,
    sparkline: [
      { v: 25 },
      { v: 26 },
      { v: 27 },
      { v: 28 },
      { v: 29 },
      { v: 28 },
      { v: 27 },
      { v: 28 },
      { v: 29 },
      { v: 28 },
    ]
  },
  {
    name: 'API Gateway',
    status: 'Degraded',
    cpu: 88,
    ram: 92,
    disk: 45,
    sparkline: [
      { v: 75 },
      { v: 78 },
      { v: 82 },
      { v: 85 },
      { v: 88 },
      { v: 90 },
      { v: 89 },
      { v: 88 },
      { v: 87 },
      { v: 88 },
    ]
  },
];

export async function infrastructureRoutes(fastify: FastifyInstance) {
  // GET /infrastructure/servers - Get all servers
  fastify.get('/infrastructure/servers', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      return reply.send(mockServers);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch servers' });
    }
  });

  // GET /infrastructure/servers/:name - Get specific server
  fastify.get<{ Params: { name: string } }>(
    '/infrastructure/servers/:name',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name } = req.params;
        const server = mockServers.find(s => s.name === decodeURIComponent(name));
        if (!server) {
          return reply.status(404).send({ error: 'Server not found' });
        }
        return reply.send(server);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch server' });
      }
    }
  );

  // GET /infrastructure/status - Get overall infrastructure status
  fastify.get('/infrastructure/status', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const healthy = mockServers.filter(s => s.status === 'Healthy').length;
      const degraded = mockServers.filter(s => s.status === 'Degraded').length;
      const offline = mockServers.filter(s => s.status === 'Offline').length;
      
      return reply.send({
        status: degraded > 0 ? 'Degraded' : 'Healthy',
        healthy,
        degraded,
        offline,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch infrastructure status' });
    }
  });

  // GET /infrastructure/metrics - Get infrastructure metrics
  fastify.get('/infrastructure/metrics', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const avgCpu = mockServers.reduce((acc, s) => acc + s.cpu, 0) / mockServers.length;
      const avgRam = mockServers.reduce((acc, s) => acc + s.ram, 0) / mockServers.length;
      const avgDisk = mockServers.reduce((acc, s) => acc + s.disk, 0) / mockServers.length;

      return reply.send({
        cpu: Math.round(avgCpu),
        ram: Math.round(avgRam),
        disk: Math.round(avgDisk),
        serverCount: mockServers.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch infrastructure metrics' });
    }
  });

  // PUT /infrastructure/servers/:name - Update server
  fastify.put<{ Params: { name: string }; Body: any }>(
    '/infrastructure/servers/:name',
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name } = req.params;
        const server = mockServers.find(s => s.name === decodeURIComponent(name));
        if (!server) {
          return reply.status(404).send({ error: 'Server not found' });
        }
        Object.assign(server, req.body);
        return reply.send(server);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to update server' });
      }
    }
  );

  // POST /infrastructure/check - Run infrastructure health check
  fastify.post('/infrastructure/check', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const results = mockServers.map(s => ({
        name: s.name,
        status: s.status,
        healthy: s.status === 'Healthy',
        cpu: s.cpu,
        ram: s.ram,
        disk: s.disk
      }));

      return reply.send({
        timestamp: new Date().toISOString(),
        results,
        overallStatus: results.every(r => r.healthy) ? 'OK' : 'WARNING'
      });
    } catch (error) {
      reply.status(500).send({ error: 'Failed to run infrastructure check' });
    }
  });
}
