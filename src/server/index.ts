/**
 * Express Server Setup for AI API Manager
 * Real backend with MongoDB integration
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import apiManagerRoutes from './routes/apiManager';
import cartRoutes from './routes/cart';
import metricsRoutes from './routes/metrics';
import infrastructureRoutes from './routes/infrastructure';
import tracesRoutes from './routes/traces';
import alertsRoutes from './routes/alerts';
import appsRoutes from './routes/apps';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/software-vala-ai-api-manager';

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS
app.use(cors({
  origin: [
    'http://localhost:4173',
    'http://localhost:4174',
    'http://localhost:4175',
    'http://localhost:4176',
    'http://localhost:4177',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
}));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ✓ RESPONSE: ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

async function connectDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully!');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error instanceof Error ? error.message : error);
    console.warn('📌 Running in mock mode - some endpoints will use in-memory data');
    return false;
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req: Request, res: Response) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(health);
});

// Also expose at /api/v1/health for frontend
app.get('/api/v1/health', (req: Request, res: Response) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(health);
});

// ============================================================================
// API ROUTES
// ============================================================================

// Mount API v1 routes (cart, metrics, infrastructure, traces, alerts, apps)
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/infrastructure', infrastructureRoutes);
app.use('/api/v1/traces', tracesRoutes);
app.use('/api/v1/alerts', alertsRoutes);
app.use('/api/v1/apps', appsRoutes);

// Also mount at root for compatibility
app.use('/cart', cartRoutes);
app.use('/metrics', metricsRoutes);
app.use('/infrastructure', infrastructureRoutes);
app.use('/traces', tracesRoutes);
app.use('/alerts', alertsRoutes);
app.use('/apps', appsRoutes);

// Mount API Manager routes with /api/ai-api-manager prefix
app.use('/api/ai-api-manager', apiManagerRoutes);

// Welcome endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: '🤖 AI API Manager - Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      apis: '/api/ai-api-manager/apis',
      aiProviders: '/api/ai-api-manager/ai-providers',
      providers: '/api/ai-api-manager/providers',
      services: '/api/ai-api-manager/services',
      webhooks: '/api/ai-api-manager/webhooks',
      connectors: '/api/ai-api-manager/connectors',
      integrations: '/api/ai-api-manager/integrations',
      usage: '/api/ai-api-manager/usage',
      alerts: '/api/ai-api-manager/alerts',
      audit: '/api/ai-api-manager/audit',
      billing: '/api/ai-api-manager/billing',
      wallet: '/api/ai-api-manager/wallet',
      dashboard: '/api/ai-api-manager/dashboard/metrics',
    },
    documentation: 'See AI_API_MANAGER_DOCUMENTATION.md',
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

let dbConnected = false;

async function startServer() {
  try {
    // Connect to database
    dbConnected = await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║     🤖 AI API Manager Backend - Running                ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Server:     http://localhost:${PORT}
║  Health:     http://localhost:${PORT}/health
║  API Base:   http://localhost:${PORT}/api
║                                                        ║
║  📍 API Endpoints:                                    ║
║  • GET    /api/ai-api-manager/apis                   ║
║  • POST   /api/ai-api-manager/apis                   ║
║  • GET    /api/ai-api-manager/ai-providers           ║
║  • POST   /api/ai-api-manager/alerts                 ║
║  • GET    /api/ai-api-manager/dashboard/metrics      ║
║  • GET    /api/ai-api-manager/audit                  ║
║  • POST   /api/ai-api-manager/usage                  ║
║  • GET    /api/ai-api-manager/wallet                 ║
║                                                        ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(29)} ║
║  Database:    ${(dbConnected ? 'Connected' : 'Mock Mode (in-memory)').padEnd(29)} ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

// Always start server when this file is executed
startServer();

export default app;
export { startServer };
